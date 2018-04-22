
var EtherBalance=0;
var CoinBalance=0;



function drawAccountsBalances() {
	theTable = "Data Not Available";
	if(isWeb3Connected) {

		theTable='<div class="panel panel-default"><div class="panel-heading">Sage Coin Balances</div>'+
		'<div class="panel-body"><div class="table-responsive table-bordered"><table class="table table-striped">'+
		'<thead><tr><th>#</th><th>Account Address</th><th>Balance</th></thead></thead><tbody>';

		for(i=0; i<web3.eth.accounts.length; i++) {
			let accountaddr = web3.eth.accounts[i];
			SageCoin.getBalanceOfAddress(accountaddr,function(error,result){
				if(!error) {
					let balance = result;
				} else {
					console.error(error);
				}
			});
			//let balance = SageCoin.getBalanceOfAddress.call(accountaddr).toString();

			theTable+="<tr><td>"+ (i+1) +"</td><td>"+accountaddr+"</td><td>"+balance+"</td></tr>";
		}
		theTable+="</tbody></table></div></div></div>";
	}
	return theTable;
}

function getCoinBalance (_accountNumber) {
	SageCoin.getBalanceOfAddress(_accountNumber,function(error,result) {
		if(!error) {
			CoinBalance=JSON.parse(result);
			return CoinBalance;
		} else {
			console.error(error);
			return false;
		}
	});
}

function getEtherBalance (_accountNumber) {
	web3.eth.getBalance(_accountNumber, function(error,result){
		if(!error) {
			EtherBalance=web3.fromWei(JSON.parse(result),"ether");
			console.log(EtherBalance);
			return true;
		} else {
			return false;
			console.error(error);
		}
	});

	//return web3.fromWei(web3.eth.getBalance(_accountNumber),"ether").toString();
	//return web3.fromWei(balance);
}



function drawEtherBalances () {
	theTable = "Data Not Available";
	if(isWeb3Connected) {

		theTable='<div class="panel panel-default"><div class="panel-heading">Ether Balances</div>'+
		'<div class="panel-body"><div class="table-responsive table-bordered"><table class="table table-striped">'+
		'<thead><tr><th>#</th><th>Account Address</th><th>Balance</th></thead></thead><tbody>';

		for(i=0; i<web3.eth.accounts.length; i++) {
			let accountAddr = web3.eth.accounts[i];


			theTable+="<tr><td>"+ (i+1) +"</td><td>"+accountAddr+"</td><td>"+getEtherBalance(accountAddr)+"</td></tr>";
		}
		theTable+="</tbody></table></div></div></div>";
	}
	return theTable;
}

function drawAccountStatus(){
	if(isWeb3Connected) {
		accountaddr=web3.eth.defaultAccount;
		//accountaddr = defaultAccount;
		SageCoin.getBalanceOfAddress(accountaddr,function(error,result){
				if(!error) {
					$("#statusCoinBalance").html(JSON.parse(result));
					//console.log(JSON.stringify(result));					
				} else {
					console.error(error);
				}
			});

		web3.eth.getBalance(accountaddr,function(error,result){
			if(!error) {
				let wei=JSON.parse(result);

				$("#statusEthersBalance").html(web3.fromWei(wei,"ether").toString());

			} else {
				console.error(error);
			}
		});


		$("#statusAccountNumber").html(accountaddr.substring(0,26)+"...");
		getCoinBalance(defaultAccount);

		//$("#statusCoinBalance").html(SageCoin.getBalanceOfAddress.call(accountaddr).toString());
		//$("#statusCoinBalance").html(balance);
		//$("#statusEthersBalance").html(getEtherBalance(accountaddr));
	}
}

function drawCoinStatus() {
	if(isWeb3Connected) {
		SageCoin.getTotalTokens(function(error,result) {
			if(!error) {
				$("#statusCoinIssued").html(JSON.parse(result));
			} else {
				console.error(error);
			}
		});

		SageCoin.getTokensSold(function(error,result){
			if(!error) {
				$("#statusCoinSold").html(JSON.parse(result));
			} else {
				console.error(error);
			}
		});

		SageCoin.getTokenPrice(function(error,result){
			if(!error) {
				$("#statusCoinPrice").html(web3.fromWei(JSON.parse(result),"ether"));
			} else {
				console.error(error);
			}
		});
		getCoinBalance(defaultAccount);
		//$("#statusCoinIssued").html(SageCoin.getTotalTokens.call().toString());
		//$("#statusCoinSold").html(SageCoin.getTokensSold.call().toString());
		//$("#statusCoinPrice").html(SageCoin.getTokenPrice.call().toString());
		//$("#statusTicketIssued").html(PokemonFest.getTotalTickets.call().toString());
		//$("#statusTicketPrice").html(PokemonFest.getPrice.call().toString());
		//$("#statusTicketSold").html(PokemonFest.getTicketsSold.call().toString());
	}
}

