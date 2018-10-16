var Game = {
    ///======================================================================
    //  Init
    init: function() {
        this.game.stage.disableVisibilityChange = true;
    },

    ///======================================================================
    //  Create
    create: function() {
        //  배경색
        this.background = this.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'bg_game');

        //  월드 크기
        this.world.setBounds(0, 0, 1920, 720);

        //  플레이어 리스트
        this.players = [];

        //  버튼 추가
        this.bt_unit1 = this.add.button(100, 500, 'bt_unit1');
        this.bt_unit1.onInputDown.add(function() {
            Client.newUnit('pacman');
        });
        this.bt_unit1.fixedToCamera = true;

        //  새로운 플레이어 요청
        this.isConnect = false;
        Client.newPlayer();
    },

    ///======================================================================
    //  Update
    update: function() {
        this.cameraMov();

        if (this.isConnect) {
            this.movUnit(this.myId);
        }
    },

    ///======================================================================
    //  Render
    render: function() {
        //  DEBUGER
        this.game.debug.cameraInfo(this.game.camera, 32, 32);
    },

    ///======================================================================
    //  클라이언트
    cameraMov: function() {
        var hw = CANVAS_WIDTH / 2;
        if (this.game.input.y < (CANVAS_HEIGHT / 3) * 2) {
            if (this.game.input.x < hw - hw / 2)
                this.game.camera.x -= 6;
            if (this.game.input.x > hw + hw / 2)
                this.game.camera.x += 6;
        }
    },

    createUnit: function(sprite) {
        Client.newUnit(sprite)
        //  TODO x, y
    },

    movUnit: function(id) {
        Client.movUnit(id);
    },

    ///======================================================================
    //  소켓
    addPlayer: function(id, dir, hp, money, unitList) {
        this.players[id] = {
            id: id,
            dir: dir,
            hp: hp,
            money: money,
            unitList
        }
    },

    addUnit: function(iid ,id, x, y, sprite) {
        this.players[iid].unitList[id] = this.game.add.sprite(x, y, sprite);
    },

    removeUnit: function(playerID) {
        for (let i = 0; i < this.players[playerID].unitList.length; i++) {
            this.players[playerID].unitList[i].destroy();
        }
        delete this.players[playerID]; 
    },

    disconnect: function(playerID) {
        this.removeUnit(playerID);
    }
}
