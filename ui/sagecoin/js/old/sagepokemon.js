function sageEventOrganize() {
	$("#main-heading").html("Organise PokemonFest 2018");
	$("#main-body").html("Number of Ticket Issued " + PokemonFest.getTotalTickets.call().toString());

}

function sageBuyTicket() {
	$("#main-heading").html("Buy Tickets");
	if(isWeb3Connected) {
		if(SageCoin.getBalance.call().toNumber() >= PokemonFest.getPrice.call().toNumber()) {

		strContent = "<form role='form' name='buyticket' action=''><div class='form-group'>"+
		"<label>Number of Ticket to Purchase</label>"+
		"<input name='numberOfTicketPurchased' id='numberOfTicketPurchased' class='form-control text-input'><p><br/></p>"+
		"<button type='submit' class='btn btn-default' onclick='sageGoBuyTicket()'>Purchase Tickets</button>";

		strContent+="</div></form>";
		$('#main-body').html(strContent);

	} else {
		$('#main-body').html("Insufficient number SageCoin<br>Ticket Price : "+PokemonFest.getPrice.call().toString()+" SageCoins");
	}

	} else {
		$('#main-body').html("Not Connected to Ethereum Client")
	}
	return true;
}

function sageGoBuyTicket(){
	$("#main-heading").html("Ticket Purchase Result");
	numberOfTicketPurchased=document.getElementById('numberOfTicketPurchased').value;
	let totalPrice=PokemonFest.getPrice.call().toNumber() * numberOfTicketPurchased;
	theaddr=web3.eth.defaultAccount;
	try {
	//	SageCoin.addToWhiteList(theaddr);
	//	SageCoin.buy(0,{from: theaddr , value: web3.toWei(1, "ether")});
	//	SageCoin.buy(numberOfTokenPurchased,{from: theaddr , value: web3.toWei(1, "ether")});
	    PokemonFest.buyTickets(numberOfTicketPurchased);
		$("#main-body").html("Success ......" + numberOfTicketPurchased + " Tickets are purchased<br>"+
			"Using <strong>" + totalPrice + "</strong> SageCoins<br>" +
		"Current Balance " + SageCoin.getBalance.call().toString());



	} catch(err) {

		$("#main-body").html(err);

	}
	
	drawAccountStatus();
	drawCoinStatus();

}