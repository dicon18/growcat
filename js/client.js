/// 클라이언트 인터페이스
var Client = {};
Client.socket = io.connect();


///======================================================================
/// 송신
Client.newPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.newUnit = function(unitSprite){
    Client.socket.emit('newUnit', unitSprite)
}

///======================================================================
/// 수신
Client.socket.on('addplayer',function(data){
    Game.addPlayer(data.id,data.unitList);
});

Client.socket.on('addUnit',function(data){
    Game.addUnit(data.id,data.x,data.y,data.sprite);
});

Client.socket.on('getAllplayers',function(data){
    //  연결 끊기
    Client.socket.on('remove',function(id){
        Game.removePlayer(id);
    });
});