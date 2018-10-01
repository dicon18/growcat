/// 게임 클라이언트
//  게임 해상도 
var Game = {};

Game.init = function() {
    //  게임창에 포커스가 없어도 반응
    game.stage.disableVisibilityChange = true;
};

//  이미지 불러오기
Game.preload = function() {
    game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/tilesheet.png', 32, 32);
    game.load.image('pacman', 'assets/sprites/pacman.png');
};

Game.create = function() {
    /// 게임 맵 생성
    //  배경색
    Game.stage.backgroundColor = 'ffdead';

    // 타일추가
    Game.playerMap = {};
    var map = game.add.tilemap('map');
    map.addTilesetImage('tilesheet', 'tileset');
    var layer;
    for (let i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
    }
    
    //  월드 사이즈
    //game.world.setBounds(-1000, -1000, 1000, 1000);

    // 서버
    Client.askNewPlayer();
};

//  클라이언트에 좌표 전송
Game.getCoordinates = function(layer, pointer) {
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

//  랜더링
Game.render = function() {
    //  디버깅
    //game.debug.cameraInfo(game.camera, 32, 32);
};