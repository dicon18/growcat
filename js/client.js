/// 클라이언트 인터페이스
var Client = {};
Client.socket = io();
Client.socket.connect('59.14.117.189:80');

///======================================================================
//  클라이언트 <=> 소켓 <=> 서버
/// 플레이어 중도 참가
Client.socket.on('addPlayer', function(data) {
    Game.addPlayer(data.id, data.dir, data.hp, data.money, data.unitList);  
})

/// 게임 제어
Client.socket.on('newPlayer', function(myId, data) {
    //  새로운 플레이어 설정
    Game.newPlayer(myId, data);

    //  유닛 생성
    Client.socket.on('addUnit', function(data) {
        Game.addUnit(data.iid, data.id, data.x, data.y, data.sprite);
    })

    //  유닛 이동
    Client.socket.on('movUnit', function(id, ul) {
        Game.movUnit(id, ul);
    })

    //  유닛 제거
    Client.socket.on('remove', function(playerId) {
        Game.removeUnit(playerId);
        //TODO emit unit
    })
    
    //  연결 끊김
    Client.socket.on('disconnect', function(playerId) {
        Game.disconnect(playerId);
    })
})