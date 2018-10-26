// 환경 변수
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const WORLD_WIDTH = 2000;
const WORLD_HEIGHT = 2000;

//  Util
function irandom_range(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

/// 게임 환경 설정
var boot = {
    preload: function() {
        game.load.image('bg_loading', "assets/background/bg_loading.png");
    },

    create: function() {
        game.state.start('preload');
    }
}


