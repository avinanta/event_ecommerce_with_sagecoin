pragma solidity ^0.4.15;

import "./Owned.sol";
import "./AbstractSageCoin.sol";

contract EventSale is Owned {
  // Custom types
  struct SaleReceipt {
    address buyer;
    uint numberOfTickets;
  }
  address sageCoinContractAddr;

  string name;
  uint totalTickets;
  uint ticketsSold;
  uint price;
  uint numberOfBuyers;

  // State variables
  mapping(address => SaleReceipt) public Sales;

  event buyEvent (address indexed _buyer, uint _numberOfTicketsBought);

  /*
  function initialize(address _sageCoinContractAddr, string _name, uint _totalTickets, uint _price) onlyOwner {
    sageCoinContractAddr = _sageCoinContractAddr;
    name = _name;
    totalTickets = _totalTickets;
    price = _price;
    ticketsSold = 0;
    numberOfBuyers = 0;

    AbstractSageCoin sageCoin = AbstractSageCoin(sageCoinContractAddr);
  }
  */

  function initialize(string _name, uint _totalTickets, uint _price) onlyOwner {
    name = _name;
    totalTickets = _totalTickets;
    price = _price;
    ticketsSold = 0;
    numberOfBuyers = 0;
  }

  function setCoinContract(address _sageCoinContractAddr) {
    sageCoinContractAddr = _sageCoinContractAddr;
  }

  function getTotalTickets() public constant returns (uint) {
    return totalTickets;
  }

  function getTicketsSold() public constant returns (uint) {
    return ticketsSold;
  }

  function getTotalTicketsAvailable() public constant returns (uint) {
    return totalTickets - ticketsSold;
  }

  function getPrice() public constant returns (uint) {
    return price;
  }

  function getNumberOfBuyers() public constant returns (uint) {
    return ticketsSold;
  }

  // buy an article
  function buyTickets(uint _numberOfTicketsToBuy) public {
    require(_numberOfTicketsToBuy > 0);
    require(totalTickets - ticketsSold >= _numberOfTicketsToBuy);

    uint priceInCoins = price * _numberOfTicketsToBuy;

    AbstractSageCoin sageCoin = AbstractSageCoin(sageCoinContractAddr);
    require(sageCoin.getBalance(msg.sender) >= priceInCoins);

    sageCoin.transfer(msg.sender, this, priceInCoins);
    ticketsSold += _numberOfTicketsToBuy;

    SaleReceipt storage receipt = Sales[msg.sender];
    if (receipt.buyer == 0x0) {
      Sales[msg.sender] = SaleReceipt(msg.sender, _numberOfTicketsToBuy);
    }
    else {
      receipt.numberOfTickets += _numberOfTicketsToBuy;
    }
    buyEvent(msg.sender, _numberOfTicketsToBuy);
  }

  // Get balance of coin owned by event contract
  function getCoinBalance() public constant returns (uint) {
    AbstractSageCoin sageCoin = AbstractSageCoin(sageCoinContractAddr);
    return sageCoin.getBalance();
  }

  // kill the smart contract
  function kill() onlyOwner {
    AbstractSageCoin sageCoin = AbstractSageCoin(sageCoinContractAddr);
    // transfer all coins to contract owner
    // will sageCoin sees the contract address or actual contract owner address?
    sageCoin.transfer(this, owner, sageCoin.getBalance());
    selfdestruct(owner);
  }
}
