var app={
  inicio: function(){     
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;    
    topeAlto = 60;       
    
    app.iniciaBotones();
    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaBotones: function() {
        var botonLeft = document.querySelector('#claro');
        var botonRight = document.querySelector('#oscuro');
        var botonFire = document.querySelector('#oscuro');
    },

  iniciaJuego: function(){

    var estados = {preload: preload, create: create, update: update};
    game = new Phaser.Game(ancho, alto, Phaser.AUTO, 'phaser', estados);
    console.log(ancho + ' ' + alto + ' Entramos en preload::iniciaJuego'); 

    var UFOs;
    var cannon;
    var lives = 3;
    var livesText;
    var score = 0;
    var scoreText;
    
    function preload() {
      console.log('preload::iniciaJuego');     
      //game.load.image("imagen","assets/UFO.png"); // Cargar una imagen, con ID imagen, ubicada en img/imagen.png
      game.load.images(
        ["UFO1", "UFO2", "cannon", "background"],
        ["assets/nave1.png", "assets/nave1-b.png", "assets/cannon.png", "assets/background.png"]
      ); // Añade imágenes en lote
      //game.load.audio("disparo","sfx/disparo.ogg"); // Carga un audio en formato Ogg
      //game.load.audio("disparo",["sfx/disparo.ogg","sfx/disparo.wav"]); // Carga un audio y elije el formato que más convenga según el UFOgador
      //game.load.pack("nivel1","maps/nivel1.json"); // Carga los recursos especificados en el fichero PACK
      //game.load.tilemap("casa","maps/casa.json",Phaser.Tilemap.TILED_JSON); // Carga un mapa de Tiled en formato JSON 
      game.load.spritesheet("botonesLR","assets/lr.png", 60, 60, 2, 0, 2);
      game.load.spritesheet("explosion2","assets/explosion_2.png", 75, 109, 30, 0, 0);
      game.load.image("bttnFire","assets/fire.png");
    }  
    
    function create() {
      game.physics.startSystem(Phaser.Physics.ARCADE);
      // fondo
      game.add.sprite(0, 0, "background");                  
      // Cañon
      cannon = game.add.sprite(70, alto-150, "cannon");
      game.physics.arcade.enable(cannon);
      cannon.body.immovable = true;
      // UFOs
      UFOs = game.add.group();
      UFOs.enableBody = true;
      createUFO()
      // marcador
      var marcador  = game.add.graphics(10, 10);
      marcador.beginFill(0xFF3300);
      marcador.drawRect(0,0, ancho-20,50);
      marcador.endFill;      
      // Zona Sensible
      var control = game.add.graphics(0, alto-100);
      control.beginFill(0xee5533);
      control.drawRect(0,0, ancho, 100);
      control.endFill;
      // BotonL
      var btnL = game.add.sprite(10, alto-90, "botonesLR", 0);
      btnL.inputEnabled = true;
      // BotonR
      var btnR = game.add.sprite(ancho-70, alto-90, "botonesLR", 1);
      btnR.inputEnabled = true;
      // BotonFire
      var btnFire = game.add.sprite(ancho/2 - 60, alto-90, "bttnFire");
      btnFire.inputEnabled = true;
      // textos
      scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '12px', fill: '#000' });
      livesText = game.add.text(ancho-90, 16, 'lives: 3', { fontSize: '12px', fill: '#000' });
    }

    function update(){
      // game.physics.arcade.collide(UFOs, cannon);
      // verificar que se tocan
      game.physics.arcade.overlap(cannon, UFOs, explosion, null, this);
      // Cuando una nave llega al fondo soltar otra
      //console.log(UFOs.y);
      var posY = UFOs.hasProperty(0, "y");
      console.log(posY);
      if (UFOs.y > alto){
          UFO.kill();
          createUFO();
      }
    }
    
    function explosion (player, enemigo){
        console.log('Explosion ' + lives);
        enemigo.kill();        
        var PosX = player.x;
        var PosY = player.y;
        player.kill();
        var explota = game.add.sprite(PosX-30, PosY-50, "explosion2", 0);
        var explota2 = explota.animations.add('explota2');
        lives = lives - 1;
        livesText.text = 'lives: ' + lives;
        explota.animations.play('explota2', 10, false);
        explota.animations.killOnComplete = true;
        //setTimeout(app.siguiente, 1000);
        createUFO();
    }
    
    function createUFO(){
        var UFO = UFOs.create(app.numeroAleatorioHasta(ancho), 50, "UFO1");
        UFO.body.gravity.y = 300;
        UFO.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
      
  },
  
  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}