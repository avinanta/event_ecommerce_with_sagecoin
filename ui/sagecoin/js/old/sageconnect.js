
var isWeb3Connected=true;
var sageCoinAddress = '0x129a8e44a64dcb0f06b6f26843a14cf03b77d128';
var pokemonFestAddress = '0x07eb5e5718b57b8eb8c14b20559a01b6f412d12a';
var defaultAccount = '';

// Using Mnemonic : "SAGE" The SageCoin Contract will be at this address
// You might want to harcode the address, since it will statically assigned when
// it is deployed

/*

if (typeof web3 !== 'undefined') {
        var web3 = new Web3(web3.currentProvider);
} else {
      try {
            // set the provider
        var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
      } catch(err) {
        //$("#statusrow").html("Ethereum Client is not Available");
        alert('Ethereum Client is not Available '+ err);
      }
}
*/


window.addEventListener('load', function() {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3 = new Web3(web3.currentProvider);
  } else {

    console.log('No web3? You should consider trying MetaMask!');
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
          try {
            var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
                 } 
        catch(err) {
        //$("#statusrow").html("Ethereum Client is not Available");
        alert('Ethereum Client is not Available '+ err);
      }

        
  }

  // Now you can start your app & access web3 freely:
  startApp(web3);
  // use default account
  try {
          web3.eth.defaultAccount = web3.eth.accounts[0];
          var defaultAccount=web3.eth.accounts[0];

      } catch(err) {
        alert("Ethereum Client is not Available " + err);
        var isWeb3Connected = false;
        
      }


});



// setting up the ABI for PokemonFestContract and SageCoin

var PokemonFestContract = web3.eth.contract(
  [
  {
    "constant": true,
    "inputs": [],
    "name": "getTotalTickets",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_numberOfTicketsToBuy",
        "type": "uint256"
      }
    ],
    "name": "buyTickets",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "kill",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getTicketsSold",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getCoinBalance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "Sales",
    "outputs": [
      {
        "name": "buyer",
        "type": "address"
      },
      {
        "name": "numberOfTickets",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getNumberOfBuyers",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "ticketsSold",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_name",
        "type": "string"
      },
      {
        "name": "_totalTickets",
        "type": "uint256"
      },
      {
        "name": "_price",
        "type": "uint256"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getPrice",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "price",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "numberOfBuyers",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalTickets",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_sageCoinContractAddr",
        "type": "address"
      }
    ],
    "name": "setCoinContract",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_numberOfTicketsBought",
        "type": "uint256"
      }
    ],
    "name": "buyEvent",
    "type": "event"
  }
]);

var SageCoinContract = web3.eth.contract([
  {
    "constant": false,
    "inputs": [
      {
        "name": "merchant",
        "type": "address"
      }
    ],
    "name": "removeFromWhiteList",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getNumberOfTokenHolders",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getBalance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
    {
    "constant": true,
    "inputs": [    {
        "name": "holderAddress",
        "type": "address"
      }
    ],
    "name": "getBalanceOfAddress",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "redeemToken",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "kill",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "merchant",
        "type": "address"
      }
    ],
    "name": "addToWhiteList",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getTokenPrice",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "tokenHolderInfo",
    "outputs": [
      {
        "name": "holderAddress",
        "type": "address"
      },
      {
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_totalTokens",
        "type": "uint256"
      },
      {
        "name": "_tokenPrice",
        "type": "uint256"
      }
    ],
    "name": "issueToken",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "sender",
        "type": "address"
      },
      {
        "name": "_recipient",
        "type": "address"
      },
      {
        "name": "_numberOfTokens",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_tokensToBuy",
        "type": "uint256"
      }
    ],
    "name": "buy",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "withdrawFund",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getTokensSold",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getTotalTokens",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getBalanceTokens",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_holderAddress",
        "type": "address"
      }
    ],
    "name": "getBalance",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "_issueSize",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_etherPrice",
        "type": "uint256"
      }
    ],
    "name": "issueTokenEvent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_buyer",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_numberOfCoins",
        "type": "uint256"
      }
    ],
    "name": "buyEvent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_to",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_numberOfTokens",
        "type": "uint256"
      }
    ],
    "name": "transferEvent",
    "type": "event"
  }
]);

SageCoin = SageCoinContract.at(sageCoinAddress);
PokemonFest = PokemonFestContract.at(pokemonFestAddress);

/*
if(isWeb3Connected) {
  try {
    totalTokens=SageCoin.getTotalTokens();
  } catch(err) {
    alert("SmartContract not Found at " + smartContractAddress + " Error : " + err);
    var isWeb3Connected = false;
  }
}
*/

if(isWeb3Connected) {
  try {
    SageCoin.getTotalTokens(function(error,result){
      if(!error) {
        console.log(JSON.stringify(result));
        var totalTokens=result;
      } else {
        console.error(error);
        alert("SmartContract Call Failed :" + error);
      }
    })
  } catch(err) {
    var isWeb3Connected=false;
    alert("Smart Contract Call Failed : "+err)
  }
}


