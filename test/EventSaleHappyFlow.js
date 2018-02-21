// Contract to be tested
var SageCoin = artifacts.require("./SageCoin.sol");
var EventSale = artifacts.require("./EventSale.sol");
var PokemonFest = artifacts.require("./PokemonFest.sol");
var WineAndDurian = artifacts.require("./WineAndDurian.sol");

// Test suite
contract('EventSale', function(accounts) {
  var sageCoinInstance;
  var pokemonFestInstance;
  var wineAndDurianInstance;
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
  it("should be initialized total 10m SageCoins price at 0.01 ether each", function() {
    return SageCoin.deployed().then(function(instance) {
      sageCoinInstance = instance;
      sageCoinInstance.issueToken(10000000, web3.toWei(0.01, "ether"));
    }).then(function() {
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

  // Test case: purchase 100 coins from account[3]
  it("account 3 purchases 100 coins", function() {
    return SageCoin.deployed().then(function(instance) {
      sageCoinInstance = instance;
      return sageCoinInstance.getBalance({from: customer1});
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 0, "balance before purchase must be zero");

      return sageCoinInstance.buy(100, {from: customer1, value: web3.toWei(1, "ether")});
    }).then(function(res) {
      return sageCoinInstance.getBalance({from: customer1});
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 100, "balance after purchase must be 100");
    });
  });

  // Test case: purchase 100 coins from account[4]
  it("account 4 purchase 80 coins", function() {
    return SageCoin.deployed().then(function(instance) {
      sageCoinInstance = instance;
      return sageCoinInstance.getBalance({from: customer2});
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 0, "balance before purchase must be zero");

      return sageCoinInstance.buy(80, {from: customer2, value: web3.toWei(1, "ether")});
    }).then(function(res) {
      return sageCoinInstance.getBalance({from: customer2});
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 80, "balance after purchase must be 80");
    });
  });

  // Test case: purchase 100 coins from account[5]
  it("account 5 purchase 200 coins", function() {
    return SageCoin.deployed().then(function(instance) {
      sageCoinInstance = instance;
      return sageCoinInstance.getBalance({from: customer3});
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 0, "balance before purchase must be zero");

      return sageCoinInstance.buy(200, {from: customer3, value: web3.toWei(2, "ether")});
    }).then(function(res) {
      return sageCoinInstance.getBalance({from: customer3});
    }).then(function(balance) {
      assert.equal(balance.toNumber(), 200, "balance after purchase must be 200");
    });
  });

  // Test case: Total coins bought should be 380
  it("SageCoin sold 380 coins and ether balance of 3.8 ether", function() {
    return SageCoin.deployed().then(function(instance) {
      sageCoinInstance = instance;
      return sageCoinInstance.getTokensSold();
    }).then(function(tokensSold) {
      assert.equal(tokensSold.toNumber(), 380, "Tokens sold must be 380");
      return web3.eth.getBalance(sageCoinInstance.address);
    }).then(function(wei) {
      assert.equal(wei.toNumber(), 380 * web3.toWei(0.01, "ether"), "wei balance must be " + (380 * web3.toWei(0.01, "ether")));
    });
  });

  // Test case: check initial values
  it("Pokemon Fest 2018 should be initialized with 250 tickets with each priced at 2 SageCoins and 0 balance at CoinEx", function() {
    return SageCoin.deployed().then(function(instance) {
      sageCoinInstance = instance;
    }).then(function() {
      return PokemonFest.deployed();
    }).then(function(instance) {
      pokemonFestInstance = instance;
      pokemonFestInstance.setCoinContract(sageCoinInstance.address);
    }).then(function() {
      return pokemonFestInstance.getTotalTickets();
    }).then(function(totalTickets) {
      assert.equal(totalTickets.toNumber(), 250, "Total tickets for Pokemon Fest 2018 must be 250");
      return pokemonFestInstance.getPrice();
    }).then(function(price) {
      assert.equal(price.toNumber(), 2, "Ticket price must be 2 SageCoins");
      return pokemonFestInstance.getTicketsSold();
    }).then(function(ticketsSold) {
      assert.equal(ticketsSold, 0, "Ticket sold must be zero");
      return pokemonFestInstance.getNumberOfBuyers();
    }).then(function(numbersOfBuyers) {
      assert.equal(numbersOfBuyers, 0, "number of buyers must be zero");
      return pokemonFestInstance.getCoinBalance();
    }).then(function(coinBalance) {
      assert.equal(coinBalance, 0, "coin balance at CoinEx must be zero");
    });
  });


  it("Buy 2 tickets from PokemonFest using accounts[1]", function() {
    return SageCoin.deployed().then(function(instance) {
      sageCoinInstance = instance;
    }).then(function() {
      return PokemonFest.deployed();
    }).then(function(instance) {
      pokemonFestInstance = instance;
      pokemonFestInstance.setCoinContract(sageCoinInstance.address);
    }).then(function() {
      return pokemonFestInstance.buyTickets(3, {from: customer1});
    }).then(function() {
      return pokemonFestInstance.Sales(customer1);
    }).then(function(receipt) {
      assert.equal(receipt.numberOfTickets, 3, "Number of tickets bought must be 3");
      return sageCoinInstance.getBalance({from: customer1});
    }).then(function(balance) {
      assert.equal(balance.toNumber(), (100 - (2 * 3)), "Coin balance after purchase of 3 PokemonFest ticket must be " + (100 - (2 * 3)));
    });
  });

  // Test case: check initial values
  it("WineAndDurian should be initialized with 100 tickets with each priced at 10 SageCoins and 0 balance at CoinEx", function() {
    return WineAndDurian.deployed().then(function(instance) {
      WineAndDurian = instance;
      return WineAndDurian.getTotalTickets();
    }).then(function(totalTickets) {
      assert.equal(totalTickets, 100, "Total tickets for Wine and Durian must be 100");
      return WineAndDurian.getPrice();
    }).then(function(price) {
      assert.equal(price, 10, "Ticket price must be 10 SageCoins");
    });
  });



});