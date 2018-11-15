//  클라이언트 소켓 인터페이스
var Client = {};
Client.socket = io();
Client.socket.connect('todak.me:80');

//========================================================================================================================
//  클라이언트(서버에 데이터 요청) << 클라이언트 소켓/(인터페이스 역활) << 서버(연결된 소켓간 데이터 전송)
//  2018.10.18 강준하
//========================================================================================================================

//  플레이어 중도 참가
Client.socket.on('addPlayer', function(data) {
    Client.addPlayer(data);
})

//  게임 제어
Client.socket.on('newPlayer', function(playerId, data) {
    //  새로운 플레이어 설정
    Client.newPlayer(playerId, data);

    //  유닛 생성
    Client.socket.on('addUnit', function(data, isBroadcast) {
        Client.addUnit(data, isBroadcast);
    })

    //  유닛 이동
    Client.socket.on('movUnit', function(playerId, unitId, unit) {
        Client.movUnit(playerId, unitId, unit);
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

//========================================================================================================================
//  클라이언트 함수
//  2018.10.18 강준하
//========================================================================================================================

Client.addPlayer = function(data) {
    Game.players[data.id] = data;
}

Client.newPlayer = function(playerId, data) {
    Game.id = playerId;
    for (let i in data) {
        Game.players[data[i].id] = data[i];
        for (let j in data[i].unitList) {
            this.addUnit(data[i].unitList[j]);
        }
    }
    Client.socket.emit('addUnit', irandom_range(0, CANVAS_WIDTH), irandom_range(0, CANVAS_HEIGHT), "spr_unit1");
}

Client.addUnit = function(data, isBroadcast) {
    Game.players[data.iid].unitList[data.id] = game.add.sprite(data.x, data.y, data.sprite);
    Game.players[data.iid].unitList[data.id].anchor.x = 0.5;
    Game.players[data.iid].unitList[data.id].anchor.y = 0.5;
    Game.players[data.iid].unitList[data.id].iid = Client.socket.id;
    Game.players[data.iid].unitList[data.id].id = data.id;
    game.physics.p2.enable(Game.players[data.iid].unitList[data.id], false);
    if (isBroadcast == false) {
        Game.isConnected = true;
    }
}

Client.movUnit = function(playerId, unitId, unit) {
    Game.players[playerId].unitList[unitId].body.x = unit.x;
    Game.players[playerId].unitList[unitId].body.y = unit.y;
}

Client.removeUnit = function(playerId) {
    for (let i in Game.players[playerId].unitList) {
        Game.players[playerId].unitList[i].destroy();
    }
    delete Game.players[playerId]; 
}

Client.disconnect = function(playerId) {
    this.removeUnit(playerId);
}   