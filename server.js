/// 게임 서버
var express = require('express');
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

//  서버 측
server.score1 = 0;
server.score2 = 0;

//  소켓 측
io.on('connection',function(socket) {
    socket.lastUnitId = 0;

    socket.on('newPlayer',function() {
        //  새로운 플레이어
        socket.player = {
            id: socket.id,
            unitList: []
        }
        console.log('WELCOME ['+socket.player.id+'] :: CONTACT: ' + getAllPlayers().length);

        //  나를 제외한 모든 소켓에게 정보 전송
        socket.broadcast.emit('addPlayer', socket.player);

        //  ID부여 및 나를 포함한 모든 플레이어 정보 가져오기
        socket.emit('newPlayer', socket.player.id, getAllPlayers());
        
        //  새로운 유닛
        socket.on('addUnit', function(x, y, sprite) {
            socket.player.unitList[socket.lastUnitId] = {
                iid: socket.player.id,
                id: socket.lastUnitId,
                x: x,
                y: y,
                sprite: sprite
            }
            io.emit('addUnit', socket.player.unitList[socket.lastUnitId++]);
        })

        //  유닛 움직이기
        socket.on('movUnit', function(playerId, unitId, x, y) {
            let unit = socket.player.unitList[unitId];
            unit.x = x;
            unit.y = y;
            io.emit('movUnit', playerId, unitId, unit);
        })

        //  연결 끊기
        socket.on('disconnect', function() {
            io.emit('disconnect', socket.player.id);
            console.log('GOODBYE ['+socket.player.id+'] :: CONTACT: ' + getAllPlayers().length);
        })
    })
})

//========================================================================================================================
//  서버 함수
//  2018.10.18 강준하
//========================================================================================================================

function getAllPlayers() {
    let playerList = [];
    Object.keys(io.sockets.connected).forEach(function(socket_id) {
        let player = io.sockets.connected[socket_id].player;
        if (player) playerList.push(player);
    });
    //console.log(playerList);
    return playerList;
}