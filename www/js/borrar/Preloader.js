Ball.Preloader = function(game) {};
Ball.Preloader.prototype = {
	preload: function() {
		this.preloadBg = this.add.sprite((Ball._WIDTH-297)*0.5, (Ball._HEIGHT-145)*0.5, 'preloaderBg');
		this.preloadBar = this.add.sprite((Ball._WIDTH-158)*0.5, (Ball._HEIGHT-50)*0.5, 'preloaderBar');
		this.load.setPreloadSprite(this.preloadBar);

		this.load.image('ball', 'assets/borrar/ball.png');
		this.load.image('hole', 'assets/borrar/hole.png');
		this.load.image('element-w', 'assets/borrar/element-w.png');
		this.load.image('element-h', 'assets/borrar/element-h.png');
		this.load.image('panel', 'assets/borrar/panel.png');
		this.load.image('title', 'assets/borrar/title.png');
		this.load.image('button-pause', 'assets/borrar/button-pause.png');
		this.load.image('screen-bg', 'assets/borrar/screen-bg.png');
		this.load.image('screen-mainmenu', 'assets/borrar/screen-mainmenu.png');
		this.load.image('screen-howtoplay', 'assets/borrar/screen-howtoplay.png');
		this.load.image('border-horizontal', 'assets/borrar/border-horizontal.png');
		this.load.image('border-vertical', 'assets/borrar/border-vertical.png');

		this.load.spritesheet('button-audio', 'assets/borrar/button-audio.png', 35, 35);
		this.load.spritesheet('button-start', 'assets/borrar/button-start.png', 146, 51);

		this.load.audio('audio-bounce', ['audio/bounce.ogg', 'audio/bounce.mp3', 'audio/bounce.m4a']);
	},
	create: function() {
		this.game.state.start('MainMenu');
	}
};