
var isWeb3Connected=true;
const sageCoinContractAddress = '0x129a8e44a64dcb0f06b6f26843a14cf03b77d128';
var defaultAccount = '';
const Mnemonic = 'SAGE';

// Using Mnemonic : "SAGE" The SageCoin Contract will be at this address
// You might want to harcode the address, since it will statically assigned when
// it is deployed


const SageCoinAbi = [
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
];


window.addEventListener('load', function() {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3 = new Web3(web3.currentProvider);
    console.log('Connected to Mist / Metamask');
  } else {

    console.log('No web3? You should consider trying MetaMask!');
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    try {
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        console.log('Connected using ordinary web3');
    } catch(err) {
        alert('Ethereum Client is not Available '+ err);
        isWeb3Connected=false;
    }

        
  }

  // use default account
  try {
          web3.eth.defaultAccount = web3.eth.accounts[0];
          defaultAccount=web3.eth.accounts[0];
          console.log('Using Account ' + defaultAccount);

      } catch(err) {
        alert("Ethereum Client is not Available " + err);
        isWeb3Connected = false;
        
      }
   try {
    SageCoinContract = web3.eth.contract(SageCoinAbi);
  } catch(err) {
    console.error(Err);
  }
  try {
    SageCoin = SageCoinContract.at(sageCoinContractAddress);
  } catch(err) {
    console.error(err);

  }
      RunSageCoinApps();


});


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

/*if(isWeb3Connected) {
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
*/


