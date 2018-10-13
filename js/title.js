var title = function(game) {};

title.prototype = {
    create: function() {
        var bg_title = this.game.add.sprite(0, 0, 'bg_title');
        var bt_play = this.game.add.button(CANVAS_WIDTH / 2, 500, 'bt_play', this.start, this);
        bt_play.anchor.setTo(0.5, 0.5);
    },

    start: function() {
        this.game.state.start('Game');
    }
}