var socket;     
var isConnected = false;
var oPlayerList = [];

//  접속 완료
function onConnected() {
    console.log("Connected to server");
    create_player();
    isConnected = true;
    socket.emit("new_player", {x: irandom_range(0, WORLD_WIDTH), y: irandom_range(0, WORLD_HEIGHT), sprite: "spr_unit1", speed: 150});
}

//  플레이어 제거
function onRemovePlayer(data) {
    var removePlayer = find_playerID(data.id);
	if (!removePlayer) {
		console.log("Player not found: ", data.id)
		return;
	}
	removePlayer.player.destroy();
	oPlayerList.splice(oPlayerList.indexOf(removePlayer), 1);
}

//  플레이어 클래스
var Player = function(id, startX, startY, sprite, speed) {
    this.id = id;
    this.x = startX;
    this.y = startY;
    this.sprite = sprite;
    this.spedd = speed;
    this.player = game.add.sprite(this.x, this.y, this.sprite)

    this.player.anchor.setTo(0.5,0.5);
    //game.physics.p2.enableBody(this.player, true);
}

//  자기 자신 플레이어 생성
function create_player () {
    player = game.add.sprite(0, 0, "spr_unit1");
    player.anchor.setTo(0.5,0.5);
    //game.physics.p2.enableBody(player, true);
}

//  외부 플레이어 생성
function onNewPlayer(data) {
    console.log(data);
    var new_player = new Player(data.id, data.x, data.y, data.sprite, data.speed);
    oPlayerList.push(new_player);
}

function find_playerID(id) {
    for (var i = 0; i < oPlayerList.length; i++) {
        if (oPlayerList[i].id == id) {
            return oPlayerList[i]; 
        }
    }
}

var Game = {
    init: function() {
        socket = io();
        socket.connect('todak.me:80');

        game.stage.disableVisibilityChange = true;
        game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        game.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT, false, false, false, false);
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setBoundsToWorld(false, false, false, false, false)
        game.physics.p2.gravity.y = 0;
        game.physics.p2.applyGravity = false; 
        game.physics.p2.enableBody(game.physics.p2.walls, false);
    },

    create: function() {
        this.background = this.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'bg_game');
        this.cursors = game.input.keyboard.createCursorKeys();
        console.log("Client started");
        socket.on("connect", onConnected);
        socket.on("new_oPlayer", onNewPlayer);
        socket.on("remove_player", onRemovePlayer);
    },

    update: function() {
        if (isConnected) {
            //Mov
        }
    },

    render: function() {
    }
}