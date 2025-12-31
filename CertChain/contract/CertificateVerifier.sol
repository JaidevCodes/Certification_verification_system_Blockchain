// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertificateVerifier {
    struct Certificate {
        string issuerName;
        string studentName;
        string courseName;
        string ipfsHash;
        uint256 issueDate;
        bool isValid;
        address issuer;
        uint256 blockNumber;
    }

    // Mappings for certificate management
    mapping(bytes32 => Certificate) public certificates;
    mapping(string => bytes32) public cidToCertificateId;
    mapping(bytes32 => uint256) public certificateCreationBlock;
    mapping(address => bool) public authorizedIssuers;
    mapping(bytes32 => bool) public revokedCertificates;

    // Administrative state
    address public owner;
    bool public contractPaused;
    uint256 public totalCertificatesIssued;
    uint256 public totalCertificatesRevoked;

    // Events
    event CertificateIssued(
        bytes32 indexed certificateId,
        string studentName,
        string courseName,
        string ipfsHash,
        address indexed issuer,
        uint256 blockNumber
    );
    
    event CertificateRevoked(
        bytes32 indexed certificateId,
        address indexed revokedBy,
        uint256 revocationTime
    );
    
    event IssuerAuthorized(
        address indexed issuer,
        address authorizedBy
    );
    
    event IssuerRevoked(
        address indexed issuer,
        address revokedBy
    );
    
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );
    
    event ContractPaused(
        address pausedBy
    );
    
    event ContractUnpaused(
        address unpausedBy
    );

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "CertificateVerifier: Only owner can perform this action");
        _;
    }

    modifier whenNotPaused() {
        require(!contractPaused, "CertificateVerifier: Contract is paused");
        _;
    }

    modifier onlyAuthorizedIssuer() {
        require(
            msg.sender == owner || authorizedIssuers[msg.sender],
            "CertificateVerifier: Not authorized to issue certificates"
        );
        _;
    }

    modifier validAddress(address _address) {
        require(_address != address(0), "CertificateVerifier: Address cannot be zero");
        _;
    }

    modifier certificateExists(bytes32 _certificateId) {
        require(
            certificates[_certificateId].issuer != address(0),
            "CertificateVerifier: Certificate does not exist"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true; // Owner is automatically authorized
        contractPaused = false;
        totalCertificatesIssued = 0;
        totalCertificatesRevoked = 0;
    }

    /**
     * @dev Issue a new certificate
     * @param _issuerName Name of the issuing institution
     * @param _studentName Name of the student receiving the certificate
     * @param _courseName Name of the course completed
     * @param _ipfsHash IPFS CID hash of the certificate document
     * @return certificateId The unique identifier of the issued certificate
     */
    function issueCertificate(
        string memory _issuerName,
        string memory _studentName,
        string memory _courseName,
        string memory _ipfsHash
    ) 
        public 
        whenNotPaused 
        onlyAuthorizedIssuer 
        returns (bytes32) 
    {
        // Input validation
        require(bytes(_issuerName).length > 0, "CertificateVerifier: Issuer name cannot be empty");
        require(bytes(_studentName).length > 0, "CertificateVerifier: Student name cannot be empty");
        require(bytes(_courseName).length > 0, "CertificateVerifier: Course name cannot be empty");
        require(bytes(_ipfsHash).length > 0, "CertificateVerifier: IPFS hash cannot be empty");
        require(bytes(_ipfsHash).length >= 46, "CertificateVerifier: Invalid IPFS hash format");

        // Generate unique certificate ID
        bytes32 certificateId = keccak256(
            abi.encodePacked(
                _studentName,
                _courseName,
                _ipfsHash,
                block.timestamp,
                msg.sender,
                block.number
            )
        );

        // Check for duplicate certificates
        require(
            certificates[certificateId].issuer == address(0),
            "CertificateVerifier: Certificate already exists"
        );

        // Check for duplicate IPFS hash
        require(
            cidToCertificateId[_ipfsHash] == bytes32(0),
            "CertificateVerifier: IPFS hash already used for another certificate"
        );

        // Create new certificate
        certificates[certificateId] = Certificate({
            issuerName: _issuerName,
            studentName: _studentName,
            courseName: _courseName,
            ipfsHash: _ipfsHash,
            issueDate: block.timestamp,
            isValid: true,
            issuer: msg.sender,
            blockNumber: block.number
        });

        // Update mappings and counters
        cidToCertificateId[_ipfsHash] = certificateId;
        certificateCreationBlock[certificateId] = block.number;
        totalCertificatesIssued++;

        emit CertificateIssued(
            certificateId,
            _studentName,
            _courseName,
            _ipfsHash,
            msg.sender,
            block.number
        );

        return certificateId;
    }

    /**
     * @dev Verify certificate by its unique ID
     * @param _certificateId The certificate ID to verify
     * @return valid Whether the certificate is valid
     * @return issuerName Name of the issuer
     * @return studentName Name of the student
     * @return courseName Name of the course
     * @return ipfsHash IPFS hash of the certificate
     * @return issueDate Timestamp of issuance
     * @return issuer Address of the issuer
     * @return creationBlock Block number when created
     */
    function verifyById(bytes32 _certificateId)
        public
        view
        returns (
            bool valid,
            string memory issuerName,
            string memory studentName,
            string memory courseName,
            string memory ipfsHash,
            uint256 issueDate,
            address issuer,
            uint256 creationBlock
        )
    {
        Certificate memory cert = certificates[_certificateId];
        
        if (cert.issuer == address(0) || !cert.isValid || revokedCertificates[_certificateId]) {
            return (false, "", "", "", "", 0, address(0), 0);
        }
        
        return (
            true,
            cert.issuerName,
            cert.studentName,
            cert.courseName,
            cert.ipfsHash,
            cert.issueDate,
            cert.issuer,
            cert.blockNumber
        );
    }

    /**
     * @dev Verify certificate by IPFS CID hash
     * @param _ipfsHash The IPFS CID to verify
     * @return valid Whether the certificate is valid
     * @return certificateId The certificate ID
     * @return issuerName Name of the issuer
     * @return studentName Name of the student
     * @return courseName Name of the course
     * @return issueDate Timestamp of issuance
     * @return issuer Address of the issuer
     * @return creationBlock Block number when created
     */
    function verifyByCID(string memory _ipfsHash)
        public
        view
        returns (
            bool valid,
            bytes32 certificateId,
            string memory issuerName,
            string memory studentName,
            string memory courseName,
            uint256 issueDate,
            address issuer,
            uint256 creationBlock
        )
    {
        bytes32 certId = cidToCertificateId[_ipfsHash];
        
        if (certId == bytes32(0)) {
            return (false, bytes32(0), "", "", "", 0, address(0), 0);
        }

        Certificate memory cert = certificates[certId];

        if (!cert.isValid || revokedCertificates[certId]) {
            return (false, bytes32(0), "", "", "", 0, address(0), 0);
        }

        return (
            true,
            certId,
            cert.issuerName,
            cert.studentName,
            cert.courseName,
            cert.issueDate,
            cert.issuer,
            cert.blockNumber
        );
    }

    /**
     * @dev Check if certificate is confirmed (for handling indexing delays)
     * @param _certificateId The certificate ID to check
     * @return confirmed Whether the certificate is confirmed
     */
    function isCertificateConfirmed(bytes32 _certificateId) 
        public 
        view 
        returns (bool) 
    {
        Certificate memory cert = certificates[_certificateId];
        if (cert.issuer == address(0) || !cert.isValid || revokedCertificates[_certificateId]) {
            return false;
        }
        
        return block.number > cert.blockNumber;
    }

    /**
     * @dev Get detailed certificate status
     * @param _certificateId The certificate ID to check
     * @return exists Whether the certificate exists
     * @return valid Whether the certificate is valid
     * @return confirmed Whether the certificate is confirmed
     * @return blocksSinceCreation Number of blocks since creation
     * @return isRevoked Whether the certificate is revoked
     */
    function getCertificateStatus(bytes32 _certificateId) 
        public 
        view 
        returns (
            bool exists,
            bool valid,
            bool confirmed,
            uint256 blocksSinceCreation,
            bool isRevoked
        ) 
    {
        Certificate memory cert = certificates[_certificateId];
        exists = cert.issuer != address(0);
        isRevoked = revokedCertificates[_certificateId];
        valid = cert.isValid && exists && !isRevoked;
        confirmed = exists && (block.number > cert.blockNumber);
        blocksSinceCreation = exists ? block.number - cert.blockNumber : 0;
        
        return (exists, valid, confirmed, blocksSinceCreation, isRevoked);
    }

    /**
     * @dev Revoke a certificate (issuer or owner only)
     * @param _certificateId The certificate ID to revoke
     */
    function revokeCertificate(bytes32 _certificateId) 
        public 
        whenNotPaused
        certificateExists(_certificateId)
    {
        Certificate storage cert = certificates[_certificateId];
        
        require(
            cert.issuer == msg.sender || msg.sender == owner,
            "CertificateVerifier: Only the issuer or owner can revoke this certificate"
        );
        
        require(cert.isValid, "CertificateVerifier: Certificate is already invalid");
        require(!revokedCertificates[_certificateId], "CertificateVerifier: Certificate already revoked");

        cert.isValid = false;
        revokedCertificates[_certificateId] = true;
        totalCertificatesRevoked++;

        emit CertificateRevoked(_certificateId, msg.sender, block.timestamp);
    }

    /**
     * @dev Authorize a new issuer
     * @param _issuer Address of the issuer to authorize
     */
    function authorizeIssuer(address _issuer) 
        public 
        onlyOwner 
        validAddress(_issuer)
    {
        require(!authorizedIssuers[_issuer], "CertificateVerifier: Issuer already authorized");
        
        authorizedIssuers[_issuer] = true;
        emit IssuerAuthorized(_issuer, msg.sender);
    }

    /**
     * @dev Revoke issuer authorization
     * @param _issuer Address of the issuer to revoke
     */
    function revokeIssuer(address _issuer) 
        public 
        onlyOwner 
        validAddress(_issuer)
    {
        require(authorizedIssuers[_issuer], "CertificateVerifier: Issuer not authorized");
        require(_issuer != owner, "CertificateVerifier: Cannot revoke owner's authorization");
        
        authorizedIssuers[_issuer] = false;
        emit IssuerRevoked(_issuer, msg.sender);
    }

    /**
     * @dev Transfer ownership to a new address
     * @param _newOwner Address of the new owner
     */
    function transferOwnership(address _newOwner) 
        public 
        onlyOwner 
        validAddress(_newOwner)
    {
        require(_newOwner != owner, "CertificateVerifier: New owner must be different");
        
        address previousOwner = owner;
        owner = _newOwner;
        
        // Ensure new owner is authorized
        authorizedIssuers[_newOwner] = true;
        
        emit OwnershipTransferred(previousOwner, _newOwner);
    }

    /**
     * @dev Pause the contract (emergency only)
     */
    function pauseContract() public onlyOwner {
        require(!contractPaused, "CertificateVerifier: Contract already paused");
        
        contractPaused = true;
        emit ContractPaused(msg.sender);
    }

    /**
     * @dev Unpause the contract
     */
    function unpauseContract() public onlyOwner {
        require(contractPaused, "CertificateVerifier: Contract not paused");
        
        contractPaused = false;
        emit ContractUnpaused(msg.sender);
    }

    /**
     * @dev Get certificate details by ID
     * @param _certificateId The certificate ID
     * @return cert The certificate struct
     */
    function getCertificate(bytes32 _certificateId) 
        public 
        view 
        returns (Certificate memory cert) 
    {
        require(
            certificates[_certificateId].issuer != address(0),
            "CertificateVerifier: Certificate does not exist"
        );
        
        return certificates[_certificateId];
    }

    /**
     * @dev Check if an address is authorized to issue certificates
     * @param _issuer Address to check
     * @return isAuthorized Whether the address is authorized
     */
    function isIssuerAuthorized(address _issuer) 
        public 
        view 
        returns (bool) 
    {
        return authorizedIssuers[_issuer];
    }

    /**
     * @dev Get total statistics
     * @return issued Total certificates issued
     * @return revoked Total certificates revoked
     * @return active Total active certificates
     */
    function getStatistics() 
        public 
        view 
        returns (
            uint256 issued,
            uint256 revoked,
            uint256 active
        ) 
    {
        return (
            totalCertificatesIssued,
            totalCertificatesRevoked,
            totalCertificatesIssued - totalCertificatesRevoked
        );
    }

    /**
     * @dev Generate certificate ID from parameters (view function)
     * @param _studentName Student name
     * @param _courseName Course name
     * @param _ipfsHash IPFS hash
     * @param _issuer Issuer address
     * @return certificateId The predicted certificate ID
     */
    function predictCertificateId(
        string memory _studentName,
        string memory _courseName,
        string memory _ipfsHash,
        address _issuer
    ) 
        public 
        view 
        returns (bytes32) 
    {
        return keccak256(
            abi.encodePacked(
                _studentName,
                _courseName,
                _ipfsHash,
                block.timestamp,
                _issuer,
                block.number
            )
        );
    }

    /**
     * @dev Check if IPFS hash is already used
     * @param _ipfsHash IPFS hash to check
     * @return isUsed Whether the hash is already used
     */
    function isIPFSHashUsed(string memory _ipfsHash) 
        public 
        view 
        returns (bool) 
    {
        return cidToCertificateId[_ipfsHash] != bytes32(0);
    }

    /**
     * @dev Emergency recovery function for incorrectly revoked certificates (owner only)
     * @param _certificateId Certificate ID to restore
     */
    function restoreCertificate(bytes32 _certificateId) 
        public 
        onlyOwner 
        certificateExists(_certificateId)
    {
        require(revokedCertificates[_certificateId], "CertificateVerifier: Certificate not revoked");
        
        certificates[_certificateId].isValid = true;
        revokedCertificates[_certificateId] = false;
        totalCertificatesRevoked--;
    }
}