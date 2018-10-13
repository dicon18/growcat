var Game = function(game) {};

Game.prototype = {
    create: function() {
        //  배경색
        this.background = this.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'bg_game');

        //  월드 크기
        this.world.setBounds(0, 0, 1920, 720);

        //  버튼 추가
        this.bt_unit1 = this.add.button(100, 500, 'bt_unit1');
        this.bt_unit1.onInputDown.add(function() {
            Client.newUnit('pacman');
        });
        this.bt_unit1.fixedToCamera = true;

        Client.newPlayer();
    },

    update: function() {
        this.cameraMov();
        this.unitMov();
    },

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

    unitMov: function() {
        // for (var i = 0; i < this.players.length; i++) {
        //     for (var j = 0; j < this.players[i].unitList.length; j++) {
        //             this.players[i].unitList[j].x += 4;
        //     }
        // }
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

    removeUnit: function(socketID) {
        for (let i = 0; i < this.players[socketID].unitList.length; i++) {
            this.players[socketID].unitList[i].destroy();
        }
        delete this.players[socketID]; 
    },

    disconnect: function(socketID) {
        this.removeUnit(socketID);
    }
}