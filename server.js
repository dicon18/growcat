/// 게임 서버
var express = require('express');
var p2 = require('p2'); 
var app = express();
var server = app.listen(80, function() {
    console.log('Listening on '+server.address().port);
})
var io = require('socket.io').listen(server);

app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req, res) {
    res.sendFile(__dirname+'/index.html');
})

//========================================================================================================================
//  서버 제어
//  2018.10.18 강준하
//========================================================================================================================

//  서버 물리 설정
var startTime = (new Date).getTime();
var lastTime;
var timeStep= 1/70; 

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

//  플레이어 리스트
var playerList = [];

//  소켓 측
io.on('connection',function(socket) {
    socket.on('newPlayer',function(data) {
        //  새로운 플레이어 설정
        var newPlayer = new Player(data.x, data.y, data.sprite, data.speed);
        playerBody = new p2.Body ({
            mass: 0,
            position: [0,0],
            fixedRotation: true
        });
        newPlayer.playerBody = playerBody;
        world.addBody(newPlayer.playerBody);
        newPlayer.id = socket.id;

        //  새로운 플레이어 정보
        var current_info = {
            id: newPlayer.id, 
            x: newPlayer.x,
            y: newPlayer.y,
            sprite: newPlayer.sprite,
            speed: newPlayer.speed
        };

        //  플레이어 리스트 추가
        playerList[socket.id] = newPlayer;

        //  나를 포함한 모든 플레이어 정보 가져오기
        socket.emit('newPlayer', playerList, socket.id, false);
        
        //  나를 제외한 모든 소켓에게 나의 정보 전송
        socket.broadcast.emit('newPlayer', current_info, socket.id, true);

        console.log('WELCOME ['+socket.id+'] :: CONTACT: ' + count());
        function count() {
            let count = 0;
            for (let i in playerList) {
                count++;
            }
            return count;
        }

        //  유닛 움직이기
        socket.on('movUnit', function(id, x, y) {
            playerList[id].body.x = x;
            playerList[id].body.y = y;
            io.emit('movUnit', playerList[id]);
        })

        //  연결 끊기
        socket.on('disconnect', function() {
            io.emit('disconnect', socket.id);
            console.log('GOODBYE ['+socket.id+'] :: CONTACT: ' + playerList.length);
        })
    })
})

//========================================================================================================================
//  서버 함수
//  2018.10.18 강준하
//========================================================================================================================

//  플레이어 생성
function Player (startX, startY, sprite, speed) {
    this.x = startX
    this.y = startY
    this.sprite = sprite
    this.speed = speed;
}