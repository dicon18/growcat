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

//  플레이어 리스트
var playerList = [];

//  서버 물리 설정
var startTime = (new Date).getTime();
var lastTime;
var timeStep = 1 / 70; 
var world = new p2.World({
    gravity : [0,0]
});

function physics_hanlder() {
	var currentTime = (new Date).getTime();
	timeElapsed = currentTime - startTime;
	var dt = lastTime ? (timeElapsed - lastTime) / 1000 : 0;
    dt = Math.min(1 / 10, dt);
    world.step(timeStep);
}
setInterval(physics_hanlder, 1000/60);

//  플레이어 클래스
var Player = function(startX, startY, sprite, speed) {
    this.x = startX
    this.y = startY
    this.sprite = sprite
    this.speed = speed;
    this.isSend = true;
}

//  새로운 플레이어
function onNewPlayer(data) {
    console.log("created new player with id " + this.id);
    var newPlayer = new Player(data.x, data.y, data.sprite, data.speed);
    newPlayer.id = this.id;
    
    //  플레이어 물리 적용
    playerBody = new p2.Body ({
        mass: 1,
        position: [data.x, data.y],
        angle: 0,
        velocity: [0, 0],
        angularVelocity: 0
    });
    playerBody.addShape(new p2.Circle({ radius: 30 }));
    newPlayer.playerBody = playerBody;
    world.addBody(newPlayer.playerBody);

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
            x: existPlayer.playerBody.position[0],
            y: existPlayer.playerBody.position[1],
            sprite: existPlayer.sprite,
            speed: existPlayer.speed
        };
        this.emit('new_oPlayer', player_info);
    }
    //console.log(newPlayer.playerBody);
    //  나를 제외한 모든 소켓에게 나의 정보 전송
    this.broadcast.emit('new_oPlayer', current_info);
    playerList.push(newPlayer);
}

//  연결 끊김
function onDisconnect() {
    var removePlayer = find_playerID(this.id, this.room);
    if (removePlayer) {
        playerList.splice(playerList.indexOf(removePlayer), 1);
    }
    console.log("removing player " + this.id);
	this.broadcast.emit('remove_player', {id: this.id});
}

function onInputFired(data) {
    var movePlayer = find_playerID(this.id); 
    if (!movePlayer || !movePlayer.isSend) {
        return;
    }
    for (let i = 0; i < playerList.length; i++) {
        console.log(playerList[i].playerBody.position+"    |    "+playerList[i].playerBody.velocity);
    }
    console.log("==========");
    setTimeout(function() {movePlayer.isSend = true}, 50);
    movePlayer.isSend = false;

    movePlayer.playerBody.velocity[0] = data.hspd;
    movePlayer.playerBody.velocity[1] = data.vspd;
    var info = {
		hspd: movePlayer.playerBody.position[0],
		vspd: movePlayer.playerBody.position[1]
    }
    var movePlayerData = {
        id: movePlayer.id,
		hspd: movePlayer.playerBody.position[0],
		vspd: movePlayer.playerBody.position[1]
    }
	this.emit("input_recieved", info);
	this.broadcast.emit('move_oPlayer', movePlayerData);
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
    socket.on('disconnect', onDisconnect);
    socket.on('input_fired', onInputFired);
})
