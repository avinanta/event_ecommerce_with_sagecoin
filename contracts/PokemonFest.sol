pragma solidity ^0.4.11;

import "./EventSale.sol";

contract PokemonFest is EventSale {
/*
  function PokemonFest(address _sageCoinContractAddr, string _name, uint _totalTickets, uint _price) {
    return initialize(_sageCoinContractAddr, _name, _totalTickets, _price);
  }
 */
  function PokemonFest() {
    return initialize("Pokemon Fest 2018", 250, 2);
  }
}
