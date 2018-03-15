pragma solidity ^0.4.15;

import "./Owned.sol";

contract SageCoin is Owned {
  // structure for tokenHolder of SageCoin
    struct TokenHolder {
      address holderAddress; // The address of the voter
      uint balance;    // The total no. of tokens this voter owns
    }

    /* mapping is equivalent to an associate array or hash
     The key of the mapping is candidate name stored as type bytes32 and value is
     an unsigned integer which used to store the vote count
     */
    mapping (address => TokenHolder) public tokenHolderInfo;
    mapping (address => bool) whiteList;

    // Total no. of tokens available for this election
    uint totalTokens = 0;
    // Total no. of tokens still available for purchase
    uint balanceTokens = 0;
    // Price per token
    uint tokenPrice = 0;

    uint numberOfTokenHolder = 0;

    event issueTokenEvent (uint _issueSize, uint _etherPrice);

    event buyEvent (address indexed _buyer, uint _numberOfCoins);

    event transferEvent(address indexed _from, address indexed _to, uint _numberOfTokens);

    /* When the contract is deployed on the blockchain, we will initialize
     the total number of tokens for sale, cost per token and all the candidates
    function SageCoin() public {
      owner = msg.sender;
      totalTokens = 0;
      balanceTokens = 0;
      tokenPrice = 0;
    }
    */

    // check for whitelisting
    modifier onlyWhitelist() {
      require(whiteList[msg.sender]);
      _;
    }
    /*
     Issue new token to support the event economy
     */
    function issueToken(uint _totalTokens, uint _tokenPrice) onlyOwner public {
      tokenPrice = _tokenPrice;
      totalTokens = _totalTokens;
      balanceTokens = _totalTokens;
      issueTokenEvent(_totalTokens, _tokenPrice);
    }

    function addToWhiteList(address merchant) onlyOwner public {
      if (!whiteList[merchant])
        whiteList[merchant] = true;
    }

    function removeFromWhiteList(address merchant) onlyOwner public {
      whiteList[merchant] = false;
    }

    /* This function is used to purchase the tokens. Note the keyword 'payable'
     below. By just adding that one keyword to a function, your contract can
     now accept Ether from anyone who calls this function. Accepting money can
     not get any easier than this!
     */
    function buy(uint _tokensToBuy) payable public returns (uint) {
      require(_tokensToBuy <= balanceTokens);
      require(_tokensToBuy <= msg.value / tokenPrice);

      TokenHolder storage holder = tokenHolderInfo[msg.sender];

      if (holder.holderAddress == 0x0) {
        tokenHolderInfo[msg.sender] = TokenHolder(msg.sender, _tokensToBuy);
        numberOfTokenHolder++;
      }
      else {
        holder.balance += _tokensToBuy;
      }
      balanceTokens -= _tokensToBuy;

      // return remaining ethers
      uint toReturn = msg.value - (_tokensToBuy * tokenPrice);
      if (toReturn > 0) {
        msg.sender.transfer(toReturn);
      }
      buyEvent(msg.sender, _tokensToBuy);
      return _tokensToBuy;
    }

    /* to query the total number of tokens
     */
    function getTotalTokens() public constant returns (uint) {
      return totalTokens;
    }

    /* to query the total number of tokens
     */
    function getBalanceTokens() public constant returns (uint) {
      return balanceTokens;
    }

    /* to query the total number of tokens sold
     */
    function getTokensSold() public constant returns (uint) {
      return totalTokens - balanceTokens;
    }

    /* to query the total number of tokens sold
     */
    function getTokenPrice() public constant returns (uint) {
      return tokenPrice;
    }

    function getBalance() public constant returns (uint) {
      return tokenHolderInfo[msg.sender].balance;
    }

    // removed onlyOwner
    function getBalance(address _holderAddress) public constant returns (uint) {
      return tokenHolderInfo[_holderAddress].balance;
    }

    function getNumberOfTokenHolders() public constant returns (uint) {
      return numberOfTokenHolder;
    }
    /*
     Allow token owner to convert token back to ether and transfer
     it back to his account.
     For example, 1 ether = 100 tokens
     user redeem 75 tokens, he will get back .75 ethers less gas
     */
    function redeemToken() public returns (uint) {
      // check there is a positive balance for msg.sender
      uint tokenBalance = getBalance();
      require(tokenBalance > 0);
      // check there is sufficient ether balance in contract
      uint weiAmt = tokenBalance * tokenPrice;
      require(this.balance > weiAmt);
      // transfer the amount of ether back to msg.sender address
      tokenHolderInfo[msg.sender].balance = 0;
      // decrement the numberOfTokenHolder by 1
      numberOfTokenHolder--;
      msg.sender.transfer(weiAmt);
      // increase the balance coin by the number of redeemed coins
      balanceTokens += tokenBalance;
      // return result = ether amount
      return weiAmt;
    }

    /* All the ether that are deposited into the contract to purchase SageCoin.
     This method transfer the coins to the owner of the contract
     */
    function withdrawFund() onlyOwner public {
      owner.transfer(this.balance);
    }

    /* transfer coins from one holder to another
     */
    function transfer(address sender, address _recipient, uint _numberOfTokens) onlyWhitelist public returns (uint) {
      // check msg.sender has sufficient coins
      require(getBalance(sender)>=_numberOfTokens);
      // check receipient has a tokenHolder record, if not create new record and record the transfer

      TokenHolder storage holder = tokenHolderInfo[_recipient];
      if (holder.holderAddress == 0x0) {
        tokenHolderInfo[_recipient] = TokenHolder(_recipient, _numberOfTokens);
        numberOfTokenHolder++;
      }
      else {
        holder.balance += _numberOfTokens;
      }
      tokenHolderInfo[sender].balance -= _numberOfTokens;
      if (tokenHolderInfo[sender].balance == 0) {
        numberOfTokenHolder--;
      }
      transferEvent(msg.sender, _recipient, _numberOfTokens);
      // returns the number of coins transferred

      return _numberOfTokens;
    }

    // kill the smart contract
    function kill() onlyOwner {
      selfdestruct(owner);
    }
}
