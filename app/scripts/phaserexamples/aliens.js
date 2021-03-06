 var game = new Phaser.Game(640, 480, Phaser.AUTO, 'game');

    var PhaserGame = function () {

        this.bmd = null;

        this.alien = null;

        this.mode = 0;

        this.points = {
            'x': [ 32, 128, 256, 384, 512, 608 ],
            'y': [ 240, 240, 240, 240, 240, 240 ]
        };

        this.pi = 0;
        this.path = [];

    };

    PhaserGame.prototype = {

        init: function () {

            this.game.renderer.renderSession.roundPixels = true;
            this.stage.backgroundColor = '#204090';

        },

        preload: function () {
            
            this.load.image('alien', 'images/ufo.png');
            this.load.bitmapFont('shmupfont', 'images/phaserexamples/shmupfont.png', 'images/phaserexamples/shmupfont.xml');


        },

        create: function () {

            this.bmd = this.add.bitmapData(this.game.width, this.game.height);
            this.bmd.addToWorld();

            this.alien = this.add.sprite(0, 0, 'alien');
            this.alien.anchor.set(0.5);

            var py = this.points.y;

            for (var i = 0; i < py.length; i++)
            {
                py[i] = this.rnd.between(32, 432);
            }

            this.hint = this.add.bitmapText(8, 444, 'shmupfont', "Linear", 24);

            this.input.onDown.add(this.changeMode, this);

            this.plot();

        },

        changeMode: function () {

            this.mode++;

            if (this.mode === 3)
            {
                this.mode = 0;
            }

            if (this.mode === 0)
            {
                this.hint.text = "Linear";
            }
            else if (this.mode === 1)
            {
                this.hint.text = "Bezier";
            }
            else if (this.mode === 2)
            {
                this.hint.text = "Catmull Rom";
            }

            this.plot();

        },

        plot: function () {

            this.bmd.clear();

            this.path = [];

            var x = 1 / game.width;

            for (var i = 0; i <= 1; i += x)
            {
                if (this.mode === 0)
                {
                    var px = this.math.linearInterpolation(this.points.x, i);
                    var py = this.math.linearInterpolation(this.points.y, i);
                }
                else if (this.mode === 1)
                {
                    var px = this.math.bezierInterpolation(this.points.x, i);
                    var py = this.math.bezierInterpolation(this.points.y, i);
                }
                else if (this.mode === 2)
                {
                    var px = this.math.catmullRomInterpolation(this.points.x, i);
                    var py = this.math.catmullRomInterpolation(this.points.y, i);
                }

                this.path.push( { x: px, y: py });

                this.bmd.rect(px, py, 1, 1, 'rgba(255, 255, 255, 1)');
            }

            for (var p = 0; p < this.points.x.length; p++)
            {
                this.bmd.rect(this.points.x[p]-3, this.points.y[p]-3, 6, 6, 'rgba(255, 0, 0, 1)');
            }

        },

        update: function () {

            this.alien.x = this.path[this.pi].x;
            this.alien.y = this.path[this.pi].y;

            this.pi++;

            if (this.pi >= this.path.length)
            {
                this.pi = 0;
            }

        }

    };

    game.state.add('Game', PhaserGame, true);