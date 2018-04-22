App = {

  web3Provider: null,
  contracts: {},
  account: 0x0,
  loading: false,
  logs: "",
  firstTime: true,


  init: function() {

    App.initUI();
    return App.initWeb3();

  },

  initUI: function(){
    if(App.firstTime) {
      App.logs="";
      $("#main-header").text("SageCoin Main");
      $("#main-body").text("Welcome");
      $('#form-issuance').hide();
      $('#form-transfer').hide();
      $('#form-purchase').hide();


      App.firstTime=false;
    }
  },

  changeAccount: function(){
      App.account=web3.eth.accounts[0];
      App.showModal('Change Account','Account is changed to '+App.account);
      App.displayAccountInfo();
  },

  menuInvoke: function(_menuId){
    if(_menuId=='issue'){
      $("#form-issuance").show();
      $("#form-transfer").hide();
      $("#form-purchase").hide();
      $("#description_issuance").text("");

    }
    if(_menuId=='purchase'){
      $("#form-issuance").hide();
      $("#form-transfer").hide();
      $("#form-purchase").show();
      $("#description_purchase").text("");

    }
    if(_menuId=='transfer'){
      $("#form-issuance").hide();
      $("#form-transfer").show();
      $("#form-purchase").hide();
      $("#description_transfer").text("");



    }
  },

  initWeb3: function() {
    // initialize web3
    if(typeof web3 !== 'undefined') {
      //reuse the provider of the Web3 object injected by Metamask
      App.web3Provider = web3.currentProvider;
    } else {
      //create a new provider and plug it directly into our local node
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    App.initContract();

    //App.displayAccountInfo();


  },

  showModal: function(_title,_text){
      $("#modal-title-text").text(_title);
      $("#modal-body-text").text(_text);
      $("#sageModal").modal("show");
      return true;
  },

  logIt: function(_text) {
      App.logs+="<li>"+_text+"</li>\n";
      $("#log-body").html(App.logs);
  },

  initContract: function() {
    $.getJSON('SageCoin.json', function(sageCoinArtifact) {
      // get the contract artifact file and use it to instantiate a truffle contract abstraction
      App.contracts.SageCoin = TruffleContract(sageCoinArtifact);
      // set the provider for our contracts
      App.contracts.SageCoin.setProvider(App.web3Provider);
      console.log("Loading ABI from JSON");
      // listen to events
      App.listenToEvents();
      // retrieve the article from the contract
      return App.displayAccountInfo();
    });
  },

  sageIssue: function() {
      App.contracts.SageCoin.deployed().then(function(SageCoinInstance){
        numberOfToken=document.getElementById('numberTokenToIssue').value;
        return SageCoinInstance.issueToken(numberOfToken,web3.toWei(0.01,"ether"));
      }).then(function(result){
        $("#description_issuance").text("Requesting Issuance of "+numberOfToken+" Token ...");
      }).catch(function(error){
        $("#description_issuance").text("Request is failed" + error);
      });

      return true;

  },

  sagePurchase: function() {
    var SageCoinInstance;
      App.contracts.SageCoin.deployed().then(function(instance){
        SageCoinInstance=instance;
        numberOfToken=document.getElementById('numberTokenToPurchase').value;
        return SageCoinInstance.buy(numberOfToken,{from: App.account, value: web3.toWei(1, "ether")});
      }).then(function(result){
        //$("#description_purchase").text("Success Purchasing "+numberOfToken+" SageCoins.");\
        $("#description_purchase").text("Requesting Purchase of "+numberOfToken+ " SageCoins");
        return SageCoinInstance.addToWhiteList(App.account);
      }).then(function(result){
        $("#description_purchase").append("<br>Requesting to be add to WhileList ");
      }).catch(function(error){
        $("#description_purchase").text("Failed to buy SageCoins " + error);
      });

      return true;

  },

  sageTransfer: function() {
      App.contracts.SageCoin.deployed().then(function(SageCoinInstance){
        numberOfToken=document.getElementById('numberTokenToTransfer').value;
        recipientAddress=document.getElementById('recipientAddress').value;        
        return SageCoinInstance.transfer(App.account,recipientAddress,numberOfToken);
      }).then(function(result){
        $("#description_transfer").text("Requesting transfer of  "+numberOfToken+" SageCoins to "+recipientAddress);
      }).catch(function(error){
        $("#description_transfer").text("Failed to transfer SageCoins " + error);
      });

      return true;

  },



  displayAccountInfo: function() {
    if(App.loading) {
      return;
    }
    App.loading = true;
    web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        App.account = account;
        console.log('Account '+ account);
        $('#statusAccountNumber').text(account.substr(0,15)+"....");
        web3.eth.getBalance(account, function(err, balance) {
          if(err === null) {
            $('#statusEthersBalance').text(web3.fromWei(balance, "ether") + " ETH");
          } else {
          	console.error(err);
          }
        });
    var SageCoinInstance;
    App.contracts.SageCoin.deployed().then(function(instance){
      SageCoinInstance = instance;
        return SageCoinInstance.getTotalTokens();
    }).then(function(totalTokens) {
       $('#statusCoinIssued').text(totalTokens);
       return SageCoinInstance.getTokensSold();
    }).then(function(totalTokensSold){
       $('#statusCoinSold').text(totalTokensSold);
       return SageCoinInstance.getTokenPrice();
    }).then(function(totalTokenPrice){
       $('#statusCoinPrice').text(web3.fromWei(totalTokenPrice,"ether")+ " ETH");
       console.log(totalTokenPrice.toString());
       return SageCoinInstance.getBalance();
    }).then(function(CoinBalance){
       $('#statusCoinBalance').text(CoinBalance);
    }).catch(function(error) {
      console.error(error);
    });
   }});
  $("#log-body").html(App.logs);
  App.loading=false;

  },

