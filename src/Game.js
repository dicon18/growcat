var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

var text;
var counter = 0;

function preload() {
    //  이미지를 미리 불러옵니다
    //  첫 번째 인자는 코드에서 이미지를 식별 할 문자입니다
    //  두 번째 인자는 이미지 경로입니다
    game.load.image('spr_chr', 'asset/sprites/spr_chr.png');
    game.load.atlasJSONHash('bot', 'asset/sprites/running_bot.png', 'asset/sprites/running_bot.json');
}

var sprite;

function create() {
    //  게임 물리엔진을 설정합니다
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  불러온 이미지를 생성하고 출력합니다
    sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'spr_chr');
    var bot = game.add.sprite(200, 200, 'bot');
    
    //  중심점을 설정합니다(0.0~1.0)
    sprite.anchor.set(0.5);
    bot.anchor.set(0.5);

    //  'run'이라는 새로운 애니메이션을 추가합니다
    //  텍스처 아틀라스를 알아서 처리해줍니다
    bot.animations.add('run');

    bot.animations.play('run', 15, true);

    //  물리효과를 설정합니다
    game.physics.arcade.enable(sprite);

    //  이 이미지에 대한 모든 종류의 입력 작업을 활성화 합니다
    // sprite.inputEnabled = true;
    
    // 빈 텍스트를 생성합니다 
    // text = game.add.text(250, 16, '', {fill: '#ffffff'});

    // sprite.events.onInputDown.add(listener, this);
}

function update() {
    //  부들부들 움직임 방지
    if (game.physics.arcade.distanceToPointer(sprite, game.input.activePointer) > 8) {
        //  이동
        game.physics.arcade.moveToPointer(sprite, 300);
    }
    else {
        //  정지
        //sprite.body.velocity.set(0);
    }
}

function render() {
    //game.debug.inputInfo(32, 32);
}
// function listener() {
//     counter++;
//     text.text = "You clicked " + counter + " times!";
// }