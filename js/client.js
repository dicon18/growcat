/// 클라이언트 인터페이스
var Client = {};
Client.socket = io();


///======================================================================
//  송신
Client.newPlayer = function() {
    Client.socket.emit('newplayer');
};

Client.newUnit = function(unitSprite) {
    Client.socket.emit('newUnit', unitSprite)
}

///======================================================================
//  수신
Client.socket.on('addPlayerList', function(myID) {
    Game.myID = myID;

    //  비동기 안전장치
    Game.players = [];
    Client.socket.on('addPlayerData', function(data) {
        Game.addPlayer(data.id, data.hp, data.money, data.unitList);
    });
});

Client.socket.on('getAllplayers', function(data) {
    for (var i = 0; i < data.length; i++) {
        //  플레이어 리스트 정보 가져오기
        Game.players[data[i].id] = data[i];

        for (var j = 0; j < data[i].unitList.length; j++) {
            //  유닛 생성
            let u = data[i].unitList[j];
            Game.addUnit(u.iid, u.id, u.x, u.y, u.sprite);
        }
    }

    //  연결 끊기
    Client.socket.on('disconnect', function(socketID) {
        Game.disconnect(socketID);
    });

    Client.socket.on('remove', function(socketID) {
        Game.removeUnit(socketID);
    });
});

/// update
Client.socket.on('addUnit', function(data){
    Game.addUnit(data.iid, data.id, data.x, data.y, data.sprite);
});