listenToEvents: function() {
  App.contracts.SageCoin.deployed().then(function(instance){
    // BEGIN ISSUE TOKEN EVENT 
    instance.issueTokenEvent({},{}).watch(function(error,event){
      if(!error){
        msg=App.account+": Issuing "+event.args._issueSize+" Token for amount of  "+web3.fromWei(event.args._etherPrice,"ether")
                    + "ETH is succesfull";
        App.showModal("Issuance Status",msg);
        App.logIt(msg);
        $("#description_issuance").text("Success ...");
      } else {
        App.showModal("Issuance Status","Failed to Issue Coins "+error);
        App.logIt(App.account+": Error to issue Coins");
      }
      App.displayAccountInfo();  
    });
    // END ISSUE TOKEN EVENT
    // BEGIN BUY TOKEN EVENT
    instance.buyTokenEvent({},{}).watch(function(error,event){
      if(!error) {
        msg=event.args._buyer+": Purchasing "+event.args._numberOfCoins+" SageCoins is succesfull"
        App.showModal("Purchasing Status",msg);
        App.logIt(msg);
        $("#description_purchase").text("Success ...");
  
      } else {
        App.showModal("Purchase Status","Failed to Purchase Coins "+error);
        App.logIt(event.args._buyer+": Error to Purchase Coins");
      }
      App.displayAccountInfo();
    });
    // END BUY TOKEN EVENT
    // BEGIN TRANSFER TOKEN EVENT
    instance.transferTokenEvent({},{},{}).watch(function(error,event){
      if(!error) {
        from=event.args._from;
        to=event.args._to;
        numberOfTokens=event.args._numberOfTokens;
        msg=from+": Transfering "+numberOfTokens+" to "+to+" is succesfull";
        App.showModal("Transfer Status",msg);
        App.logIt(msg);
        $("#description_purchase").text("Success ...");
  
      } else {
        App.showModal("Transfer Status","Failed to Transfer Token "+error);
        App.logIt(App.account+": Error to Transfer Token ");
      }
      App.displayAccountInfo();
    });
    // END TRANSFER TOKEN EVENT
  });

},





};



<!-- Initiate App when window is load -->
//console.log("11");

  $(window).on('load',function() {
  	console.log("Calling APP INIT");
    App.init();
    var accountdefault=web3.eth.accounts[0];
    var accountInterval = setInterval(function() {
      if (web3.eth.accounts[0] !== accountdefault) {
          App.changeAccount();
          accountdefault=web3.eth.accounts[0];
          //console.log("Account change detected ...");
      }
    }, 100);
  });

