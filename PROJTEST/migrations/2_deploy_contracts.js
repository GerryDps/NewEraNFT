// migrations/2_deploy.js
// SPDX-License-Identifier: MIT
const MyNFTERC721 = artifacts.require("MyNFTERC721");

module.exports = function(deployer) {
    deployer.deploy(MyNFTERC721,"NewEraNFT","NENFT","https://my-json-server.typicode.com/gerrydps/NewEraNFT/NewEraNFT/");
};