var app = {
    inicio: function () {
        alto = document.documentElement.clientHeight;
        ancho = document.documentElement.clientWidth;
        app.iniciaJuego();
    },
    iniciaJuego: function () {
        var estados = {preload: preload, create: create, update: update};
        game = new Phaser.Game(ancho, alto, Phaser.AUTO, 'phaser', estados);
        var puntaje = 0, puntajeTexto, vidas;
        var visor = "";
        var jugador;
        var tiempo1 = 0;
        var tiempo2 = 0;
        var jugando = false;

        function preload() {
            game.load.image("titular", "assets/titulo.png");
            game.load.image("titPto", "assets/puntaje.png");
            game.load.image("titVidas", "assets/vidas.png");
            game.load.image("UFO1", "assets/nave3.png");
            game.load.image("cannon", "assets/cannon.png");
            game.load.image("imgBackgr", "assets/background2.png");
            game.load.image("misil", "assets/bala.png");
            game.load.spritesheet("botonesLR", "assets/lr.png", 60, 60, 2, 0, 2);
            game.load.image("bttnFire", "assets/fire.png");
            game.load.spritesheet("explosion5", "assets/explosion_5.png", 94, 94, 46, 0, 0);
            game.load.spritesheet("explosion1", "assets/explosion_1.png", 88, 93, 46, 0, 0);
        }

        function create() {
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.add.image(0, 0, "imgBackgr");
            inicioFrase = game.add.image(90, 200, "titular");

            //misiles de nuestra Nave
            municion = game.add.group();
            municion.enableBody = true;

            //Txt
            txtMsg = game.add.text(game.world.centerX, game.world.centerY, '  ', {font: '12px Arial', fill: '#99f'});
            txtMsg.anchor.setTo(0.5, 0.5);
            txtMsg.visible = false;

            // UFOs
            UFOs = game.add.group();
            UFOs.enableBody = true;

            // marcador
            var marcador = game.add.graphics(10, 10);
            marcador.beginFill(0xFF3300);
            marcador.drawRect(0, 0, ancho - 20, 50);
            marcador.endFill;

            // Zona Sensible
            var control = game.add.graphics(0, alto - 100);
            control.beginFill(0xee5533);
            control.drawRect(0, 0, ancho, 100);
            control.endFill;

            // BotonL
            var btnL = game.add.sprite(10, alto - 90, "botonesLR", 0);
            btnL.inputEnabled = true;
            btnL.events.onInputDown.add(izquierda, this);
            btnL.events.onInputUp.add(parada, this);

            // BotonR
            var btnR = game.add.sprite(ancho - 70, alto - 90, "botonesLR", 1);
            btnR.inputEnabled = true;
            btnR.events.onInputDown.add(derecha, this);
            btnR.events.onInputUp.add(parada, this);

            // BotonFire
            var btnFire = game.add.sprite(ancho / 2 - 60, alto - 90, "bttnFire");
            btnFire.inputEnabled = true;
            btnFire.events.onInputDown.add(disparo, this)

            //presionar para comenzar
            var una = game.input.onDown.add(comienza, this);
            una._isOnce = true;

        }
        ;

        function disparo() {
            var activas = municion.countLiving();
            // Sólo se permiten 5 misiles funcionando a la vez
            if (activas < 5) {
                var misil = municion.create(jugador.x, alto - 180, "misil");
                misil.body.gravity.y = -300;
            }
        }
        ;

        function desactivar(balaPerdida) {
            balaPerdida.kill();
        }
        ;

        function derecha() {
            jugador.body.velocity.x = +150;
        }
        ;

        function izquierda() {
            jugador.body.velocity.x = -150;
        }
        ;

        function parada() {
            jugador.body.velocity.x = 0;
        }
        ;

        function update() {
            if (jugando == true) {
                // comprobar colisiones durante el juego
                game.physics.arcade.overlap(municion, UFOs, mataUFO, null, this);
                game.physics.arcade.overlap(UFOs, jugador, unaVidaMenos, null, this);
                tiempo1 += 1;
                if (jugador.x < 10) {
                    jugador.body.velocity.x = 0;
                    jugador.x = 10;
                }
                if (jugador.x > (ancho - 15)) {
                    jugador.body.velocity.x = 0;
                    jugador.x = ancho - 15;
                }
            }
            if (tiempo1 > 100) {
                // Un nuevo bicho
                creadorDeAliens();
                tiempo1 = 0;
                tiempo2 += 1;
            }

            // desactivar misiles perdidos
            municion.forEach(function (a) {
                if (a.y < 0) {
                    desactivar(a);
                }

            }, this);
            
            // cambiar sentido balanceo de las naves enemigas
            UFOs.forEach(function (a) {
                if (a.x > (ancho - 15)) {
                    sentido = a.body.velocity.x;
                    a.body.velocity.x = sentido * (-1);
                    a.x = ancho - 20;
                }
                if (a.x < 10) {
                    sentido = a.body.velocity.x;
                    a.body.velocity.x = sentido * (-1);
                    a.x = 15;
                }
                if (a.y > alto) {
                    a.y = alto - 20;
                    puntaje -= 20;
                    puntajeTexto.text = puntaje;
                    //creadorDeAliens();
                    a.kill();
                }
            }, this);
        }
        ;

        function comienza() {
            creadorDeAliens();
            crearTexto();
            inicioFrase.kill();
            crearJugador();
            jugando = true;
        }
        ;

        function crearJugador() {
            jugador = game.add.sprite(70, alto - 150, "cannon");
            game.physics.arcade.enable(jugador);
        }
        ;
        function creadorDeAliens() {
            var UFO = UFOs.create(app.numeroAleatorioHasta(ancho), 60, "UFO1");
            UFO.body.gravity.y = 10 + (tiempo2 * 2);
            UFO.body.bounce.y = 0.7 + Math.random() * 0.2;
            UFO.body.velocity.x = 100 + (tiempo2 * 2);
        }
        ;

        function crearTexto() {
            //Nuestro puntaje
            puntajeTexto = game.add.text(90, 25, puntaje, {font: '12px Arial', fill: '#fea'});
            game.add.image(10, 10, "titPto")
            // Nuestra valiosa vida
            vidas = game.add.group();
            game.add.image(ancho / 2, 10, "titVidas")
            for (var i = 0; i < 3; i++)
            {
                var local = vidas.create(ancho - 100 + (30 * i), 35, 'cannon');
                local.anchor.setTo(0.5, 0.5);
                local.angle = 45;
                local.alpha = 0.4;
            }
        }
        ;

        function mataUFO(bala, enemigo) {
            PosX = enemigo.x;
            PosY = enemigo.y;
            bala.kill();
            enemigo.kill();
            puntaje += 20;
            puntajeTexto.text = puntaje;
            // efecto explosion            
            var explota = game.add.sprite(PosX - 30, PosY - 50, "explosion5", 0);
            var explota2 = explota.animations.add('explota2');
            explota.animations.play('explota2', 10, false);
            explota.animations.killOnComplete = true;
            // cargamos otra nave
            // creadorDeAliens();
            /*
             if (UFOs.countLiving() == 0)
             {
             //con semejante logro ps mayor la bonificacion
             puntaje += 1000;
             puntajeTexto.text = ":" + puntaje;
             municionEnemigo.forEach(function (a) {
             a.kill();
             }, this);
             //nuestra frase de victoria
             txtMsg.text = "  Has salvado el planeta \n Presiona click para repetir";
             //lo hacemos visible para que todos lo puedan ver
             txtMsg.visible = true;
             //claro tienes derecho a repetir
             game.input.onTap.addOnce(repetir, this);
             }
             */
        }
        ;

        function unaVidaMenos(pj, enemigo) {
            enemigo.kill();
            vida = vidas.getFirstAlive();
            if (vida)
            {
                vida.kill();
            }
            // efecto explosion
            PosX = pj.x;
            PosY = pj.y;
            var explota = game.add.sprite(PosX - 30, PosY - 50, "explosion1", 0);
            var explota2 = explota.animations.add('explota2');
            explota.animations.play('explota2', 10, false);
            explota.animations.killOnComplete = true;
            pj.kill();
            //Hemos fracasado en nuestra mision
            if (vidas.countLiving() < 1)
            {
                txtMsg.text = "    Nuestro hogar ha sido destruido \n       Presiona click para empezar";
                txtMsg.visible = true;
                jugando = false;
                tiempo1 = 0;
                tiempo2 = 0;
                UFOs.forEach(function (a) {
                    a.kill();
                }, this);
                //tienes otra oportunidad
                game.input.onTap.addOnce(repetir, this);
            } else {
                // continuamos partida
                crearJugador();

            }
        }
        ;

        function repetir() {
            document.location.reload(true);
        }
        ;

    },
    numeroAleatorioHasta: function (limite) {
        return Math.floor(Math.random() * limite);
    },
}

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function () {
        app.inicio();
    }, false);
}