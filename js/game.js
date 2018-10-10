const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const WORLD_WIDTH = 1920;
const WORLD_HEIGHT = 720;

/// 게임 클라이언트
var game = new Phaser.Game(CANVAS_WIDTH, CANVAS_HEIGHT, Phaser.AUTO);

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
    this.BG = this.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'BG');
    this.stage.backgroundColor = 'cccccc';

    //  월드 크기
    this.world.setBounds(0, 0, 1920, 720);

    //  버튼 추가
    this.bt_unit1 = this.add.button(100, 500, 'bt_unit1');
    this.bt_unit1.onInputDown.add(function() {
        Client.newUnit('pacman');
    });
    this.bt_unit1.fixedToCamera = true;

    Client.newPlayer();
};

Game.update = function() {
    this.cameraMov();
    this.unitMov();
}

Game.render = function() {
    //  DEBUGER
    game.debug.cameraInfo(game.camera, 32, 32);
};


///======================================================================
//  클라이언트
Game.cameraMov = function() {
    var hw = CANVAS_WIDTH / 2;
    if (game.input.y < (CANVAS_HEIGHT / 3) * 2) {
        if (game.input.x < hw - hw / 2)
            game.camera.x -= 6;
        if (game.input.x > hw + hw / 2)
            game.camera.x += 6;
    }
};

Game.unitMov = function() {
    // for (var i = 0; i < this.players.length; i++) {
    //     for (var j = 0; j < this.players[i].unitList.length; j++) {
    //             this.players[i].unitList[j].x += 4;
    //     }
    // }
}

///======================================================================
//  소켓
Game.addPlayer = function(id, dir, hp, money, unitList) {
    this.players[id] = {
        id: id,
        dir: dir,
        hp: hp,
        money: money,
        unitList
    };
};

Game.addUnit = function(iid ,id, x, y, sprite) {
    this.players[iid].unitList[id] = game.add.sprite(x, y, sprite);
};

Game.removeUnit = function(socketID) {
    for (let i = 0; i < this.players[socketID].unitList.length; i++) {
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