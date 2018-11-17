/// 게임 서버
var express = require('express');
var p2 = require('p2');

var app = express();
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));
app.get('/',function(req, res) {
    res.sendFile(__dirname+'/index.html');
})

var server = app.listen(80, function() {
    console.log('Listening on '+server.address().port);
})

//========================================================================================================================
//  서버 함수
//  2018.10.18 강준하
//========================================================================================================================

//  서버 물리 설정
// var startTime = (new Date).getTime();
// var lastTime;
// var timeStep = 1 / 70; 

// var world = new p2.World({
//     gravity : [0,0]
// });

// function physics_hanlder() {
// 	var currentTime = (new Date).getTime();
// 	timeElapsed = currentTime - startTime;
// 	var dt = lastTime ? (timeElapsed - lastTime) / 1000 : 0;
//     dt = Math.min(1 / 10, dt);
//     world.step(timeStep);
// }
// setInterval(physics_hanlder, 1000/60);

//  플레이어 리스트
var playerList = [];

//  플레이어 클래스
var Player = function(startX, startY, sprite, speed) {
    this.x = startX
    this.y = startY
    this.sprite = sprite
    this.speed = speed;
}

//  새로운 플레이어
function onNewPlayer(data) {
    console.log("created new player with id " + this.id);
    var newPlayer = new Player(data.x, data.y, data.sprite, data.speed);
    newPlayer.id = this.id;
    
    // playerBody = new p2.Body ({
    //     mass: 0,
    //     position: [0,0],
    //     fixedRotation: true
    // });
    // newPlayer.playerBody = playerBody;
    // world.addBody(newPlayer.playerBody);
    // newPlayer.id = socket.id;

    //  새로운 플레이어 정보
    var current_info = {
        id: newPlayer.id, 
        x: newPlayer.x,
        y: newPlayer.y,
        sprite: newPlayer.sprite,
        speed: newPlayer.speed
    }

    //  접속된 플레이어 정보 가져오기
    for (let i = 0; i < playerList.length; i++) {
        existPlayer = playerList[i];
        var player_info = {
            id: existPlayer.id,
            x: existPlayer.x,
            y: existPlayer.y,
            sprite: existPlayer.sprite,
            speed: existPlayer.speed
        };
        this.emit('new_oPlayer', player_info);
    }

    //  나를 제외한 모든 소켓에게 나의 정보 전송
    this.broadcast.emit('new_oPlayer', current_info);
    playerList.push(newPlayer);
}

function onMovePlayer(data) {
    var movePlayer = find_playerID(this.id); 
	movePlayer.x = data.x;
	movePlayer.y = data.y;
	var moveplayerData = {
		id: movePlayer.id,
		x: movePlayer.x,
		y: movePlayer.y, 
    }
	this.broadcast.emit('move_oPlayer', moveplayerData);
}

//  연결 끊김
function onDisconnect() {
    var removePlayer = find_playerID(this.id);
    if (removePlayer) {
        playerList.splice(playerList.indexOf(removePlayer), 1);
    }
    console.log("removing player " + this.id);
	this.broadcast.emit('remove_player', {id: this.id});
}

//  플레이어 ID 찾기
function find_playerID(id) {
	for (let i = 0; i < playerList.length; i++) {
		if (playerList[i].id == id) {
			return playerList[i]; 
		}
	}
	return false; 
}

//========================================================================================================================
//  서버 제어
//  2018.10.18 강준하
//========================================================================================================================

//  소켓 측
var io = require('socket.io').listen(server);

io.on('connection', function(socket) {
    socket.on('new_player', onNewPlayer);
    socket.on('move_player', onMovePlayer);
    socket.on('disconnect', onDisconnect);
})