function drawAccountDropdown() {
	if(isWeb3Connected) {
		sString='';
		for(i=0;i<web3.eth.accounts.length;i++){
			accountaddr=web3.eth.accounts[i];
			sString+='<li><a href="JavaScript:selectAccount(\''+accountaddr+
			         '\')"><i class="fa fa-user fa-fw"></i> '+accountaddr.substring(0,10)+'....</a></li>';
		}
	$("#account_dropdown").html(sString);
	}
}

function selectAccount(_accountNumber) {
	//if(_accountNumber != '') {
		defaultAccount = _accountNumber;
		web3.eth.defaultAccount = _accountNumber;
		drawCoinStatus();
		drawAccountStatus();
	//}

}

function sageCoinIssuance(){
	$("#main-heading").html("Coin Issuance");
	if(isWeb3Connected) {

		strContent = "<form role='form' name='tokenissue' action=''><div class='form-group'>"+
		"<label>Number of Token to be Issued</label>"+
		"<input name='numberOfToken' id='numberOfToken' class='form-control text-input'><p><br/></p>"+
		"<button type='submit' class='btn btn-default' onclick='sageCoinIssue()'>Issue Tokens</button>";

		strContent+="</div></form>";
		$('#main-body').html(strContent);

	} else {
		$('#main-body').html("Not Connected to Ethereum Client")
	}

	return true;
}

function sageCoinIssue(){

	$("#main-heading").html("Issuing ...");
	numberOfToken=document.getElementById('numberOfToken').value;
	$("#main-body").html("Issuing "+numberOfToken+" tokens ....");
	SageCoin.issueToken(numberOfToken,web3.toWei(0.01, "ether"),function(error,result) {
		if(!error) {
				$("#main-body").html("Success ......" + numberOfToken + " SageCoins are issued");
			} else {
				$("#main-body").html(error);
			}
	});
		drawAccountStatus();
		drawCoinStatus();
}

function sageCoinPurchase() {
	$("#main-heading").html("Purchasing Coins");
	let strContent = "<form role='form' name='tokenpurchase' action=''><div class='form-group'>"+
		  			"<label>Number of Token to be Purchased</label>"+
					"<input name='numberOfTokenPurchased' id='numberOfTokenPurchased' class='form-control text-input'><p><br/></p>"+
					"<button type='submit' class='btn btn-default' onclick='sageCoinPurchaseGo()'>Purchase Tokens</button>";

		strContent+="</div></form>"; 
		$('#main-body').html(strContent);
	return true;
}

