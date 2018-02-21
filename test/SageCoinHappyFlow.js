// Contract to be tested
var SageCoin = artifacts.require("./SageCoin.sol");

// Test suite
contract('SageCoin', function(accounts) {
  var sageCoinInstance;
  var pokemonFestOrganiser = accounts[1];
  var wineAndDurianOrganiser = accounts[2];
  var customer1 = accounts[3];
  var customer2 = accounts[4];
  var customer3 = accounts[5];

  // Test case: check initial values
  it("should be initialized with empty values", function() {
    return SageCoin.deployed().then(function(instance) {
      sageCoinInstance = instance;
      return sageCoinInstance.getTotalTokens();
    }).then(function(totalTokens) {
      assert.equal(totalTokens, 0x0, "total number of tokens must be zero");
      return sageCoinInstance.getTokenPrice();
    }).then(function(tokenPrice) {
      assert.equal(tokenPrice, 0x0, "token price must be zero");
      return sageCoinInstance.getBalanceTokens();
    }).then(function(balanceTokens) {
      assert.equal(balanceTokens, 0x0, "balance token price must be zero");
      return sageCoinInstance.getTokensSold();
    }).then(function(tokensSold) {
      assert.equal(tokensSold, 0x0, "token sold must be zero");
    });
  });

  // Test case: initialize with Token Sales
  it("should be initialized with 10m tokens price at 0.01 ether each", function() {
    return SageCoin.deployed().then(function(instance) {
      sageCoinInstance = instance;
      sageCoinInstance.issueToken(10000000, web3.toWei(0.01, "ether"));
      return sageCoinInstance.getTotalTokens();
    }).then(function(totalTokens) {
      assert.equal(totalTokens.toNumber(), 10000000, "total number of tokens must be 10000000");
      return sageCoinInstance.getTokenPrice();
    }).then(function(tokenPrice) {
      assert.equal(tokenPrice, web3.toWei(0.01, "ether"), "token price must be 0.01 ether");
      return sageCoinInstance.getBalanceTokens();
    }).then(function(balanceTokens) {
      assert.equal(balanceTokens, 10000000, "balance token price must be zero");
      return sageCoinInstance.getTokensSold();
    }).then(function(tokensSold) {
      assert.equal(tokensSold, 0x0, "token sold must be zero");
    });
  });

  // Test case: purchase 100 coins from account[1]
  it("account 3 purchase 100 coins", function() {
    //var res = 0;
    return SageCoin.deployed().then(function(instance) {
      sageCoinInstance = instance;
      return sageCoinInstance.getBalance({from: customer1});
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 0, "balance before purchase must be zero");

      return sageCoinInstance.buy(100, {from: customer1, value: web3.toWei(1, "ether")});
    }).then(function(res) {
      console.log("result --" + res);
      return sageCoinInstance.getBalance({from: customer1});
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 100, "balance after purchase must be 100");
    });
  });

});
