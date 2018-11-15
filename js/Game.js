//  게임 클라이언트
var Game = {
    //========================================================================================================================
    //  게임 이벤트
    //  2018.10.18 강준하
    //========================================================================================================================

    init: function() {
        game.stage.disableVisibilityChange = true;

        //  물리 / 그룹 설정
        game.physics.startSystem(Phaser.Physics.P2JS);
        var playerCollisionGroup = game.physics.p2.createCollisionGroup();
        var ballCollisionGroup = game.physics.p2.createCollisionGroup();
        var boxCollisionGroup = game.physics.p2.createCollisionGroup();
        game.physics.p2.updateBoundsCollisionGroup();
    },

    create: function() {
        //  타일셋
        this.background = this.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'bg_game');

        //  월드 크기
        this.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        //  플레이어 관리
        this.playerList = [];

        //  키보드 방향키 입력
        this.cursors = game.input.keyboard.createCursorKeys();

        //  새로운 플레이어 요청
        this.isConnected = false;
        Client.socket.emit('newPlayer', {x: irandom_range(0, WORLD_WIDTH), y: irandom_range(0, WORLD_HEIGHT), sprite: "spr_unit1", speed: 200});
    },

    update: function() {
        if (this.isConnected) {
            //this.reqMovUnit();
        }
    },

    render: function() {

    },

    //========================================================================================================================
    //  게임 함수
    //  2018.10.18 강준하
    //========================================================================================================================

    reqMovUnit: function() {
        let player = this.playerList[this.myId].player;
        let x = player.body.x + (this.cursors.right.isDown - this.cursors.left.isDown) * player.speed;
        let y = player.body.y + (this.cursors.down.isDown - this.cursors.up.isDown) * player.speed;
        Client.socket.emit('movUnit', this.myId, x, y);
    }
}
