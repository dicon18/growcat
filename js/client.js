/// 클라이언트 인터페이스
var Client = {};
Client.socket = io();
Client.socket.connect('59.14.117.189:80');

///======================================================================
//  송신
Client.newPlayer = function() {
    this.socket.emit('newplayer');
}

Client.newUnit = function(unitSprite) {
    this.socket.emit('newUnit', unitSprite);
}

Client.movUnit = function(id) {
    this.socket.emit('movUnit', id);
}

///======================================================================
//  수신
/// 새로운 플레이어 추가(broadcast)
Client.socket.on('addPlayer', function(data) {
    Game.addPlayer(data.id, data.dir, data.hp, data.money, data.unitList);  
})

Client.socket.on('getAllplayers', function(myId, data) {
    /// 새로운 플레이어 설정 및 생성
    //  ID 부여
    Game.myId = myId;

    for (var i = 0; i < data.length; i++) {
        //  플레이어 리스트 정보 가져오기
        Game.players[data[i].id] = data[i];

        for (var j = 0; j < data[i].unitList.length; j++) {
            //  유닛 생성
            let u = data[i].unitList[j];
            Game.addUnit(u.iid, u.id, u.x, u.y, u.sprite);
        }
    }

    //  연결 완료
    Game.isConnect = true;

    /// 플레이어 제어
    //  유닛 생성
    Client.socket.on('addUnit', function(data) {
        Game.addUnit(data.iid, data.id, data.x, data.y, data.sprite);
    })

    //  유닛 이동
    Client.socket.on('movUnit', function(id, ul) {
        for (var i = 0; i < Game.players[id].unitList.length; i++) {
            Game.players[id].unitList[i].x = ul[i].x;
        }
    })
})

Client.socket.on('remove', function(playerID) {
    Game.removeUnit(playerID);
    //TODO emit unit
})

Client.socket.on('disconnect', function(playerID) {
    Game.disconnect(playerID);
    console.log('연결 끊김')
})