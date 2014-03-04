var express = require ("express");
var app = express ();
var port = 6222; //9666;
var WatchJS = require("watchjs")
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;
// set rendering engine and static files
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname+"/public"))

//////////////////////////////////////////////////////////
app.get("/", function(req, res){res.render("playerng")});

app.get("/board", function(req, res) {res.render("board")});
// app.get("/player", function(req, res){res.render("player");});
app.get("/host", function(req, res){res.render("hostng");});
app.get("/admin", function(req, res){res.render("admin");});

var log = function(x){ console.log(x)};


// gameState phases:
// register: register players and hosts
// lock: buzzer locked
// release: buzzer released
// end: game ended
const REGISTER = "REGISTER"
const TIMED    = "TIMED"
const LOCK     = "LOCK"
const RAPID    = "RAPID"
const SHOW      = "SHOW"

var gameState = null;

var resetGame = function(){

	gameState = {
		game_title:"Buzzerd",
		host:null,
		players:[],
		scores:{},
		clientPlayerDict:{},
		phase:REGISTER,
		round:1,
		clientAnswers:{},
		phase_options:[REGISTER,TIMED, LOCK,RAPID,SHOW],
		phaseOpt:{}, // will be filled below
		score_buttons: [-20,-10,-5,5,10,20],
		rounds:[1,2,3],
		score_recoreds: [],
		buzzerOrder:[],
		answerBoards:{},
		hot_seats:[], // determines who pressed the buzzer and in what order
		hot_alive:[], // replaces hot_player - this keeps track of who in hot seat is alive
		countdownTimer:0,
	}
	//initialize phae_opt
	for (var i=0; i < gameState.phase_options.length; i++){
		var po = gameState.phase_options[i]
		gameState.phaseOpt[po] = po
	}
};

resetGame();

var io = require('socket.io').listen(app.listen(port));


var updateGame = function(){
	io.sockets.emit('gameState',  gameState);
}
watch(gameState, function(){
	log("some attribute changed!")
	updateGame();
		
});

watch(gameState, "players", function(){
	log("players attribute changed!!")
	updateGame();
	
})


var soundBuzzer = function(){io.sockets.emit('soundBuzzer', {});}
var soundDing = function(){io.sockets.emit('soundDing', {});}
var soundDingDong = function(){io.sockets.emit('soundDingDong', {});}


var ioResponseRegistry = {}

var ioResponse = function(x){
	for(var key in Object.keys(ioResponseRegistry)){
		ioResponseRegistry[key](x);
	}
}
//////////////////////////////////////////////////////////
// Game logic:




var addToHotseats = function (player){
	// ignore if it's already in hot_seats
	for(var i=0;i<gameState.hot_seats.length;i++){
		if(gameState.hot_seats[i]==player.username){
			return false;
		}
	}
	gameState.hot_seats.push(player.username);
	gameState.hot_alive.push(player.username);
	return true

}



var userNames = function(){
	var k = gameState.players.map(function(p){return p.username});
	console.log(JSON.stringify(k))
	return k
}


var refreshPlayerReg = function(){
	log("refreshing")

	var players = []
	gameState.scores = {}

	for(var key in gameState.clientPlayerDict){
		log("ref:"+key)
		var p = gameState.clientPlayerDict[key];
		if (players.filter(function(x){
			if (x){
			return x.username == p.username
		}else {return false}
		}).length == 0 ) {
			players.push(p)
		}

		if (p.username in gameState.scores){
			// do nothing ... for now
		}else{
			gameState.scores[p.username] = 0;
		}
	}
	gameState.players = players;
}

io.sockets.on('connection', function (socket) {
	console.log("connected to id"+socket.id)
	console.log("ip is" +socket.handshake.address.address)

	var player = null;

	socket.emit('message', {message: 'Connection to Buzzerd Server established.'});

	io.sockets.emit('gameState', gameState);

	socket.on('registerName', function(data){
		console.log ("registerName "+ JSON.stringify(data));
		if (data.username){
			gameState.clientPlayerDict[socket.id] = data;
			refreshPlayerReg();
		}
		updateGame();
	})


	/////////POINTS////////////////////////////////////////////////////

	socket.on('addPoints', function(data){
		log("addPoints"+ JSON.stringify(data))
		if(data.player.username===null){
			log("addPoints: data")


		}else{
			var playerName = data.player.username
			var newscore = gameState.scores[playerName] + data.points

			log("pl:"+playerName+" "+data.points)
			gameState.scores[playerName] = newscore;

			if(gameState.phase==gameState.phaseOpt.RAPID){
				if(data.reward==true){	
					soundDingDong();

				}
				else{ 
					soundBuzzer()	
				}
				gameState.hot_alive.shift();
			}

			updateGame();
		}
	});

	socket.on('change_phase', function(data){
		gameState.phase = data.phase;
		updateGame();
	});

	socket.on('change_round', function(data){
		gameState.round = data.round;
		updateGame();
	});
	
	// socket.on('change_hotseat', function(data){
	// 	gameState.hot_player = data.hot_player;
	// 	updateGame();
	// });

	
	socket.on('resetAnswers', function(data){
		gameState.answerBoards= {}
		gameState.hot_seats = []
		gameState.hot_alive = []
		// gameState.updateGame();
		io.sockets.emit("clearPlayerAnswers", {})
		updateGame();
		log('answer reset')
	});


	socket.on('change_gametitle', function(data){
		gameState.game_title = data.game_title;
		updateGame();
	});

	socket.on('resetGame', function(){resetGame();updateGame();})

	socket.on('buzzer', function(data){
		// gameState.hot_seats.push(data);
		if (addToHotseats(data)==true){
			soundDing()
			log("buzzer");
			gameState.answerBoards[data.username] = data.answer
		}
		updateGame();
	})

	socket.on('sendAnswer', function(data){
		gameState.answerBoards[data.username] = data.answer
		updateGame();
	})
})



// setInterval(function(){console.log("tick"), 1000});




////////////////STUB/////////////////////////////////////////////////////
var startCountdownTimer = function(startSec,callback){

}
 
console.log("Listening on port " + port);

