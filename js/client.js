//  클라이언트 소켓 인터페이스
var Client = {};
Client.socket = io();
Client.socket.connect('todak.me:80');

//========================================================================================================================
//  클라이언트(서버에 데이터 요청) << 클라이언트 소켓/(인터페이스 역활) << 서버(연결된 소켓간 데이터 전송)
//  2018.10.18 강준하
//========================================================================================================================

//  게임 제어
Client.socket.on('newPlayer', function(playerList, id, isBroadcast) {
    //  새로운 플레이어 생성
    Client.newPlayer(playerList, id, isBroadcast);

    //  플레이어 이동
    Client.socket.on('movUnit', function(player) {
        Client.movUnit(player);
    })

    //  플레이어 제거
    Client.socket.on('remove', function(playerId) {
        console.log("remove");
        //Client.removeUnit(playerId);
    })
})

//========================================================================================================================
//  클라이언트 함수
//  2018.10.18 강준하
//========================================================================================================================

Client.newPlayer = function(data, id, isBroadcast) {
    console.log("create");
    Game.playerList[data.id] = new createPlayer(data.id, data.x, data.y, data.sprite);
    if (isBroadcast == false) {
        Game.isConnected = true;
        Game.myId = id;
    }
}

Client.movUnit = function(player) {
    Game.playerList[player.id].body.x = player.body.x;
    Game.playerList[player.id].body.y = player.body.y;
}

Client.removeUnit = function(playerId) {
    Game.playerList[playerId].player.destroy();
    delete Game.playerList[playerId]; 
    console.log(playerId);
}

///////////////////////////////////

function createPlayer(id, startX, startY, sprite) {
    this.player = game.add.sprite(startX , startY, sprite);
    this.player.anchor.setTo(0.5,0.5);
    this.player.id = id;
	game.physics.p2.enableBody(this.player, true);
}