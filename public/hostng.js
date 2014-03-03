
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
	$scope.closeReg = function(){
		socket.emit("registration_lock", {registration_lock:true})
	}
	$scope.openReg = function(){
		socket.emit("registration_lock", {registration_lock:false})
	}

	$scope.resetGame = function(){
		socket.emit("resetGame", {});
	};

}







