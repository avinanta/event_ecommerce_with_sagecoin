// Contract to be tested
var SageCoin = artifacts.require("./SageCoin.sol");
var EventSale = artifacts.require("./EventSale.sol");
var PokemonFest = artifacts.require("./PokemonFest.sol");
var WineAndDurian = artifacts.require("./WineAndDurian.sol");

var completedTestCases = {};

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function isTestCaseCompleted(testcase) {
  return completedTestCases[testcase];
}

function completeTestCase(testcase) {
//  console.log(testcase + " completed");
  completedTestCases[testcase] = true;
}

function waitForTestCaseToComplete(testCases) {
  var allCompleted;
  do {
    allCompleted = true;
    for(i=0;i<testCases.length;i++) {
      if (!isTestCaseCompleted(testCases[i])) {
        allCompleted = false;
        break;
      }
    }
    sleep(200);
  } while (!allCompleted);
}

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
  var customer4 = accounts[6];

  // Test case: buying SageCoin when there is insufficient to coin left to buy or provide insufficient ether to buy
  it(tc1="should throw an exception if you try to buy coin when nothing is issued", function() {
    return SageCoin.deployed().then(function(instance) {
      sageCoinInstance = instance;
      return sageCoinInstance.buy(10, {
        from: customer1,
        value: web3.toWei(1, "ether")
      });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain invalid opcode");
    }).then(function() {
      return sageCoinInstance.getNumberOfTokenHolders();
    }).then(function(numHolders) {
      //make sure sure the contract state was not altered
      assert.equal(numHolders.toNumber(), 0, "number of buyers must be zero");
      completeTestCase(tc1);
    });
  });

  // Test case: buying more coins than coin balance
  it(tc2="should throw an exception if you try to buy more coins than the available balance", function() {
    return SageCoin.deployed().then(function(instance) {
      sageCoinInstance = instance;
      return sageCoinInstance.issueToken(900, web3.toWei(0.01, "ether"));
    }).then(function() {
      return sageCoinInstance.buy(1000, {from: customer1, value: web3.toWei(10, "ether")});
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "exception must be thrown when attempt to buy more coins than available");
      return sageCoinInstance.getBalanceTokens();
    }).then(function(balance) {
      //make sure sure the contract state was not altered
      assert.equal(balance.toNumber(), 900, "there must be 100 coins balance");
      completeTestCase(tc2);
    });
  });

  // Test case: buying SageCoin with insufficient fund
  it(tc3="should throw an exception if you try to buy coins with insufficient ether", function() {
    // wait for testcase 2 to complete so that coins are issued
    waitForTestCaseToComplete([tc2]);
    return SageCoin.deployed().then(function(instance) {
      sageCoinInstance = instance;
      return sageCoinInstance.buy(11, {from: customer1, value: web3.toWei(0.1, "ether")});
    }).then(assert.fail)
    .catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, "exception must be thrown when attempt to buy coins with insufficient ether");
        return sageCoinInstance.getBalanceTokens();
    }).then(function(balance) {
      //make sure sure the contract state was not altered
      assert.equal(balance.toNumber(), 900, "there must be 900 coins balance");
      completeTestCase(tc3);
    });
  });

  // Test case: buying ticket with insufficient coins
  it(tc4="should throw an exception if you try to buy tickets with insufficient coin", function() {
    waitForTestCaseToComplete([tc3]);
    return SageCoin.deployed().then(function(instance) {
      sageCoinInstance = instance;
    }).then(function() {
      return PokemonFest.deployed();
    }).then(function(instance) {
      pokemonFestInstance = instance;
      sageCoinInstance.addToWhiteList(pokemonFestInstance.address);
    }).then(function() {
      pokemonFestInstance.setCoinContract(sageCoinInstance.address);
    }).then(function() {
      return pokemonFestInstance.getTotalTickets();
    }).then(function(totalTickets) {
      assert.equal(totalTickets.toNumber(), 250, "total tickets must be 250");
      return pokemonFestInstance.getPrice();
    }).then(function(price) {
      assert.equal(price.toNumber(), 2, "ticket price must be 2");
      return pokemonFestInstance.getTicketsSold();
    }).then(function(ticketsSold) {
      assert.equal(ticketsSold.toNumber(), 0, "ticket sold must be zero");
      return sageCoinInstance.buy(10, {from: customer1, value: web3.toWei(0.1, "ether")});
    }).then(function() {
      return sageCoinInstance.getBalance({from: customer1});
    }).then(function(coinBalance) {
      assert.equal(coinBalance.toNumber(), 10, "coin balance must be 10");
      return pokemonFestInstance.getCoinBalance({from: customer1});
    }).then(function(coinBalance) {
      assert.equal(coinBalance.toNumber(), 0, "coin balance of pokemonFest must be 0");
      return pokemonFestInstance.buyTickets(6, {from: customer1});
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "exception must be thrown when attempt to buy tickets with insufficient coins");
      return pokemonFestInstance.getTicketsSold();
    }).then(function(ticketsSold) {
      assert.equal(ticketsSold.toNumber(), 0, "ticket sold must be zero");
      return sageCoinInstance.getBalance({from: customer1});
    }).then(function(coinBalance) {
      assert.equal(coinBalance.toNumber(), 10, "coin balance for account 1 must remain as 10");
      completeTestCase(tc4);
    });
  });

  // Test case: buying ticket when there is none available
  it(tc5="should throw an exception if you try to buy ticket when none is available or insufficient", function() {
    waitForTestCaseToComplete([tc3, tc4]);
    return SageCoin.deployed().then(function(instance) {
      sageCoinInstance = instance;
    }).then(function() {
      return PokemonFest.deployed();
    }).then(function(instance) {
      pokemonFestInstance = instance;
      sageCoinInstance.addToWhiteList(pokemonFestInstance.address);
    }).then(function() {
      pokemonFestInstance.setCoinContract(sageCoinInstance.address);
    }).then(function() {
      // top-up account 1 to be 200 coins
      return sageCoinInstance.buy(190, {from: customer1, value: web3.toWei(1.9, "ether")});
    }).then(function() {
      return sageCoinInstance.getBalance({from: customer1});
    }).then(function(coinBalance) {
      assert.equal(coinBalance.toNumber(), 200, "account 1 coin balance must be 200");
      // purchase 100 coins for account2
      return sageCoinInstance.buy(200, {from: customer2, value: web3.toWei(2, "ether")});
    }).then(function() {
      return sageCoinInstance.getBalance({from: customer2});
    }).then(function(coinBalance) {
      assert.equal(coinBalance.toNumber(), 200, "account 2 coin balance must be 200");
      return sageCoinInstance.buy(200, {from: customer3, value: web3.toWei(2, "ether")});
    }).then(function() {
      return sageCoinInstance.getBalance({from: customer3});
    }).then(function(coinBalance) {
      assert.equal(coinBalance.toNumber(), 200, "account 3 coin balance must be 200");
      return sageCoinInstance.buy(200, {from: customer4, value: web3.toWei(2, "ether")});
    }).then(function() {
      return sageCoinInstance.getBalance({from: customer4});
    }).then(function(coinBalance) {
      assert.equal(coinBalance.toNumber(), 200, "account 4 coin balance must be 200");
      return pokemonFestInstance.getTotalTickets();
    }).then(function(totalTickets) {
      assert.equal(totalTickets.toNumber(), 250, "total tickets must be 250");
      return pokemonFestInstance.getPrice();
    }).then(function(price) {
      assert.equal(price.toNumber(), 2, "ticket price must be 2");
      return pokemonFestInstance.buyTickets(100, {from: customer1});
    }).then(function() {
      return pokemonFestInstance.Sales(customer1);
    }).then(function(saleReceipt) {
      assert.equal(saleReceipt[1].toNumber(), 100, "account 1 must now hold 100 tickets");
      return pokemonFestInstance.buyTickets(100, {from: customer2});
    }).then(function() {
      return pokemonFestInstance.Sales(customer2);
    }).then(function(saleReceipt2) {
      assert.equal(saleReceipt2[1], 100, "account 2 must now hold 100 tickets");
      return pokemonFestInstance.buyTickets(100, {from: customer3});
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "exception must be thrown when attempt to buy more tickets than available");
      return pokemonFestInstance.getTicketsSold();
    }).then(function(ticketsSold) {
      assert.equal(ticketsSold.toNumber(), 200, "ticket sold must be 200");
      return sageCoinInstance.getBalance({from: customer3});
    }).then(function(coinBalance) {
      assert.equal(coinBalance.toNumber(), 200, "account 3 coin balance must remain as 200");
      return pokemonFestInstance.buyTickets(50, {from: customer3});
    }).then(function() {
      return pokemonFestInstance.Sales(customer3);
    }).then(function(saleReceipt) {
      assert.equal(saleReceipt[1], 50, "account 3 must now hold 50 tickets")
      return pokemonFestInstance.getTicketsSold();
    }).then(function(ticketsSold) {
      assert.equal(ticketsSold, 250, "ticket sold must be 250");
      return pokemonFestInstance.getTotalTicketsAvailable();
    }).then(function(availTickets) {
      assert.equal(availTickets, 0, "available tickets should be 0")
      return pokemonFestInstance.buyTickets(10, {from: customer3});
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "exception must be thrown when attempt to buy tickets when there is none");
      return pokemonFestInstance.getTicketsSold();
    }).then(function(ticketsSold) {
      assert.equal(ticketsSold.toNumber(), 250, "ticket sold must be 250");
      completeTestCase(tc5);
    });
  });

});
