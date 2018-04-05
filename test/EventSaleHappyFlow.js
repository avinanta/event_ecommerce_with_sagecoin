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

  // Test case: check initial values
  it(tc1="should be initialized with empty values", function() {
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
      completeTestCase(tc1);
    }).catch(function(error) {
      completeTestCase(tc1);
    });
  });

  // Test case: initialize with Token Sales
  it(tc2="should be initialized total 10m SageCoins price at 0.01 ether each", function() {
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
      completeTestCase(tc2);
    }).catch(function(error) {
      completeTestCase(tc2);
    });
  });

  // Test case: purchase 100 coins from account[3]
  it(tc3="account 3 purchases 100 coins", function() {
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
      completeTestCase(tc3);
    }).catch(function(error) {
      completeTestCase(tc3);
    });
  });

  // Test case: purchase 100 coins from account[4]
  it(tc4="account 4 purchase 80 coins", function() {
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
      completeTestCase(tc4);
    }).catch(function(error) {
      completeTestCase(tc4);
    });
  });

  // Test case: purchase 100 coins from account[5]
  it(tc5="account 5 purchase 200 coins", function() {
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
      completeTestCase(tc5);
    }).catch(function(error) {
      completeTestCase(tc5);
    });
  });

  // Test case: Total coins bought should be 380
  it(tc6="SageCoin sold 380 coins and ether balance of 3.8 ether", function F() {
    return SageCoin.deployed().then(function(instance) {
      sageCoinInstance = instance;
      return sageCoinInstance.getTokensSold();
    }).then(function(tokensSold) {
      assert.equal(tokensSold.toNumber(), 380, "Tokens sold must be 380");
      return web3.eth.getBalance(sageCoinInstance.address);
    }).then(function(wei) {
      assert.equal(wei.toNumber(), 380 * web3.toWei(0.01, "ether"), "wei balance must be " + (380 * web3.toWei(0.01, "ether")));
      completeTestCase(tc6);
    }).catch(function(error) {
      completeTestCase(tc6);
    });
  });

  // Test case: check initial values
  it(tc7="Pokemon Fest 2018 should be initialized with 250 tickets with each priced at 2 SageCoins and 0 balance at CoinEx", function() {
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
      completeTestCase(tc7);
    }).catch(function(error) {
      completeTestCase(tc7);
    });
  });


  it(tc8="Buy 3 tickets from PokemonFest using customer1", function() {
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
      return sageCoinInstance.getBalance({from: customer1});
    }).then(function(coinBalance) {
      assert.equal(coinBalance.toNumber(), 100, "coin balance must be 100");
      return pokemonFestInstance.getCoinBalance({from: customer1});
    }).then(function(coinBalance) {
      assert.equal(coinBalance.toNumber(), 0, "coin balance of pokemonFest must be 0");
      return pokemonFestInstance.buyTickets(3, {from: customer1});
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "should have received 1 event for buy-ticket");
      // receipt.logs[1] is the second event - BuyEvent
      assert.equal(receipt.logs[0].args._numberOfTicketsBought.toNumber(), 3, "Number of tickets bought must be 3");
      return pokemonFestInstance.Sales(customer1);
    }).then(function(salesReceipt) {
      assert.equal(salesReceipt[1], 3, "Event record must record 3 tickets sold to customer 1");
      return sageCoinInstance.getBalance({from: customer1});
    }).then(function(balance) {
      assert.equal(balance.toNumber(), (100 - (2 * 3)), "Coin balance after purchase of 3 PokemonFest ticket must be " + (100 - (2 * 3)));
      completeTestCase(tc8);
    }).catch(function(error) {
      completeTestCase(tc8);
    });
  });
