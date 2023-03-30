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
    return App.getNFT();
  },

  getNFT: function(){
    $.getJSON('https://my-json-server.typicode.com/gerrydps/NewEraNFT/NewEraNFT', function(data) {
      var nftRow = $('#nftRow');
      var nftTemplate = $('#nftTemplate');
      var balance = 0;
      var nftInstance;

      App.contracts.MyNFTERC721.deployed().then(function(instance){
        nftInstance = instance;
        return nftInstance.balanceOf.call(web3.eth.accounts[0]);
      }).then(async function(x){
        balance = parseInt(x.c[0]);
        for (i = 0; i < balance; i ++) {
          x = await nftInstance.tokenOfOwnerByIndex.call(web3.eth.accounts[0],i);
          id = x.c[0];
          nftTemplate.find('.panel-title').text(data[id].name);
          nftTemplate.find('img').attr('src', data[id].image);
          nftTemplate.find('.nft-price').text(data[id].price);
          nftTemplate.find('.nft-id').text(data[id].id);
          nftTemplate.find('.nft-rarity').text(data[id].rarity);
          nftTemplate.find('.btn-send').attr('data-id',id);
          nftTemplate.find('.btn-burn').attr('data-id',id);
          nftRow.append(nftTemplate.html());
        }
        $('#uraddr').text('Your address is: '+web3.eth.accounts[0]);
      }).catch(function(err){
        console.log(err.message);
      });
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-send', App.sendNFT);
    $(document).on('click', '.btn-burn', App.burnNFT);
  },

  sendNFT: function(event) {
    event.preventDefault();    
    var id = parseInt($(event.target).data('id'));
    var to= $('#address').val();

    web3.eth.getAccounts(function(error,accounts){
      if(error){console.log(error);}
      var from = accounts[0];
      App.contracts.MyNFTERC721.deployed().then(function(instance){
        nftInstance = instance;
        return nftInstance.safeTransferFrom(from, to, id,{from:from});
      }).then(function(result){
        console.log(result);
        if(result.receipt.status == "0x0"){
          alert("SEND fallito!");
        }
        else if(result.receipt.status == "0x1"){
          alert("SEND riuscito!");
        }
        console.log('recepitstatus:',result.receipt.status);
      }).catch(function(error){
        console.log('error:',error.message);
        alert("SEND fallito!");
      });
    });
  },

  burnNFT: function(event) {
    event.preventDefault();
    var id = parseInt($(event.target).data('id'));

    var nftInstance; // define var before

    web3.eth.getAccounts(function(error,accounts){
      if(error){console.log(error);}
      var account = accounts[0];
      App.contracts.MyNFTERC721.deployed().then(function(instance){
        nftInstance = instance;
        console.log(id,account);
        return nftInstance.burn(id, {from: account});
      }).then(function(result){
        console.log(result);
        if(result.receipt.status == "0x0"){
          alert("BURN fallito!");
        }
        else if(result.receipt.status == "0x1"){
          alert("BRUN riuscito!");
        }
        console.log('recepitstatus:',result.receipt.status);
      }).catch(function(error){
        console.log('error:',error.message);
        alert("BURN fallito!");
      });
    });
  }


  // end
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});