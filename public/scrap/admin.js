window.onload = function(){

	var messages = []
	var socket = io.connect('http://localhost:9666');
	var field = document.getElementById("field");
	var sendButton = document.getElementById("send");
	var content = document.getElementById("content");
	var gameStateContent = document.getElementById("gameState");
	var name = document.getElementById("name");

	socket.on('message', function (data) {
		if(data.message) {
			console.log(""+sendButton)
			messages.push(data);
			var html = ''
			for(var i=0; i<messages.length; i++){
				html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
				html += messages[i].message + '<br />';
			}
			content.innerHTML = html;
		}else{
			console.log("there is a problem:", data);
		}
	});

	socket.on('gameState', function (data){
		if(data.gameState) {
			console.log("gameState rcvd", data)

			gameStateContent.innerHTML = JSON.stringify(data.gameState);

		}else {
			console.log("there is a problem:", data);
		}
	});

	sendButton.onclick = sendMessage =  function(){ 
		console.log("onclick -" + sendButton)
		if(name.value == "") {
			alert ("please type your name!");

		}else {
			var text = field.value;
			socket.emit('send', {message: text, username: name.value});
			field.value= "";
		}
	};
}

$(document).ready(function() {
	// $("#field").keyup(function(e){
	// 	if(e.keyCode==13) {
	// 		sendMessage();
	// 	}
	// });
});