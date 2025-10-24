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
    }

    mapping(bytes32 => Certificate) public certificates; // by certificateId
    mapping(string => bytes32) public cidToCertificateId; // allows lookup by IPFS hash

    address public owner;

    event CertificateIssued(
        bytes32 indexed certificateId,
        string studentName,
        string courseName,
        string ipfsHash,
        address indexed issuer
    );
    event CertificateRevoked(bytes32 indexed certificateId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // ✅ ISSUE CERTIFICATE
    function issueCertificate(
        string memory _issuerName,
        string memory _studentName,
        string memory _courseName,
        string memory _ipfsHash
    ) public returns (bytes32) {
        require(bytes(_studentName).length > 0, "Student name cannot be empty");
        require(bytes(_courseName).length > 0, "Course name cannot be empty");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");

        bytes32 certificateId = keccak256(
            abi.encodePacked(_studentName, _courseName, _ipfsHash, block.timestamp, msg.sender)
        );

        require(!certificates[certificateId].isValid, "Certificate already exists");

        certificates[certificateId] = Certificate({
            issuerName: _issuerName,
            studentName: _studentName,
            courseName: _courseName,
            ipfsHash: _ipfsHash,
            issueDate: block.timestamp,
            isValid: true,
            issuer: msg.sender
        });

        // Map IPFS hash → Certificate ID
        cidToCertificateId[_ipfsHash] = certificateId;

        emit CertificateIssued(certificateId, _studentName, _courseName, _ipfsHash, msg.sender);
        return certificateId;
    }

    // ✅ VERIFY BY CERTIFICATE ID
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
            address issuer
        )
    {
        Certificate memory cert = certificates[_certificateId];
        if (!cert.isValid) {
            return (false, "", "", "", "", 0, address(0));
        }
        return (true, cert.issuerName, cert.studentName, cert.courseName, cert.ipfsHash, cert.issueDate, cert.issuer);
    }

    // ✅ VERIFY BY CID HASH
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
            address issuer
        )
    {
        bytes32 certId = cidToCertificateId[_ipfsHash];
        Certificate memory cert = certificates[certId];

        if (!cert.isValid) {
            return (false, bytes32(0), "", "", "", 0, address(0));
        }

        return (true, certId, cert.issuerName, cert.studentName, cert.courseName, cert.issueDate, cert.issuer);
    }

    // ✅ REVOKE CERTIFICATE (issuer or owner only)
    function revokeCertificate(bytes32 _certificateId) public {
        Certificate storage cert = certificates[_certificateId];
        require(cert.isValid, "Certificate does not exist or is already revoked");
        require(
            cert.issuer == msg.sender || msg.sender == owner,
            "Only the issuer or owner can revoke this certificate"
        );

        cert.isValid = false;
        emit CertificateRevoked(_certificateId);
    }

    // ✅ CHANGE OWNER
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        owner = _newOwner;
    }
}
