const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AtrivNFTs", function () {
  let atriv, owner, addr1, addr2;
  //console.log("address 1", addr1.address);

  beforeEach(async () => {
    const Atriv = await ethers.getContractFactory("AtrivNFTs");
    // Deploy the contract with: name, symbol, baseURI, maxSupply, maxTokensPerAddress, mintingPrice
    atriv = await Atriv.deploy("AtrivToken", "ATR", "ipfs://QmYnjq9ZcSm48bZuKwhF6cY2TrD2CXmQJTpDwKdaUUEGEm", 10000, 10, ethers.utils.parseEther("0.01"));
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await atriv.owner()).to.equal(owner.address);
    });

    it("Should set the right minting price", async function () {
      expect(await atriv.mintingPrice()).to.equal(ethers.utils.parseEther("0.01"));
    });
  });

  describe("Minting", function () {
    it("Should mint the right amount of tokens", async function () {
      await atriv.connect(addr1).mint(addr1.address, 1, { value: ethers.utils.parseEther("0.01") });
      expect(await atriv.balanceOf(addr1.address)).to.equal(1);
    });

    it("Should revert if ether sent is not correct", async function () {
      await expect(atriv.connect(addr1).mint(addr1.address, 1, { value: ethers.utils.parseEther("0.02") }))
        .to.be.revertedWith("Ether sent is not correct");
    });

    it("Should revert if minting exceeds max tokens allowed per address", async function () {
      await expect(atriv.connect(owner).mint(addr1.address, 11, { value: ethers.utils.parseEther("0.11") }))
        .to.be.revertedWith("Exceeds max tokens allowed per address");
    });
  });

  describe("Adjustments", function () {
    it("Should allow owner to set minting price", async function () {
        await atriv.connect(owner).setMintingPrice(ethers.utils.parseEther("0.02"));
        expect(await atriv.getMintingPrice()).to.equal(ethers.utils.parseEther("0.02"));
    });

    it("Should not allow non-owner to set minting price", async function () {
        await expect(atriv.connect(addr1).setMintingPrice(ethers.utils.parseEther("0.02")))
            .to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to set max tokens per address", async function () {
        await atriv.connect(owner).setMaxTokensPerAddress(15);
        expect(await atriv.getMaxTokensPerAddress()).to.equal(15);
    });

    it("Should not allow non-owner to set max tokens per address", async function () {
        await expect(atriv.connect(addr1).setMaxTokensPerAddress(15))
            .to.be.revertedWith("Ownable: caller is not the owner");
    });
});

describe("Withdrawals", function () {
    it("Should allow owner to withdraw", async function () {
        // Minting to have some balance in contract
        await atriv.connect(addr1).mint(addr1.address, 1, { value: ethers.utils.parseEther("0.01") });

        const initialBalance = await ethers.provider.getBalance(owner.address);
        await atriv.connect(owner).withdraw();
        const finalBalance = await ethers.provider.getBalance(owner.address);

        expect(finalBalance).to.be.gt(initialBalance);
    });

    it("Should not allow non-owner to withdraw", async function () {
        await expect(atriv.connect(addr1).withdraw())
            .to.be.revertedWith("Ownable: caller is not the owner");
    });
});


describe("Base URI", function () {
  it("Should return the correct base URI", async function () {
      expect(await atriv.baseURI()).to.equal("ipfs://QmYnjq9ZcSm48bZuKwhF6cY2TrD2CXmQJTpDwKdaUUEGEm");
  });
});


describe("Getters", function () {
    it("Should return correct max tokens per address", async function () {
        expect(await atriv.getMaxTokensPerAddress()).to.equal(10);
    });

    it("Should return correct minting price", async function () {
        expect(await atriv.getMintingPrice()).to.equal(ethers.utils.parseEther("0.01"));
    });

    it("Should return correct total minted tokens after minting", async function () {
        await atriv.connect(addr1).mint(addr1.address, 3, { value: ethers.utils.parseEther("0.03") });
        expect(await atriv.getTotalMinted()).to.equal(3);
    });
});

// Tests for ERC721 functions accessed through AtrivBeta instance
  
it("Should return token name", async () => {
  expect(await atriv.name()).to.equal("AtrivToken");
});

it("Should return token symbol", async () => {
  expect(await atriv.symbol()).to.equal("ATR");
});

it("Should return correct token URI", async () => {
  await atriv.mint(addr1.address, 1, { value: ethers.utils.parseEther('0.01') });
  expect(await atriv.tokenURI(0)).to.equal("ipfs://QmYnjq9ZcSm48bZuKwhF6cY2TrD2CXmQJTpDwKdaUUEGEm/0.json");
});

it("Should allow token approval", async () => {
  await atriv.mint(addr1.address, 1, { value: ethers.utils.parseEther('0.01') });
  await atriv.connect(addr1).approve(addr2.address, 0);
  expect(await atriv.getApproved(0)).to.equal(addr2.address);
});

it("Should allow setApprovalForAll and check isApprovedForAll", async () => {
  await atriv.mint(addr1.address, 1, { value: ethers.utils.parseEther('0.01') });
  await atriv.connect(addr1).setApprovalForAll(addr2.address, true);
  expect(await atriv.isApprovedForAll(addr1.address, addr2.address)).to.equal(true);
});

it("Should return correct balance for owner", async () => {
  await atriv.mint(addr1.address, 1, { value: ethers.utils.parseEther('0.01') });
  expect(await atriv.balanceOf(addr1.address)).to.equal(1);
});


it("Should allow safe transfers", async () => {
  await atriv.mint(addr1.address, 1, { value: ethers.utils.parseEther('0.01') });
  //await atriv.connect(addr1).approve(addr2.address, 0);
  await atriv.connect(addr1).safeTransferFrom(addr1.address, addr2.address, 0);
  expect(await atriv.ownerOf(0)).to.equal(addr2.address);
});

it("Should revert if unauthorized address attempts to transfer a token", async () => {
  await atriv.mint(addr1.address, 1, { value: ethers.utils.parseEther('0.01') });
  await expect(atriv.connect(addr2).transferFrom(addr1.address, addr2.address, 0))
    .to.be.revertedWith("ERC721: caller is not token owner or approved");
});

it("Should return correct total supply", async () => {
  await atriv.mint(addr1.address, 1, { value: ethers.utils.parseEther('0.01') });
  expect(await atriv.totalSupply()).to.equal(1);
});

it("Should return correct owner of a token", async () => {
  await atriv.mint(addr1.address, 1, { value: ethers.utils.parseEther('0.01') });
  expect(await atriv.ownerOf(0)).to.equal(addr1.address);
});

it("Should return correct balance for owner", async () => {
  await atriv.mint(addr1.address, 1, { value: ethers.utils.parseEther('0.01') });
  expect(await atriv.balanceOf(addr1.address)).to.equal(1);
});

it("Should revert for querying balance of address zero", async () => {
  await expect(atriv.balanceOf(ethers.constants.AddressZero))
      .to.be.revertedWith("ERC721: address zero is not a valid owner");
});

it("Should return correct owner of a token", async () => {
  await atriv.mint(addr1.address, 1, { value: ethers.utils.parseEther('0.01') });
  expect(await atriv.ownerOf(0)).to.equal(addr1.address);
});

it("Should revert for querying owner of an invalid token ID", async () => {
  await expect(atriv.ownerOf(9999))  // Assuming 9999 is an invalid token ID
      .to.be.revertedWith("ERC721: invalid token ID");
});




});
