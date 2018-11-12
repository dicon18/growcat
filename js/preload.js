//  게임 리소스 불러오기
var preload = {
    preload: function() {
        game.load.image('spr_box', 'assets/sprites/spr_box.png');
        
        //  Loading
        var loading = this.add.sprite(0, 0, "bg_loading");
        this.load.setPreloadSprite(loading);
        
        //  Image
        game.load.image('bg_title', 'assets/background/bg_title.png');
        game.load.image('bg_game', 'assets/background/bg_game.png');
        game.load.image('bt_play', 'assets/sprites/bt_play.png');
        game.load.image('bt_unit1', 'assets/sprites/bt_unit1.png');
        game.load.image('spr_unit1', 'assets/sprites/spr_unit1.png');

        //  Sound
        // game.load.audio('BGM', 'assets/sound/bgm.mp3');        
    },

    create: function() {
        game.state.start('title');
    }
}