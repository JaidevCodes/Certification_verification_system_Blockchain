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
    
    mapping(bytes32 => Certificate) public certificates;
    mapping(address => bool) public authorizedIssuers;
    address public owner;
    
    event CertificateIssued(bytes32 indexed certificateId, string studentName, string courseName, string ipfsHash);
    event CertificateRevoked(bytes32 indexed certificateId);
    event IssuerAuthorized(address indexed issuer);
    event IssuerRevoked(address indexed issuer);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender] || msg.sender == owner, "Not authorized to issue certificates");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true;
    }
    
    function issueCertificate(
        string memory _issuerName,
        string memory _studentName,
        string memory _courseName,
        string memory _ipfsHash
    ) public onlyAuthorizedIssuer returns (bytes32) {
        require(bytes(_studentName).length > 0, "Student name cannot be empty");
        require(bytes(_courseName).length > 0, "Course name cannot be empty");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        
        bytes32 certificateId = keccak256(abi.encodePacked(_studentName, _courseName, _ipfsHash, block.timestamp));
        
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
        
        emit CertificateIssued(certificateId, _studentName, _courseName, _ipfsHash);
        return certificateId;
    }
    
    function verifyCertificate(bytes32 _certificateId) public view returns (bool, string memory, string memory, string memory, string memory, uint256) {
        Certificate memory cert = certificates[_certificateId];
        if (!cert.isValid) {
            return (false, "", "", "", "", 0);
        }
        return (true, cert.issuerName, cert.studentName, cert.courseName, cert.ipfsHash, cert.issueDate);
    }
    
    function revokeCertificate(bytes32 _certificateId) public onlyAuthorizedIssuer {
        require(certificates[_certificateId].isValid, "Certificate does not exist or is already revoked");
        require(
            certificates[_certificateId].issuer == msg.sender || msg.sender == owner,
            "Only the issuer or owner can revoke this certificate"
        );
        
        certificates[_certificateId].isValid = false;
        emit CertificateRevoked(_certificateId);
    }
    
    function authorizeIssuer(address _issuer) public onlyOwner {
        authorizedIssuers[_issuer] = true;
        emit IssuerAuthorized(_issuer);
    }
    
    function revokeIssuer(address _issuer) public onlyOwner {
        require(_issuer != owner, "Cannot revoke owner");
        authorizedIssuers[_issuer] = false;
        emit IssuerRevoked(_issuer);
    }
    
    function getCertificateDetails(bytes32 _certificateId) public view returns (
        string memory issuerName,
        string memory studentName,
        string memory courseName,
        string memory ipfsHash,
        uint256 issueDate,
        bool isValid,
        address issuer
    ) {
        Certificate memory cert = certificates[_certificateId];
        return (cert.issuerName, cert.studentName, cert.courseName, cert.ipfsHash, cert.issueDate, cert.isValid, cert.issuer);
    }
    
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        owner = _newOwner;
        authorizedIssuers[_newOwner] = true;
    }
}