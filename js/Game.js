//  게임 클라이언트
var Game = {
    //========================================================================================================================
    //  게임 이벤트
    //  2018.10.18 강준하
    //========================================================================================================================

    init: function () {
        game.stage.disableVisibilityChange = true;
    },

    create: function () {
        //  타일셋
        this.background = this.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'bg_game');

        //  월드 크기
        this.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        //  플레이어 관리
        this.players = [];
        
        //  새로운 플레이어 요청
        this.isConnected = false;
        Client.socket.emit('newPlayer');

        //  키보드 방향키 입력
        this.cursors = game.input.keyboard.createCursorKeys();
    },

    update: function () {
        if (this.isConnected) {
            let unit = this.players[this.id].unitList[0];
            this.reqMovUnit(unit);
        }
    },

    render: function () {

    },

    //========================================================================================================================
    //  게임 함수
    //  2018.10.18 강준하
    //========================================================================================================================

    reqMovUnit: function (unit) {
        let speed = 3;
        let hspeed = unit.x + (this.cursors.right.isDown - this.cursors.left.isDown) * speed;
        let vspeed = unit.y + (this.cursors.down.isDown - this.cursors.up.isDown) * speed;
        Client.socket.emit('movUnit', this.id, unit.id, hspeed, vspeed);
    }
}
