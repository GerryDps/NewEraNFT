App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load minted nft. //or ../nft.json
    return await App.initWeb3();
  },

  initWeb3: async function() { 
    if (window.ethereum){
      App.web3Provider = window.ethereum;
      try{
        await window.ethereum.enable();
      }catch(error){
        console.error(error)
      }
    }
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    else{
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('MyNFTERC721.json', function(data){
      var nftArtifact = data;
      App.contracts.MyNFTERC721 = TruffleContract(nftArtifact);
      App.contracts.MyNFTERC721.setProvider(App.web3Provider);
    });
    return App.mintednft();
  },

  mintednft: function(){
    $.getJSON('https://my-json-server.typicode.com/gerrydps/NewEraNFT/NewEraNFT', function(data) {
      var nftRow = $('#nftRow');
      var nftTemplate = $('#nftTemplate');
      var supplyTot = 0;
      var nftInstance;

      App.contracts.MyNFTERC721.deployed().then(function(instance){
        nftInstance = instance;
        return nftInstance.totalSupply.call();
      }).then(async function(totalsupply){
        supplyTot = parseInt(totalsupply.c[0]);
        for (i = 0; i < supplyTot; i ++) {
          x = await nftInstance.tokenByIndex.call(i);
          id = x.c[0];
          nftTemplate.find('.panel-title').text(data[id].name);
          nftTemplate.find('img').attr('src', data[id].image);
          nftTemplate.find('.nft-price').text(data[id].price);
          nftTemplate.find('.nft-id').text(data[id].id);
          nftTemplate.find('.nft-rarity').text(data[id].rarity);
          nftRow.append(nftTemplate.html());
        }
      }).catch(function(err){
        console.log(err.message);
      });
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
