/// 클라이언트 소켓 인터페이스
var Client = {};
Client.socket = io();
Client.socket.connect('todak.me:80');

//========================================================================================================================
//  클라이언트(서버에 데이터 요청) << 클라이언트 소켓/(인터페이스 역활) << 서버(연결된 소켓간 데이터 전송) >> DB(TODO)
//  2018.10.18 강준하
//========================================================================================================================

//  플레이어 중도 참가
Client.socket.on('addPlayer', function(data) {
    Client.addPlayer(data);
})

//  게임 제어
Client.socket.on('newPlayer', function(player_id, data) {
    //  새로운 플레이어 설정
    Client.newPlayer(player_id, data);

    //  유닛 생성
    Client.socket.on('addUnit', function(data) {
        Client.addUnit(data);
    })

    //  유닛 이동
    Client.socket.on('movUnit', function(player_id, unit_id, ul) {
        Client.movUnit(player_id, unit_id, ul);
    })

    //  유닛 제거
    Client.socket.on('remove', function(player_id) {
        Client.removeUnit(player_id);
        //TODO emit unit
    })
    
    //  연결 끊김
    Client.socket.on('disconnect', function(player_id) {
        Client.disconnect(player_id);
    })
})

//========================================================================================================================
//  클라이언트 함수
//  2018.10.18 강준하
//========================================================================================================================

Client.addPlayer = function(data) {
    Game.players[data.id] = data;
}

Client.newPlayer = function(player_id, data) {
    Game.id = player_id;
    for (let i in data) {
        Game.players[data[i].id] = data[i];
        for (let j in data[i].unitList) {
            this.addUnit(data[i].unitList[j]);
        }
    }
    Client.socket.emit('addUnit', irandom_range(0, CANVAS_WIDTH), irandom_range(0, CANVAS_HEIGHT), "spr_unit1");
}

Client.addUnit = function(data) {
    Game.players[data.iid].unitList[data.id] = game.add.sprite(data.x, data.y, data.sprite);
    Game.players[data.iid].unitList[data.id].anchor.x = 0.5;
    Game.players[data.iid].unitList[data.id].anchor.y = 0.5;

    Game.players[data.iid].unitList[data.id].iid = Client.socket.id;
    Game.players[data.iid].unitList[data.id].id = data.id;

    game.camera.follow(Game.players[data.iid].unitlist[data.id]);
    game.physics.enable(Game.players[data.iid].unitlist[data.id]);

    Game.connected = true;
}

Client.movUnit = function(player_id, unit_id, ul) {
    Game.players[player_id].unitList[unit_id].x = ul.x;
    Game.players[player_id].unitList[unit_id].y = ul.y;
}

Client.removeUnit = function(player_id) {
    for (let i in Game.players[player_id].unitList) {
        Game.players[player_id].unitList[i].destroy();
    }
    delete Game.players[player_id]; 
}

Client.disconnect = function(player_id) {
    this.removeUnit(player_id);
}   