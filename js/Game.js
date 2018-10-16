var Game = {
    ///======================================================================
    //  Init
    init: function() {
        this.game.stage.disableVisibilityChange = true;
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
        this.bt_unit1 = this.add.button(100, 500, 'bt_unit1');
        this.bt_unit1.onInputDown.add(function() {
            Client.socket.emit('newUnit', 'pacman');    //  TODO 함수로 대체
        });
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
            this.reqMovUnit(this.myId);
        }
    },

    ///======================================================================
    //  Render
    render: function() {
        //  DEBUGER
        this.game.debug.cameraInfo(this.game.camera, 32, 32);
    },

    ///=====================================================================
    //  게임 함수
    cameraMov: function() {
        var hw = CANVAS_WIDTH / 2;
        if (this.game.input.y < (CANVAS_HEIGHT / 3) * 2) {
            if (this.game.input.x < hw - hw / 2) {
                this.game.camera.x -= 6;
            }
            if (this.game.input.x > hw + hw / 2) {
                this.game.camera.x += 6;
            }
        }
    },

    reqCreateUnit: function(sprite) {
        Client.socket.emit('newUnit', sprite);  //  TODO x, y 추가
        //  TODO x, y
    },

    reqMovUnit: function(id) {
        Client.socket.emit('movUnit', id);  //  TODO x, y 추가
    },

    ///======================================================================
    //  클라이언트 함수
    addPlayer: function(id, dir, hp, money, unitList) {
        this.players[id] = {
            id: id,
            dir: dir,
            hp: hp,
            money: money,
            unitList
        }
    },

    newPlayer: function(myId, data) {
        //  ID 부여
        this.myId = myId;
        for (var i = 0; i < data.length; i++) {
            this.players[data[i].id] = data[i];
            for (var j = 0; j < data[i].unitList.length; j++) {
                let u = data[i].unitList[j];
                this.addUnit(u.iid, u.id, u.x, u.y, u.sprite);
            }
        }
        this.isConnect = true;
    },

    addUnit: function(iid ,id, x, y, sprite) {
        this.players[iid].unitList[id] = this.game.add.sprite(x, y, sprite);
    },

    movUnit: function(id, ul) {
        for (var i = 0; i < this.players[id].unitList.length; i++) {
            this.players[id].unitList[i].x = ul[i].x;
        }
    },

    removeUnit: function(playerId) {
        for (let i = 0; i < this.players[playerId].unitList.length; i++) {
            this.players[playerId].unitList[i].destroy();
        }
        delete this.players[playerId]; 
    },

    disconnect: function(playerId) {
        this.removeUnit(playerId);
    }
}
