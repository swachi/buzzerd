
//player controller

var socket = io.connect()
var snd_buzz = new Audio("/sound/BUZZER.WAV")
var snd_ding = new Audio("/sound/DING.WAV")
var snd_dingDong = new Audio("/sound/DingDong.mp3")
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

	socket.on('soundBuzzer', function(){
		log("buzzer");
		snd_buzz.play();
	});
	socket.on('soundDing', function(){
		log("buzzer");
		snd_ding.play();
	});
	socket.on('soundDingDong', function(){
		log("buzzer");
		snd_dingDong.play();
	});

	
};
//ng-show="player.username == gameState.hot_player"