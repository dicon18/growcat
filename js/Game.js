var socket;     
var isConnected = false;
var oPlayerList = [];

//  접속 완료
function onConnected() {
    console.log("Connected to server");
    isConnected = true;
    let startX = irandom_range(0, WORLD_WIDTH);
    let startY = irandom_range(0, WORLD_HEIGHT);
    let sprite = "spr_unit1";
    let speed = 150;
    create_player(startX, startY, sprite, speed);
    socket.emit("new_player", {x: startX, y: startY, sprite: sprite, speed: speed});
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

//  자기 자신 플레이어 생성
function create_player (x, y, sprite, speed) {
    player = game.add.sprite(x, y, sprite, speed);
    player.anchor.setTo(0.5,0.5);
    game.physics.p2.enableBody(player, true);
    //player.body.fixedRotation = true;
    player.speed = speed;
}

//  외부 플레이어 클래스
var Player = function(id, startX, startY, sprite, speed) {
    this.id = id;
    this.x = startX;
    this.y = startY;
    this.sprite = sprite;
    this.speed = speed;
    this.player = game.add.sprite(this.x, this.y, this.sprite)

    this.player.anchor.setTo(0.5,0.5);
    game.physics.p2.enableBody(this.player, true);
    //this.player.body.fixedRotation = true;
}

//  외부 플레이어 생성
function onNewPlayer(data) {
    console.log(data);
    var new_player = new Player(data.id, data.x, data.y, data.sprite, data.speed);
    oPlayerList.push(new_player);
}

//  자기 자신 플레이어 위치 받기
function onInputRecieved(data) {
    //player.body.setZeroVelocity();
    player.body.x = data.hspd;
    player.body.y = data.vspd;
}

//  외부 플레이어 플레이어 이동
function onMovePlayer(data) {
    var movePlayer = find_playerID(data.id); 
	if (!movePlayer) {
		return;
    }
    //movePlayer.player.body.setZeroVelocity();
	movePlayer.player.body.x = data.hspd;
    movePlayer.player.body.y = data.vspd;
}

//  플레이어 ID 찾기
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
        game.physics.p2.setImpactEvents(true);
    },

    create: function() {
        this.background = this.add.tileSprite(0, 0, WORLD_WIDTH, WORLD_HEIGHT, 'bg_game');
        this.cursors = game.input.keyboard.createCursorKeys();
        console.log("Client started");
        socket.on("connect", onConnected);
        socket.on("remove_player", onRemovePlayer);
        socket.on("new_oPlayer", onNewPlayer);
        socket.on("input_recieved", onInputRecieved);
        socket.on("move_oPlayer", onMovePlayer);
    },

    update: function() {
        if (isConnected) {
            //  움직이기
            socket.emit("input_fired", {
                hspd: (this.cursors.right.isDown - this.cursors.left.isDown) * player.speed,
                vspd: (this.cursors.down.isDown - this.cursors.up.isDown) * player.speed
            });
        }
    },

    render: function() {
    }
}