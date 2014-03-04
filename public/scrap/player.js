window.onload = function(){

	var messages = [{username:"Client", message:"Awaiting downlink..."}]
	var socket = io.connect('http://localhost:9666');
	var field = document.getElementById("field");
	var sendButton = document.getElementById("send");
	var content = document.getElementById("content");
	var name = document.getElementById("name");

	field.disabled = true;
	sendButton.disabled = true;


	const REGISTER = "REGISTER";
	const BUZZER_LOCK = "BUZZER_LOCK"
	const BUZZER_RELEASE = "BUZZER_RELEASE"

	playerMode = REGISTER

	modes = {
		REGISTER:{
			value:"REGISTER",
			init: function(){
				sendButton.value="register";
				sendButton.disabled=false;

				sendButton.onclick = function(){ 
					console.log("onclick -" + sendButton)
					if(name.value == "") {
						alert ("please type your name!");

					}else {
						var text = field.value;
						socket.emit('register', {message: text, username: name.value});
						field.value= "";
					}
				};

				
			}
		},
		BUZZER_LOCK:{
			value:"BUZZER_LOCK",
			init: function(){
				sendButton.value="buzzer";
				sendButton.disabled=true;
			}
		},
		BUZZER_RELEASE:{
			value:"BUZZER_RELEASE",
			init: function(){
				sendButton.value="buzzer";
				sendButton.disabled=false;
			}
		}
	}	


	socket.on('enable_register', function(data){
		modes.REGISTER.init()
	});


	socket.on('enable_buzzer', function(data){
		sendButton.value = "buzzer"
		field.disabled = false;

	});

	
	socket.on('clearPlayerAnswers', function(data){
		$scope.answer = "df";
		$scope.$apply();
		log("clear?")
	});



}

$(document).ready(function() {


	// $("#field").keyup(function(e){
	// 	if(e.keyCode==13) {
	// 		sendMessage();
	// 	}
	// });
});