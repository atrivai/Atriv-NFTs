// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AtrivNFTs is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter public tokenIdCounter;
    uint256 public maxTokensPerAddress;
    mapping(address => uint256) public mintedTokensByAddress;
    uint256 public mintingPrice;

    // Constructor to initialize the contract parameters
    constructor(
        string memory name_,
        string memory symbol_,
        string memory _baseURI,
        uint256 _maxSupply,
        uint256 _maxTokensPerAddress,
        uint256 _mintingPrice
    )
        ERC721(name_, symbol_, _baseURI, _maxSupply) // Adjusted constructor (removed _maxSupply, _baseURI)
    {
       // _setBaseURI(_baseURI); // Separate base URI setup
        maxTokensPerAddress = _maxTokensPerAddress;
        mintingPrice = _mintingPrice;
    }

    // Function to mint tokens
    function mint(address to, uint256 amount) public payable {
        require(mintedTokensByAddress[to] + amount <= maxTokensPerAddress, "Exceeds max tokens allowed per address");
        require(msg.value == mintingPrice * amount, "Ether sent is not correct");

        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = tokenIdCounter.current();
            tokenIdCounter.increment();
            _mint(to, tokenId);
            mintedTokensByAddress[to]++;
        }
    }

    // Function to set minting price
    

    // Function to withdraw the contract balance to the owner's account
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    function getMaxTokensPerAddress() public view returns (uint256) {
        return maxTokensPerAddress;
    }

    function getMintingPrice() public view returns (uint256) {
        return mintingPrice;
    }

    function getTotalMinted() public view returns (uint256) {
        return tokenIdCounter.current();
    }

    function setMaxTokensPerAddress(uint256 _maxTokensPerAddress) public onlyOwner {
        maxTokensPerAddress = _maxTokensPerAddress;
    }

    function setMintingPrice(uint256 _newPrice) public onlyOwner {
        mintingPrice = _newPrice;
    }

     function baseURI() public view virtual returns (string memory) {
        return _baseURI();
    }

    // Removed all functions and events related to whitelisting
}
