const CANVAS_WIDTH = 800//1280;
const CANVAS_HEIGHT = 600//720;
const WORLD_WIDTH = 1920;
const WORLD_HEIGHT = 720;

/// 게임 클라이언트
var game = new Phaser.Game(CANVAS_WIDTH, CANVAS_HEIGHT, Phaser.AUTO)

var Game = {};
game.state.add('Game', Game);

Game.init = function() {
    //  게임창에 포커스가 없어도 반응
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.image('BG', 'assets/background/background.png');
    game.load.image('pacman', 'assets/sprites/pacman.png');
    game.load.image('bt_unit1', 'assets/sprites/bt_unit1.png');
};

Game.create = function() {
    //  배경색
    BG = this.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'BG');
    this.stage.backgroundColor = 'cccccc';

    //  월드 크기
    this.world.setBounds(0, 0, 1920, 720);

    //  플레이어 리스트
    this.players = [];

    //  버튼 추가
    this.button = this.add.button(100, 500, 'bt_unit1');
    this.button.onInputDown.add(function() {
        Client.newUnit('pacman');
    });

    Client.newPlayer();
};

Game.update = function() {
    this.cameraMov();
}

Game.render = function() {
    //  DEBUGER
    game.debug.cameraInfo(game.camera, 32, 32);
};

///======================================================================
//  클라이언트
Game.cameraMov = function() {
    var hw = CANVAS_WIDTH / 2;
    if (game.input.x < hw - hw / 2)
        game.camera.x -= 4;
    if (game.input.x > hw + hw / 2)
        game.camera.x += 4;
};

///======================================================================
//  소켓
Game.addPlayer = function(id, hp, money, unitList) {
    this.players[id] = {
        hp: hp,
        money: money,
        unitList: [unitList]
    };
};

Game.addUnit = function(iid ,id, x, y, sprite) {
    this.players[iid].unitList[id] = game.add.sprite(x, y, sprite);
};

Game.removeUnit = function(socketID) {
    for (var i = 0; i < this.players[socketID].unitList.length; i++) {
        this.players[socketID].unitList[i].destroy();
    }
    delete this.players[socketID]; 
};

Game.disconnect = function(socketID) {
    this.removeUnit(socketID);
}

///======================================================================
//  룸 시작
game.state.start('Game'); 