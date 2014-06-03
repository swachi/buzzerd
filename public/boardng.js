
//player controller

var socket = io.connect()

var gs = null

var log = function(x){console.log(x)}
log('entering appctrl')
function AppCtrl($scope){


	socket.on('gameState', function(e){
		log("gamestate"+e)
		gs=e;
		$scope.gameState = e
		$scope.$apply();
	});

	
};
//ng-show="player.username == gameState.hot_player"	