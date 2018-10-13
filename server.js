/// 게임 서버
var express = require('express');
var app = express();
var server = app.listen(80, function() {
    console.log('Listening on '+server.address().port);
})
var io = require('socket.io').listen(server);

app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
})

//  플레이어 ID 
server.lastPlayerID = 0;
server.lastDir = 1;

io.on('connection',function(socket) {
    socket.lastUnitID = 0;

    socket.on('newplayer',function() {
        //  새로운 플레이어
        socket.player = {
            id: server.lastPlayerID,
            dir: server.lastDir *= -1,
            hp: 20,
            money: 100,
            unitList: []
        }
        console.log('a user connection');

        //  내 정보 전송
        socket.emit('addPlayerList', server.lastPlayerID++);
        io.emit('addPlayerData', socket.player);

        //  모든 플레이어 정보 가져오기
        socket.emit('getAllplayers', getAllPlayers());
    
        //  새로운 유닛
        socket.on('newUnit', function(unitSprite) {
            socket.player.unitList[socket.lastUnitID] = {
                iid: socket.player.id,
                id: socket.lastUnitID,
                x: randomInt(100, 700),
                y: randomInt(100, 500),
                sprite: unitSprite
            }
            io.emit('addUnit', socket.player.unitList[socket.lastUnitID++]);
        })

        //  연결 끊기
        socket.on('disconnect', function() {
            console.log('user disconnect');
            io.emit('disconnect', socket.player.id);
        })
    })
})

/// 모든 플레이어 정보 반환
function getAllPlayers() {
    var playerList = [];
    Object.keys(io.sockets.connected).forEach(function(socketID) {
        var player = io.sockets.connected[socketID].player;
        if (player) playerList.push(player);
    });
    console.log(playerList);
    return playerList;
}

/// utility
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
