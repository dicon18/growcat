var preload = {
    preload: function() {
        var loading = this.add.sprite(0, 0, "bg_loading");
        this.load.setPreloadSprite(loading);
        this.game.load.image('bg_title', 'assets/background/bg_title.png');
        this.game.load.image('bt_play', 'assets/sprites/bt_play.png');
        this.game.load.image('bg_game', 'assets/background/bg_game.png');
        this.game.load.image('pacman', 'assets/sprites/pacman.png');
        this.game.load.image('bt_unit1', 'assets/sprites/bt_unit1.png');
    },

    create: function() {
        this.game.state.start('title');
    }
}