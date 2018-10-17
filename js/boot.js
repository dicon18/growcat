///======================================================================
//  환경 설정
/// 환경 변수
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const WORLD_WIDTH = 1920;
const WORLD_HEIGHT = 720;

/// Util
function irandom_range(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

var boot = {
    preload: function() {
        game.load.image('bg_loading', "assets/background/bg_loading.png");
    },

    create: function() {
        game.state.start('preload');
    }
}


