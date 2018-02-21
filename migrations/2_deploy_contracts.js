var ChainList = artifacts.require("./ChainList.sol");
var SageCoin = artifacts.require("./SageCoin.sol");
var EventSale = artifacts.require("./EventSale.sol");
var PokemonFest = artifacts.require("./PokemonFest.sol");
var WineAndDurian = artifacts.require("./WineAndDurian.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(SageCoin);
  deployer.deploy(PokemonFest);
  deployer.deploy(WineAndDurian);

/*
  deployer.deploy(SageCoin).then(function() {
    console.log("SageCoin address:" + SageCoin.address);
    deployer.deploy(PokemonFest, SageCoin.address, "Pokemon Fest 2018", 250, 2);
    deployer.deploy(WineAndDurian, SageCoin.address, "Wine and Durian", 100, 10);
  })
 */
};
