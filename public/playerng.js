
//player controller

var socket = io.connect()//'http://localhost:9666')
// console.log("connection"+socket)
var username = 'tempuser'

var log = function(x){console.log(x)}
log('entering appctrl')
function AppCtrl($scope){
	$scope.messages = []
	$scope.sendMessage = function() {
		console.log("message sent"+$scope.messageText)
		socket.emit('send', {message: $scope.messageText, username: username});
		$scope.messageText = "";
	}

	$scope.sendUsername = function() {
		console.log("registering names")
		socket.emit('registerName', {username: $scope.username, members: $scope.members})
	}

	socket.on('message', function(e){
		console.log(e)
		$scope.messages.push(e);
		$scope.$apply();
	})
	
	socket.on('gameState', function(e){
		log("gamestate"+e)
		gs=e;
		$scope.gameState = e
		$scope.$apply();
	});
}