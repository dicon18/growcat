const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const WORLD_WIDTH = 1920;
const WORLD_HEIGHT = 720;

var boot = {
    preload: function() {
        this.game.load.image('bg_loading', "assets/background/bg_loading.png");
    },

    create: function() {
        this.game.state.start('preload');
    }
}