///	게임 서버
var express = require('express');
var app = express();
var server = require('http').Server(app);

//  서버 객체 수신
var io = require('socket.io').listen(server);

app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.lastPlayderID = 0;

server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port);
});

io.on('connection',function(socket){
	//	플레이어에게 ID부여 및 임의 좌표 지정
    socket.on('newplayer',function(){
        console.log('a user connected');
        socket.player = {
            id: server.lastPlayderID++,
            x: randomInt(100,400),
            y: randomInt(100,400)
        };
        /// emit(송신)
        socket.emit('allplayers',getAllPlayers());

        /// 나를 제외한 다른 클라이언트 소켓들에게 이벤트 전송
        socket.broadcast.emit('newplayer',socket.player);

        /// on(수신)
        //  클릭 이벤트 받기
        socket.on('click',function(data){
            console.log('click to '+data.x+', '+data.y);
            socket.player.x = data.x;
            socket.player.y = data.y;
            io.emit('move',socket.player);
        });

        //	연결 끊기
        socket.on('disconnect',function(){
            console('user disconnect');
            io.emit('remove',socket.player.id);
        });
    });

    socket.on('test',function(){
        console.log('test received');
    });
});

//	모든 소켓 반복처리
function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}