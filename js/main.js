var game = new Phaser.Game(768, 544, Phaser.AUTO)
game.state.add('Game', Game);
game.state.start('Game');