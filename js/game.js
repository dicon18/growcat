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

//  키 입력 선언
var key_left, key_right, key_up, key_down;

//  설정 변수
var speed;


Game.create = function() {
    //  키 세팅
    this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.key_up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.key_down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

    //  속도
    this.speed = 4;

    /// 게임 맵 생성
    //  배경색
    Game.stage.backgroundColor = 'ffdead';

    //  다중 플레이어 관리
    Game.playerMap = {};
    
    //  월드 사이즈
    //game.world.setBounds(-1000, -1000, 1000, 1000);

    // 서버
    Client.askNewPlayer();
};

Game.update = function() {
    //  움직이기
    Game.getCoordinates();
}

//  클라이언트 소켓에 좌표 전송
Game.getCoordinates = function() {
    let x = (this.key_right.isDown - this.key_left.isDown) * this.speed;
    let y = (this.key_down.isDown - this.key_up.isDown) * this.speed;
    //console.log((this.key_right.isDown - this.key_left.isDown) * this.speed);
    Client.sendClick(x, y);
};

//  객체 생성
Game.addNewPlayer = function(id, x, y) {
    Game.playerMap[id] = game.add.sprite(x, y, 'pacman');
};

//  객체 이동
Game.movePlayer = function(id, x, y) {
    var player = Game.playerMap[id];
    player.x += x;
    player.y += y;
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