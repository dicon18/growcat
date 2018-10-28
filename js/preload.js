/// 게임 리소스 불러오기
var preload = {
    preload: function() {
        var loading = this.add.sprite(0, 0, "bg_loading");
        this.load.setPreloadSprite(loading);
        
        game.load.image('bg_title', 'assets/background/bg_title.png');
        game.load.image('bg_game', 'assets/background/bg_game.png');

        game.load.image('bt_play', 'assets/sprites/bt_play.png');
        game.load.image('bt_unit1', 'assets/sprites/bt_unit1.png');

        game.load.image('spr_unit1', 'assets/sprites/spr_unit1.png');
        //game.load.image('spr_circle','assets/sprites/spr_circle.png');
    },

    create: function() {
        game.state.start('title');
    }
}