/*
  it(tc9="Refund 2 tickets bought by customer1", function() {
    waitForTestCaseToComplete([tc8]);
    return SageCoin.deployed().then(function(instance) {
      sageCoinInstance = instance;
      return PokemonFest.deployed();
    }).then(function(instance) {
      pokemonFestInstance = instance;
      return sageCoinInstance.addToWhiteList(pokemonFestInstance.address);
    }).then(function() {
      return pokemonFestInstance.setCoinContract(sageCoinInstance.address);
    }).then(function() {
      return pokemonFestInstance.getTicketsSold();
    }).then(function(i) {
      ticketsSold = i;
      return sageCoinInstance.getBalance({from: customer1});
    }).then(function(b) {
      coinBalance = b;
      return pokemonFestInstance.Sales(customer1);
    }).then(function(sr) {
      salesReceipt = sr;
      assert.equal(salesReceipt[1], 3, "Sales record must record 3 tickets sold to customer 1");
      return pokemonFestInstance.refundTickets(2, {from: customer1});
    }).then(function(receipt) {
      assert.equal(receipt.logs[0].args._numberOfTicketsRefunded.toNumber(), 2, "Number of tickets refunded must be 2");
      return pokemonFestInstance.Sales(customer1);
    }).then(function(salesReceipt) {
      assert.equal(salesReceipt[1], 1, "Sales record must record 1 tickets sold to customer 1");
      return pokemonFestInstance.getTicketsSold();
    }).then(function(i) {
      ticketsSoldNow = i;
      return sageCoinInstance.getBalance({from: customer1});
    }).then(function(b) {
      coinBalanceNow = b;
      assert.equal(ticketsSoldNow, ticketsSold - 2, "Total ticket sold should decrease by 2");
      assert.equal(coinBalanceNow.toNumber(), coinBalance.toNumber() + (2 * 2), "Coin balance should increase by 4");
      completeTestCase(tc9);
    }).catch(function(error) {
      completeTestCase(tc9);
    });
  });
*/
  it(tc9="Refund 2 tickets bought by customer1", async() => {
    waitForTestCaseToComplete([tc8]);
    try {
      let sageCoinInstance = await SageCoin.deployed();
      let pokemonFestInstance = await PokemonFest.deployed();
      await sageCoinInstance.addToWhiteList(pokemonFestInstance.address);
      await pokemonFestInstance.setCoinContract(sageCoinInstance.address);
      let totalTicketsSold = await pokemonFestInstance.getTicketsSold();
      let coinBalance = await sageCoinInstance.getBalance({from: customer1});
      let salesReceipt = await pokemonFestInstance.Sales(customer1);
      assert.equal(salesReceipt[1], 3, "Sales record must record 3 tickets sold to customer 1");
      let receipt = await pokemonFestInstance.refundTickets(2, {from: customer2});
      assert.equal(receipt.logs[0].args._numberOfTicketsRefunded.toNumber(), 2, "Number of tickets refunded must be 2");
      salesReceipt = await pokemonFestInstance.Sales(customer1);
      assert.equal(salesReceipt[1], 1, "Sales record must record 1 tickets sold to customer 1");
      let totalTicketsSoldNow = await pokemonFestInstance.getTicketsSold();
      assert.equal(totalTicketsSoldNow, totalTicketsSold - 2, "Total ticket sold should decrease by 2");
      let coinBalanceNow = await sageCoinInstance.getBalance({from: customer1});
      assert.equal(coinBalanceNow.toNumber(), coinBalance.toNumber() + (2 * 2), "Coin balance should increase by 4");
      completeTestCase(tc9);
    } catch(e) {
      completeTestCase(tc9);            
    }
  });

  it(tc10="transferred last 1 ticket from customer1 to customer3", function() {
    waitForTestCaseToComplete([tc9]);
    return SageCoin.deployed().then(function(instance) {
      sageCoinInstance = instance;
      return PokemonFest.deployed();
    }).then(function(instance) {
      pokemonFestInstance = instance;
      return sageCoinInstance.addToWhiteList(pokemonFestInstance.address);
    }).then(function() {
      return pokemonFestInstance.setCoinContract(sageCoinInstance.address);
    }).then(function() {
      return pokemonFestInstance.getTicketsSold();
    }).then(function(i) {
      ticketsSold = i;
      return sageCoinInstance.getBalance({from: customer1});
    }).then(function(b) {
      coinBalance = b;
      return pokemonFestInstance.Sales(customer1);
    }).then(function(sr) {
      salesReceipt = sr;
      assert.equal(salesReceipt[1], 1, "Sales record must record 1 tickets sold to customer 1");
      return pokemonFestInstance.transferTickets(customer3, 1, {from: customer1});
    }).then(function(receipt) {
      assert.equal(receipt.logs[0].args._numberOfTicketsTransferred.toNumber(), 1, "Number of tickets transferred must be 1");
      return pokemonFestInstance.Sales(customer1);
    }).then(function(salesReceipt) {
      assert.equal(salesReceipt[1], 0, "Customer1 Sales record must record 1 tickets sold to customer 1");
      return pokemonFestInstance.getTicketsSold();
    }).then(function(i) {
      ticketsSoldNow = i;
      return pokemonFestInstance.Sales(customer3);
    }).then(function(salesReceipt) {
      assert.equal(salesReceipt[1], 0, "Customer3 Sales record must record 1 tickets sold to customer 1");
      assert.equal(ticketsSoldNow, ticketsSold, "Total ticket sold should  remains the same");
      completeTestCase(tc10);
    }).catch(function(error) {
      completeTestCase(tc11);
    });
  });

  // Test case: check initial values
  it(tc11="WineAndDurian should be initialized with 100 tickets with each priced at 10 SageCoins and 0 balance at CoinEx", function() {
    return WineAndDurian.deployed().then(function(instance) {
      WineAndDurian = instance;
      return WineAndDurian.getTotalTickets();
    }).then(function(totalTickets) {
      assert.equal(totalTickets, 100, "Total tickets for Wine and Durian must be 100");
      return WineAndDurian.getPrice();
    }).then(function(price) {
      assert.equal(price, 10, "Ticket price must be 10 SageCoins");
      completeTestCase(tc11);
    }).catch(function(error) {
      completeTestCase(tc11);
    });
  });
});