function sageCoinPurchaseGo(){
	var ValueWei=0;	
	$("#main-heading").html("Purchase Result");
	numberOfTokenPurchased=document.getElementById('numberOfTokenPurchased').value;
	$("#main-body").html("Purchasing "+numberOfTokenPurchased+" tokens .... using Ethers");
	theaddr=web3.eth.defaultAccount;

//	SageCoin.addToWhiteList(theaddr);
//	SageCoin.buy(0,{from: theaddr , value: web3.toWei(1, "ether")});

/*	web3.toWei(1,"ether",function(error,result){
		if(!error) {
			var ValueWei = JSON.parse(result);
			console.log(ValueWei);
		}
	});
	*/

	/*

	SageCoin.addToWhiteList(theaddr, function(err,res) {
		if(!err) {

			SageCoin.buy(numberOfTokenPurchased,{from: theaddr , value: web3.toWei(1,"ether") },function(error,result) {

				if(!error) {
						$("#main-body").html("Success ......" + numberOfTokenPurchased + " SageCoins are purchased<br>"+
						"Current Balance <div id=outGetBalance> ");
						SageCoin.getBalance(function(error,result) {
							if(!error) {
								$("#outGetBalance").html(JSON.parse(result));
							}
						}); 
				} else {
					$("#main-body").html(error);

				}
			});
		} else {
			$("#main-body").html(err);
		}
	});
	*/

/*
	SageCoin.buy(0,{from: theaddr , value: web3.toWei(1,"ether") },function(error,result) {

		if(!error) {
				SageCoin.getBalance(function(error,result) {
				}); 
		} else {
			$("#main-body").html(error);

		}
	});
	// This is strange. First you have to buy 0 Coin, and then next coin

	*/


	SageCoin.buy(numberOfTokenPurchased,{from: theaddr , value: web3.toWei(1,"ether") },function(error,result) {

		if(!error) {
				$("#main-body").html("Success ......" + numberOfTokenPurchased + " SageCoins are purchased<br>"+
				"Current Balance <div id=outGetBalance> ");
				SageCoin.getBalance(function(error,result) {
					if(!error) {
						$("#outGetBalance").html(JSON.parse(result));
					}
				}); 
		} else {
			$("#main-body").html(error);

		}
	});
	SageCoin.addToWhiteList(theaddr,function(error,result){
			if(!error) { 
				return true; 
			} else { 
	//			console.error(error); 
				return false;
			}
		});

	

	drawAccountStatus();
	drawCoinStatus();

}

function sageCoinTransfer() {
	$("#main-heading").html("Transfer Coins"); 
	getEtherBalance(defaultAccount);

	if(isWeb3Connected) {
		if(EtherBalance > 0) {
			strContent = "<form role='form' name='tokentransfer' action=''>"+
						"<div class='form-group'><label>Recipient</label>"+
						"<select class='form-control' id='sageTransferRecipient'>";
			for(i=0;i<web3.eth.accounts.length;i++) {
				if(web3.eth.accounts[i]!=web3.eth.defaultAccount) {
					strContent+="<option>" + web3.eth.accounts[i] + "</option>";
				}

			}					
			strContent+="</select></div><div class='form-group'><label>Number of Coins</label>"+
						"<input class='form-control text-input' id='sageTransferAmount'></div>"+
						"<button type='submit' class='btn btn-default' onclick='sageCoinGoTransfer()'>Transfer Coins</button>";

		strContent+="</form>";
		$('#main-body').html(strContent);

		} else {
			$("#main-body").html("You do not have any coin to transfer ...");
		}

	} else {
		$("#main-body").html("Error: Is not connected to Ethereum Client");
	}
}

function sageCoinGoTransfer() {
	getCoinBalance(defaultAccount);
	$("#main-heading").html("Transfer Result");
	numberOfToken=document.getElementById('sageTransferAmount').value;
	Recipient=document.getElementById('sageTransferRecipient').value;

	$("#main-body").html("Transferring "+numberOfToken+" tokens to "+Recipient);
	theaddr=defaultAccount;
	if(numberOfToken<=CoinBalance) {
	
		//SageCoin.buy(0,{from: Recipient , value: web3.toWei(1, "ether")});
		//SageCoin.buy(numberOfTokenPurchased,{from: theaddr , value: web3.toWei(1, "ether")});
		SageCoin.addToWhiteList(Recipient,function(error,result){
			if(!error) { 
				return true; 
			} else { 
				console.error(error); 
				return false;
			}
		});


		SageCoin.transfer(theaddr, Recipient, numberOfToken, function(error,result) {
			if(!error) {
				getCoinBalance();
				$("#main-body").html("Success ......<br>" + numberOfToken + " SageCoins are transferred to "+
						Recipient);

			} else {
				console.error(error);
				$("#main-body").append("<br>Fail to transfer <br>Error Message : "+error);

			}
		});
	} else {
		$("#main-body").html("Insufficient number of tokens");
	}

	drawAccountStatus(function(error,result) {
		if(!error) {

		} else {
			//console.error(error);
		}
	}); 
	drawCoinStatus(function(error,result) {
		if(!error) {

		} else {
			//console.error(error);
		}
	}); 


}



$(document).ready(function() {


//   $("#bottomrow").html(drawAccountsBalances());
//   $("#middlerow").html(drawEtherBalances())
	$("#main-heading").html("Main Page");
	$("#main-body").html("Welcome");
	drawAccountStatus();
	drawCoinStatus();
	drawAccountDropdown();



  });