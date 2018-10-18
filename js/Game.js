/// 게임 클라이언트
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
            //let targetId = this.id;
            let ul = this.players[this.id].unitList;
            for (let i in ul) {
                this.reqMovUnit(ul[i].id, 2, 0.04);
            }
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
        let hw = CANVAS_WIDTH / 2;
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
        //  (x, y, sprite)
        Client.socket.emit('addUnit', 0, irandom_range(0, CANVAS_HEIGHT), button.unitSprite);
    },

    reqMovUnit: function(id, x, y) {
        //TODO->Client.socket.io.to(소켓아이디).emit(...)
        Client.socket.emit('movUnit', id, x, y);
    }
}
