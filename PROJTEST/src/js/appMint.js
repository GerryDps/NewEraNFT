App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
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
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-mint', App.mintNFT);
  },

  mintNFT: function(event) {
    event.preventDefault();
    web3.eth.getAccounts(function(error,accounts){
      if(error){console.log(error);}
      var account = accounts[0];
      console.log(account);
      App.contracts.MyNFTERC721.deployed().then(function(instance){
        nftInstance = instance;
        return nftInstance.buyNFT({from: account, value:1000000000000000000});
      }).then(function(result){
        console.log(result);
        if(result.receipt.status == "0x0"){
          alert("MINT fallito!");
        }
        else if(result.receipt.status == "0x1"){
          alert("MINT riuscito!");
        }
        console.log('recepitstatus:',result.receipt.status);
      }).catch(function(error){
        console.log('error:',error.message);
        alert("MINT fallito!");
      });
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
