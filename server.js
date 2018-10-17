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

///======================================================================
//  서버 제어
/// 서버 측
server.lastPlayerID = 0;
server.lastDir = -1;

/// 소켓 측
io.on('connection',function(socket) {
    socket.lastUnitID = 0;

    socket.on('newPlayer',function() {
        //  새로운 플레이어
        console.log('a user connection');
        socket.player = {
            id: server.lastPlayerID,
            dir: server.lastDir *= -1,
            hp: 20,
            money: 100,
            unitList: []
        }

        //  나를 제외한 모든 소켓에게 정보 전송
        socket.broadcast.emit('addPlayer', socket.player);

        //  ID부여 및 나를 포함한 모든 플레이어 정보 가져오기
        socket.emit('newPlayer', server.lastPlayerID++, getAllPlayers());
        
        //  새로운 유닛
        socket.on('newUnit', function(unitSprite, unitPosX, unitPosY) {
            socket.player.unitList[socket.lastUnitID] = {
                iid: socket.player.id,
                id: socket.lastUnitID,
                x: unitPosX,
                y: unitPosY,
                sprite: unitSprite
            }
            io.emit('addUnit', socket.player.unitList[socket.lastUnitID++]);
        })

        //  유닛 움직이기
        socket.on('movUnit', function(id, x, y) {
            var ul = socket.player.unitList;
            for (var i = 0; i < ul.length; i++) {
                ul[i].x += x;
                ul[i].y += y;
            }
            io.emit('movUnit', id, ul);
        })

        //  연결 끊기
        socket.on('disconnect', function() {
            console.log('user disconnect');
            io.emit('disconnect', socket.player.id);
        })
    })
})

//  접속된 플레이어 정보 반환
function getAllPlayers() {
    var playerList = [];
    Object.keys(io.sockets.connected).forEach(function(socketID) {
        var player = io.sockets.connected[socketID].player;
        if (player) playerList.push(player);
    });
    //console.log(playerList);
    return playerList;
}