var express = require ("express");
var app = express ();
var port = 9666;
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
const REGISTER = "REGISTRATION"
const LOCK     = "LOCK"
const RELEASE  = "RELEASE"
const END      = "END"

var gameState = null;

var resetGame = function(){
gameState = {
	host:null,
	players:[],
	scores:{},
	clientPlayerDict:{},
	phase:REGISTER,
	round:1,
	clientAnswers:{},
	phase_options:[REGISTER,LOCK,RELEASE,END],
	score_buttons: [-20,-10,-5,5,10,20],
	score_recoreds: []

}
};

resetGame()


var io = require('socket.io').listen(app.listen(port));

watch(gameState, function(){
	log("some attribute changed!")
	io.sockets.emit('gameState',  gameState);
		
});

watch(gameState, "players", function(){
	log("players attribute changed!!")
io.sockets.emit('gameState', gameState);
	
})

var ioResponseRegistry = {}

var ioResponse = function(x){
	for(var key in Object.keys(ioResponseRegistry)){
		ioResponseRegistry[key](x);
	}
}
//////////////////////////////////////////////////////////
// Game logic:

var addPlayer = function(player){
	gameState.players.push(player);
}
var clearPlayer = function(){
	gameState.players = []
}
var removePlayer = function(player){
	
}


var userNames = function(){
	var k = gameState.players.map(function(p){return p.username});
	console.log(JSON.stringify(k))
	return k
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
	})

	socket.on('addPoints', function(data){
		log("addPoints"+ JSON.stringify(data))
			var playerName = data.player.username
			var newscore = gameState.scores[playerName] + data.points

			log("pl:"+playerName+" "+data.points)
			gameState.scores[playerName] = newscore;
			io.sockets.emit('gameState',  gameState);
	})

})


var refreshPlayerReg = function(){
	log("refreshing")
	var players = []

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




console.log("Listening on port " + port);

