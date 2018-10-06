/// 클라이언트 인터페이스
var Client = {};
Client.socket = io.connect();


///======================================================================
/// 송신
Client.newPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.newUnit = function(unitName){
    Client.socket.emit('newUnit', unitName)
}

///======================================================================
/// 수신
Client.socket.on('newplayer',function(data){
    Game.addPlayer(data.id,data.unitList);
});

Client.socket.on('getAllplayers',function(data){
    //  연결 끊기
    Client.socket.on('remove',function(id){
        Game.removePlayer(id);
    });
});