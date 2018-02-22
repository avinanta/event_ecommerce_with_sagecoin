pragma solidity ^0.4.11;

contract AbstractSageCoin {
    function issueToken(uint _totalTokens, uint _tokenPrice) public;

    function addToWhiteList(address merchant) public;

    function removeFromWhiteList(address merchant) public;
    
    function buy() payable public returns (uint);

    function getTotalTokens() public constant returns (uint);

    function getBalanceTokens() public constant returns (uint);

    /* to query the total number of tokens sold
     */
    function getTokensSold() public constant returns (uint);

    /* to query the total number of tokens sold
     */
    function getTokenPrice() public constant returns (uint);

    function getBalance() public constant returns (uint);

    function getBalance(address _holderAddress) public constant returns (uint);

    function redeemToken() public returns (uint);

    function withdraw() public;

    function allTokenHolders() constant public returns (address[]);
    function transfer(address sender, address recipient, uint numberOfTokens) public returns (uint);
    function kill();
}
