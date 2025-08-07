import { expect } from "chai";
import { ethers } from "hardhat";
import { CertificateVerifier } from "../typechain-types";

describe("CertificateVerifier", function () {
  let certificateVerifier: CertificateVerifier;
  let owner: any;
  let issuer: any;
  let user: any;

  beforeEach(async function () {
    [owner, issuer, user] = await ethers.getSigners();

    const CertificateVerifier = await ethers.getContractFactory("CertificateVerifier");
    certificateVerifier = await CertificateVerifier.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await certificateVerifier.owner()).to.equal(owner.address);
    });

    it("Should authorize the owner as an issuer", async function () {
      expect(await certificateVerifier.authorizedIssuers(owner.address)).to.be.true;
    });
  });

  describe("Certificate Issuance", function () {
    it("Should allow authorized issuer to issue certificate", async function () {
      // Authorize the issuer
      await certificateVerifier.authorizeIssuer(issuer.address);

      // Issue certificate
      const tx = await certificateVerifier.connect(issuer).issueCertificate(
        "Test University",
        "John Doe",
        "Computer Science",
        "QmTestHash123"
      );

      const receipt = await tx.wait();
      expect(receipt.status).to.equal(1);
    });

    it("Should not allow unauthorized issuer to issue certificate", async function () {
      await expect(
        certificateVerifier.connect(user).issueCertificate(
          "Test University",
          "John Doe",
          "Computer Science",
          "QmTestHash123"
        )
      ).to.be.revertedWith("Not authorized to issue certificates");
    });

    it("Should not allow empty student name", async function () {
      await expect(
        certificateVerifier.issueCertificate(
          "Test University",
          "",
          "Computer Science",
          "QmTestHash123"
        )
      ).to.be.revertedWith("Student name cannot be empty");
    });

    it("Should not allow empty course name", async function () {
      await expect(
        certificateVerifier.issueCertificate(
          "Test University",
          "John Doe",
          "",
          "QmTestHash123"
        )
      ).to.be.revertedWith("Course name cannot be empty");
    });

    it("Should not allow empty IPFS hash", async function () {
      await expect(
        certificateVerifier.issueCertificate(
          "Test University",
          "John Doe",
          "Computer Science",
          ""
        )
      ).to.be.revertedWith("IPFS hash cannot be empty");
    });
  });

  describe("Certificate Verification", function () {
    let certificateId: string;

    beforeEach(async function () {
      // Issue a certificate first
      const tx = await certificateVerifier.issueCertificate(
        "Test University",
        "John Doe",
        "Computer Science",
        "QmTestHash123"
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = certificateVerifier.interface.parseLog(log);
          return parsed.name === 'CertificateIssued';
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = certificateVerifier.interface.parseLog(event);
        certificateId = parsed.args[0];
      }
    });

    it("Should verify valid certificate", async function () {
      const result = await certificateVerifier.verifyCertificate(certificateId);
      expect(result[0]).to.be.true; // isValid
      expect(result[1]).to.equal("Test University"); // issuerName
      expect(result[2]).to.equal("John Doe"); // studentName
      expect(result[3]).to.equal("Computer Science"); // courseName
      expect(result[4]).to.equal("QmTestHash123"); // ipfsHash
    });

    it("Should return false for non-existent certificate", async function () {
      const fakeId = ethers.keccak256(ethers.toUtf8Bytes("fake"));
      const result = await certificateVerifier.verifyCertificate(fakeId);
      expect(result[0]).to.be.false;
    });

    it("Should return certificate details", async function () {
      const details = await certificateVerifier.getCertificateDetails(certificateId);
      expect(details[0]).to.equal("Test University"); // issuerName
      expect(details[1]).to.equal("John Doe"); // studentName
      expect(details[2]).to.equal("Computer Science"); // courseName
      expect(details[3]).to.equal("QmTestHash123"); // ipfsHash
      expect(details[5]).to.be.true; // isValid
      expect(details[6]).to.equal(owner.address); // issuer
    });
  });

  describe("Certificate Revocation", function () {
    let certificateId: string;

    beforeEach(async function () {
      // Issue a certificate first
      const tx = await certificateVerifier.issueCertificate(
        "Test University",
        "John Doe",
        "Computer Science",
        "QmTestHash123"
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = certificateVerifier.interface.parseLog(log);
          return parsed.name === 'CertificateIssued';
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = certificateVerifier.interface.parseLog(event);
        certificateId = parsed.args[0];
      }
    });

    it("Should allow issuer to revoke certificate", async function () {
      await certificateVerifier.revokeCertificate(certificateId);
      
      const result = await certificateVerifier.verifyCertificate(certificateId);
      expect(result[0]).to.be.false;
    });

    it("Should allow owner to revoke any certificate", async function () {
      // Authorize another issuer
      await certificateVerifier.authorizeIssuer(issuer.address);
      
      // Issue certificate with different issuer
      const tx = await certificateVerifier.connect(issuer).issueCertificate(
        "Another University",
        "Jane Doe",
        "Mathematics",
        "QmAnotherHash456"
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = certificateVerifier.interface.parseLog(log);
          return parsed.name === 'CertificateIssued';
        } catch {
          return false;
        }
      });

      let newCertificateId: string;
      if (event) {
        const parsed = certificateVerifier.interface.parseLog(event);
        newCertificateId = parsed.args[0];
      }

      // Owner should be able to revoke
      await certificateVerifier.revokeCertificate(newCertificateId);
      
      const result = await certificateVerifier.verifyCertificate(newCertificateId);
      expect(result[0]).to.be.false;
    });

    it("Should not allow unauthorized user to revoke certificate", async function () {
      await expect(
        certificateVerifier.connect(user).revokeCertificate(certificateId)
      ).to.be.revertedWith("Not authorized to issue certificates");
    });
  });

  describe("Issuer Management", function () {
    it("Should allow owner to authorize issuer", async function () {
      await certificateVerifier.authorizeIssuer(issuer.address);
      expect(await certificateVerifier.authorizedIssuers(issuer.address)).to.be.true;
    });

    it("Should allow owner to revoke issuer", async function () {
      await certificateVerifier.authorizeIssuer(issuer.address);
      await certificateVerifier.revokeIssuer(issuer.address);
      expect(await certificateVerifier.authorizedIssuers(issuer.address)).to.be.false;
    });

    it("Should not allow non-owner to authorize issuer", async function () {
      await expect(
        certificateVerifier.connect(user).authorizeIssuer(issuer.address)
      ).to.be.revertedWith("Only owner can perform this action");
    });

    it("Should not allow non-owner to revoke issuer", async function () {
      await expect(
        certificateVerifier.connect(user).revokeIssuer(issuer.address)
      ).to.be.revertedWith("Only owner can perform this action");
    });

    it("Should not allow owner to revoke themselves", async function () {
      await expect(
        certificateVerifier.revokeIssuer(owner.address)
      ).to.be.revertedWith("Cannot revoke owner");
    });
  });

  describe("Ownership", function () {
    it("Should allow owner to transfer ownership", async function () {
      await certificateVerifier.transferOwnership(issuer.address);
      expect(await certificateVerifier.owner()).to.equal(issuer.address);
    });

    it("Should not allow non-owner to transfer ownership", async function () {
      await expect(
        certificateVerifier.connect(user).transferOwnership(issuer.address)
      ).to.be.revertedWith("Only owner can perform this action");
    });

    it("Should not allow transfer to zero address", async function () {
      await expect(
        certificateVerifier.transferOwnership(ethers.ZeroAddress)
      ).to.be.revertedWith("New owner cannot be zero address");
    });
  });
});