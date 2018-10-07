/// 클라이언트 인터페이스
var Client = {};
Client.socket = io();


///======================================================================
//  송신
Client.newPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.newUnit = function(unitSprite){
    Client.socket.emit('newUnit', unitSprite)
}

///======================================================================
//  수신
/// 생성
Client.socket.on('addplayer',function(data){
    Game.addPlayer(data.id, data.hp, data.money, data.unitList);
    console.log('add player');
});

Client.socket.on('myId', function(id) {
    Game.myId = id;
    console.log(Game.myId);
});

Client.socket.on('getAllplayers',function(data){
    console.log(data.length);
    console.log(data[0].unitList.length);
    for(var i = 0; i < data.length; i++) {
        var p = data[i];
        console.log('@');
        for (var j = 0; j < data[i].unitList.length; j++) {
            let u = p.unitList[i];
            Game.addUnit(u.iid, u.id, u.x, u.y, u.sprite);
            console.log('!');
        }
    }

    //  연결 끊기
    Client.socket.on('disconnect',function(socketID){
        Game.disconnect(socketID);
    });

    Client.socket.on('remove',function(unitID){
        Game.removeUnit(unitID);
    });
});

/// update
Client.socket.on('addUnit',function(data){
    Game.addUnit(data.iid, data.id, data.x, data.y, data.sprite);
});