/// 게임 클라이언트 소켓(인터페이스)
var Client = {};
Client.socket = io.connect();

Client.sendTest = function(){
    //  emit(송신) 
    Client.socket.emit('test');
};

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

//  단순한 좌표(click 레이블) 보내기
Client.sendClick = function(x,y){
    Client.socket.emit('click',{x:x,y:y});
};

/// on(수신)
Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

    //  움직이기
    Client.socket.on('move',function(data){
        Game.movePlayer(data.id,data.x,data.y);
    });

    //  연결 끊기
    Client.socket.on('remove',function(id){
        Game.removePlayer(id);
    });
});