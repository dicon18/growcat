/// 게임 클라이언트
var game = new Phaser.Game(800, 600, Phaser.AUTO)

var Game = {};
game.state.add('Game', Game);

Game.init = function() {
    //  게임창에 포커스가 없어도 반응
    game.stage.disableVisibilityChange = true;
};

//  이미지 불러오기
Game.preload = function() {
    game.load.image('pacman', 'assets/sprites/pacman.png');
    game.load.image('bt_unit1', 'assets/sprites/bt_unit1.png');
};

Game.create = function() {
    //  게임 설정
    this.key_left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.key_right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.key_up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.key_down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.speed = 4;

    //  배경색
    Game.stage.backgroundColor = 'cccccc';

    //  관리
    Game.playerList = {};
    Game.unitList = {};

    //  버튼 추가
    this.button = Game.add.button(100, 500, 'bt_unit1');
    this.button.onInputDown.add(function() {
        Client.newUnit('pacman')
    });

    // 서버
    Client.newPlayer();
};

Game.update = function() {
    for (let i in Game.unitList) {
        Game.unitList[i].x++;
    }
}

Game.addPlayer = function(id,unitList){
    Game.playerList[id] = {id:id};
    Game.unitList = unitList;
};

Game.addUnit = function(id, x, y, sprite) {
    Game.unitList[id] = game.add.sprite(x, y, sprite);
};

Game.removeUnit = function(id) {
    Game.unitList[id].destroy();
    delete Game.unitList[id]; 
};

//  랜더링
Game.render = function() {
    //  디버깅
    //game.debug.cameraInfo(game.camera, 32, 32);
};

///======================================================================
//  소켓



///======================================================================
//  룸 시작
game.state.start('Game'); 