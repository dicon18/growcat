const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const WORLD_WIDTH = 1920;
const WORLD_HEIGHT = 720;

var boot = function(game) {};

boot.prototype = {
    init: function() {
        this.game.stage.disableVisibilityChange = true;
    },

    preload: function() {
        this.game.load.image('bg_loading', "assets/background/bg_loading.png");
    },

    create: function() {
        // this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // this.scale.pageAlignHorizontally = true;
        // this.scale.setScreenSize();
        this.game.state.start('preload');
    }
}