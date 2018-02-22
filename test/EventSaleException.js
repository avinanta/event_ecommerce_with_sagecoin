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

  // Test case: buying SageCoin when there is insufficient to coin left to buy or provide insufficient ether to buy
  it("should throw an exception if you try to buy coin when nothing is issued", function() {
    return SageCoin.deployed().then(function(instance) {
        sageCoinInstance = instance;
        return sageCoinInstance.buy(10, {
          from: customer1,
          value: web3.toWei(1, "ether")
        });
      }).then(assert.fail)
      .catch(function(error) {
        assert(error.message.indexOf('revert') >= 0, "error message must contain invalid opcode");
      }).then(function() {
        return sageCoinInstance.getNumberOfTokenHolders();
      }).then(function(numHolders) {
        //make sure sure the contract state was not altered
        assert.equal(numHolders.toNumber(), 0, "number of buyers must be zero");
      });
  });

  // Test case: buying SageCoin with insufficient fund
  it("should throw an exception if you try to buy coins with insufficient ether");

  // Test case: buying more coins than coin balance
  it("should throw an exception if you try to buy more than the available balance");
});
