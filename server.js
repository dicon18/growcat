/// 게임 서버
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

server.listen(process.env.PORT || 8081,function(){
    console.log('Listening on '+server.address().port);
});


server.lastPlayderID = 0;
server.lastUnitID = 0;

io.on('connection',function(socket){
    socket.on('newplayer',function(){
        //  새로운 플레이어
        socket.player = {
            id: server.lastPlayderID++,
            unitList: []
        };

        //  내 정보 전송
        socket.broadcast.emit('addplayer',socket.player);

        //  update
        socket.emit('getAllplayers',getAllPlayers());

        //  연결 끊기
        socket.on('disconnect',function(){
            console.log('user disconnect');
            io.emit('remove',socket.player.id);
        });
    });

    //  새로운 유닛
    socket.on('newUnit', function(unitSprite){
        console.log(unitSprite);
        socket.player.unitList[server.lastUnitID] = {
            id: server.lastUnitID,
            sprite: unitSprite,
            x: 100,
            y: 300
        }
        io.emit('addUnit', socket.player.unitList[server.lastUnitID++]);
    });
});

/// 모든 플레이어 정보 반환
function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        //console.log(player);
        if(player) players.push(player);
    });
    return players;
}

/// Utility
//  random_range
function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}