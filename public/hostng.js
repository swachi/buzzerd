
//host controller

var socket = io.connect()//'http://localhost:9666')
// console.log("connection"+socket)
var username = 'tempuser'

var log = function(x){console.log(x)}


log('entering appctrl')
function AppCtrl($scope){
	$scope.messages = []

	socket.on('gamecond', function(e){

	});

	socket.on('gameState', function(e){
		log("gamestate"+e)
		gs=e;
		$scope.gameState = e
		$scope.$apply();
	});

	$scope.addPoints = function(data){
		log("addPoints:"+JSON.stringify(data))

		socket.emit("addPoints", data);
	}

	$scope.changePhase = function(phase){
		socket.emit("change_phase", {phase:phase});
	}

	$scope.changeRound = function(round){
		socket.emit("change_round", {round:round});
	}

	$scope.resetAnswers = function(){
		socket.emit("resetAnswers", {})
	}

	$scope.changeHotseat = function(data) {
		socket.emit("change_hotseat", data);
	}


	$scope.rapid = function(data){
		socket.emit("addPoints",data);
		// socket.emit("resetAnswers",{});
	};


	$scope.resetGame = function(){
		socket.emit("resetGame", {});
	};

	$scope.sendPoints = function(data){
		socket.emit("setPoints",data)
	}

	$scope.putAllToQueue = function(){
		socket.emit("putAllToQueue",{})
	}




}






