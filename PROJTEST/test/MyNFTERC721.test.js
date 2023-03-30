// Based on https://github.com/OpenZeppelin/openzeppelin-solidity/blob/v2.5.1/test/examples/SimpleToken.test.js

const { expect } = require('chai');

// Import accounts

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

// Import utilities from Test Helpers
const {expectEvent, expectRevert, constants } = require('@openzeppelin/test-helpers');

// Load compiled artifacts
const MyNFTERC721 = artifacts.require('MyNFTERC721');

// Start test block "NewEraNFT","NENFT","https://my-json-server.typicode.com/gerrydps/NewEraNFT/NewEraNFT/"
contract('MyNFTERC721', function ([ creator ]) {
  const NAME = 'NewEraNFT';
  const SYMBOL = 'NENFT';
  const TOKEN_URI = "https://my-json-server.typicode.com/gerrydps/NewEraNFT/NewEraNFT/"

  beforeEach(async function () {
    this.nft = await MyNFTERC721.new(NAME, SYMBOL, TOKEN_URI, {from: creator });
  });

  it('mint check', async function () {
    const receipt = await this.nft.buyNFT({from: creator, value : web3.utils.toWei('1', 'ether')});
    expectEvent(receipt, 'Transfer');
  });

  it('mint check with 0 ether', async function () {
    await expectRevert(this.nft.buyNFT({from: creator, value : web3.utils.toWei('0.1', 'ether')}), 'You need more ether');
  });

  it('burn check', async function () {
    await this.nft.buyNFT({from: creator, value : web3.utils.toWei('1', 'ether')});
    const receipt = await this.nft.burn(0,{from: creator});
    expectEvent(receipt, 'Transfer');
  });

  it('burn check not owned', async function () {
    await this.nft.buyNFT({from: creator, value : web3.utils.toWei('1', 'ether')});
    await expectRevert.unspecified(this.nft.burn(1,{from: creator}));
  });

  it('send check', async function () {
    to = "0xEEB1dA9351f9DD4c4DeE4bF36e1026d327AC65C0";
    await this.nft.buyNFT({from: creator, value : web3.utils.toWei('1', 'ether')});
    const receipt = await this.nft.safeTransferFrom(creator,to,0,{from: creator});
    expectEvent(receipt, 'Transfer');
  });

});
