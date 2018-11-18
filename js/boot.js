// 환경 변수
const CANVAS_WIDTH = window.innerWidth * window.devicePixelRatio;
const CANVAS_HEIGHT = window.innerHeight * window.devicePixelRatio;
const WORLD_WIDTH = 1280;
const WORLD_HEIGHT = 720;

//  UTIL
function irandom_range(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

//  게임 환경
var boot = {
    preload: function() {
        game.load.image('bg_loading', "assets/background/bg_loading.png");
    },

    create: function() {
        game.state.start('preload');
    }
}


