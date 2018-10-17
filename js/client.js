/// 클라이언트 인터페이스
var Client = {};
Client.socket = io();
Client.socket.connect('59.14.117.189:80');

///======================================================================
//  클라이언트(Game.js) <<<< 인터페이스(client.js) <<>> 서버(server.js)
//            >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/// 플레이어 중도 참가
Client.socket.on('addPlayer', function(data) {
    Client.addPlayer(data.id, data.dir, data.hp, data.money, data.unitList);  
})

/// 게임 제어
Client.socket.on('newPlayer', function(myId, data) {
    //  새로운 플레이어 설정
    Client.newPlayer(myId, data);

    //  유닛 생성
    Client.socket.on('addUnit', function(data) {
        Client.addUnit(data.iid, data.id, data.x, data.y, data.sprite);
    })

    //  유닛 이동
    Client.socket.on('movUnit', function(id, ul) {
        Client.movUnit(id, ul);
    })

    //  유닛 제거
    Client.socket.on('remove', function(playerId) {
        Client.removeUnit(playerId);
        //TODO emit unit
    })
    
    //  연결 끊김
    Client.socket.on('disconnect', function(playerId) {
        Client.disconnect(playerId);
    })
})

///======================================================================
//  클라이언트 함수
Client.addPlayer = function(id, dir, hp, money, unitList) {
    Game.players[id] = {
        id: id,
        dir: dir,
        hp: hp,
        money: money,
        unitList
    }
}

Client.newPlayer = function(myId, data) {
    //  ID 부여
    Game.myId = myId;
    for (var i = 0; i < data.length; i++) {
        Game.players[data[i].id] = data[i];
        for (var j = 0; j < data[i].unitList.length; j++) {
            var ul = data[i].unitList[j];
            this.addUnit(ul.iid, ul.id, ul.x, ul.y, ul.sprite);
        }
    }
    Game.isConnect = true;
}

Client.addUnit = function(iid ,id, x, y, sprite) {
    Game.players[iid].unitList[id] = game.add.sprite(x, y, sprite);
}

Client.movUnit = function(id, ul) {
    for (var i = 0; i < Game.players[id].unitList.length; i++) {
        Game.players[id].unitList[i].x = ul[i].x;
        Game.players[id].unitList[i].y = ul[i].y;
    }
}

Client.removeUnit = function(playerId) {
    for (var i = 0; i < Game.players[playerId].unitList.length; i++) {
        Game.players[playerId].unitList[i].destroy();
    }
    delete Game.players[playerId]; 
}

Client.disconnect = function(playerId) {
    Game.removeUnit(playerId);
}