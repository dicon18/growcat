/// 게임 클라이언트
//  게임 해상도 
var Game = {};

Game.init = function() {
    //  게임창에 포커스가 없어도 반응
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    //  이미지 불러오기
    game.load.image('pacman', 'assets/sprites/pacman.png');
};

Game.create = function() {
    //  게임 맵 생성
    Game.playerMap = {};

    //var layer;
    
    //  클릭
    //inputEnabled = true;
    //events.onInputUp.add(Game.getCoordinates, this);

    // 서버
    Client.askNewPlayer();
};

Game.getCoordinates = function(layer, pointer) {
    //  클라이언트에 좌표 전송
    Client.sendClick(pointer.worldX, pointer.worldY);
};

//  객체 생성
Game.addNewPlayer = function(id, x, y) {
    Game.playerMap[id] = game.add.sprite(x, y, 'pacman');
};

//  객체 이동
Game.movePlayer = function(id, x, y) {
    var player = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x, player.y, x, y);
    var tween = game.add.tween(player);
    var duration = distance * 10;
    tween.to({x:x,y:y}, duration);
    tween.start();
};

//  객체 제거
Game.removePlayer = function(id) {
    Game.playerMap[id].destroy();
    delete Game.playerMap[id]; 
};