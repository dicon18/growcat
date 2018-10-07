const WIDTH = 800;
const HEIGHT = 600;

/// 게임 클라이언트
var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO)

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
    BG = Game.add.tileSprite(0, 0, WIDTH, HEIGHT, 'BG');
    Game.stage.backgroundColor = 'cccccc';

    //  플레이어 리스트
    Game.players = [];

    //  버튼 추가
    this.button = Game.add.button(100, 500, 'bt_unit1');
    this.button.onInputDown.add(function() {
        Client.newUnit('pacman');
    });

    Client.newPlayer();
};

Game.update = function() {
    
}

Game.addPlayer = function(id, hp, money, unitList) {
    Game.players[id] = {
        hp: hp,
        money: money,
        unitList: [unitList]
    };
};

Game.addUnit = function(iid ,id, x, y, sprite) {
    Game.players[iid].unitList[id] = game.add.sprite(x, y, sprite);
};

Game.removeUnit = function(socketID) {
    for (var i = 0; i < Game.players[socketID].unitList.length; i++) {
        Game.players[socketID].unitList[i].destroy();
    }
    delete Game.players[socketID]; 
};

Game.disconnect = function(socketID) {
    Game.removeUnit(socketID);
}

Game.render = function() {

};


///======================================================================
//  룸 시작
game.state.start('Game'); 