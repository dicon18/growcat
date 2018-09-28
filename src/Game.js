var game = new Phaser.Game(800, 600, Phaser.AUTO)

var TEST = {
    preload: function() {
        game.load.image('pacman', 'assets/sprites/pacman.png');
        game.load.atlasJSONHash('bot', 'assets/sprites/running_bot.png', 'assets/sprites/running_bot.json');
    },
    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'pacman');
        var bot = game.add.sprite(200, 200, 'bot');
        
        //  중심점을 설정합니다(0.0~1.0)
        sprite.anchor.set(0.5);
        bot.anchor.set(0.5);

        //  'run'이라는 새로운 애니메이션을 추가합니다
        bot.animations.add('run');
        bot.animations.play('run', 15, true);

        //  물리효과를 설정합니다
        game.physics.arcade.enable(sprite);

        //  이 이미지에 대한 모든 종류의 입력 작업을 활성화 합니다
        // sprite.inputEnabled = true;
        
        // 빈 텍스트를 생성합니다 
        // text = game.add.text(250, 16, '', {fill: '#ffffff'});

        // sprite.events.onInputDown.add(listener, this);
    },
    update: function() {
        //  부들부들 움직임 방지
        if (game.physics.arcade.distanceToPointer(sprite, game.input.activePointer) > 8) {
            //  이동
            game.physics.arcade.moveToPointer(sprite, 300);
        }
        else {
            //  정지
            sprite.body.velocity.set(0);
        }
    },
    render: function() {
        //game.debug.inputInfo(32, 32);
    }
};

game.state.add('TEST', TEST);

game.state.start('TEST');