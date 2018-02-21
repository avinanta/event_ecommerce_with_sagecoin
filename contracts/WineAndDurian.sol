pragma solidity ^0.4.11;

import "./EventSale.sol";

contract WineAndDurian is EventSale {
/*
  function WineAndDurian(address _sageCoinContractAddr, string _name, uint _totalTickets, uint _price) {
    return initialize(_sageCoinContractAddr, _name, _totalTickets, _price);
  }
 */

 function WineAndDurian() {
   return initialize("Wine and Durian", 100, 10);
 }
}
