var Game = {
    ///======================================================================
    //  Init
    init: function() {
        game.stage.disableVisibilityChange = true;
    },

    ///======================================================================
    //  Create
    create: function() {
        //  타일셋
        this.background = this.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'bg_game');

        //  월드 크기
        this.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        //  플레이어 리스트
        this.players = [];

        //  버튼 추가
        this.bt_unit1 = this.add.button(100, 500, 'bt_unit1', this.reqCreateUnit, this);
        this.bt_unit1.unitSprite = 'spr_unit1';
        this.bt_unit1.fixedToCamera = true;

        //  새로운 플레이어 요청
        this.isConnect = false;
        Client.socket.emit('newPlayer');
    },

    ///======================================================================
    //  Update
    update: function() {
        this.cameraMov();

        if (this.isConnect) {
            this.reqMovUnit(this.myId, 2, 2);
        }
    },

    ///======================================================================
    //  Render
    render: function() {
        //  DEBUGER
        game.debug.cameraInfo(game.camera, 32, 32);
    },

    ///=====================================================================
    //  게임 함수
    cameraMov: function() {
        var hw = CANVAS_WIDTH / 2;
        if (game.input.y < (CANVAS_HEIGHT / 3) * 2) {
            if (game.input.x < hw - hw / 2) {
                game.camera.x -= 6;
            }
            if (game.input.x > hw + hw / 2) {
                game.camera.x += 6;
            }
        }
    },

    reqCreateUnit: function(button) {
        Client.socket.emit('newUnit', button.unitSprite, 0, irandom_range(0, CANVAS_HEIGHT));
    },

    reqMovUnit: function(id, x, y) {
        Client.socket.emit('movUnit', id, x, y);
    }
}
