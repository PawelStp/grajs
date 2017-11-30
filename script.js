var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

var states = {
    game: "game",
    main: "main",
};

var gameProperties = {
    width: window.innerWidth,
    height: window.innerHeight
};

var shipProperties = {
    startX: gameProperties.width * 0.5,
    startY: gameProperties.height * 0.5,
    accleration: 300,
    drag: 100,
    maxVelocity: 300,
    angularVelocity: 200,
    lives: 3,
    deadTime: 3,
    isLive: true,
    isReady: true,
    blinkDelay: 0.2
};

var bulletProperties = {
    speed: 500,
    interval: 250,
    lifespan: 2000,
    maxCount: 50,
    destroyed: 0
};

var asteroidProperties = {
    startingAsteroid: 2,
    asteroid1: {
        minVelocity: 50,
        maxVelocity: 150,
        minAngularVelocity: 0,
        maxAngularVelocity: 200,
        score: 10,
        exists: 0
    },
    asteroid2: {
        minVelocity: 50,
        maxVelocity: 250,
        minAngularVelocity: 0,
        maxAngularVelocity: 200,
        score: 20,
        exists: 0
    },
    asteroid3: {
        minVelocity: 50,
        maxVelocity: 450,
        minAngularVelocity: 0,
        maxAngularVelocity: 300,
        score: 50,
        exists: 0
    }
}


var fontAssets = {
    counterFontStyle: { font: '40px Arial', fill: '#FFFFFF', align: 'center' },
};


var mainState = function (gae) {
    this.tf_start;
}
mainState.prototype = {

    create: function () {
        var startInstructions = 'Dowolny przycisk kliknij aby zaczac';

        this.tf_start = game.add.text(game.world.centerX, game.world.centerY, startInstructions, fontAssets.counterFontStyle);
        this.tf_start.align = 'center';
        this.tf_start.anchor.set(0.5, 0.5);

        game.input.onDown.addOnce(this.startGame, this);
    },

    startGame: function () {
        game.state.start(states.game);
    }
};

var gameState = function (game) {
    this.ship;

    this.keyLeft;
    this.keyUp;
    this.keyRight;
    this.keySpace;

    this.bullets;
    this.bulletInterval = 0;

    this.asteroids;
    this.asteroidsCount = asteroidProperties.startingAsteroid;

    this.shipLives = shipProperties.lives;
    this.tf_lives;

    this.score = 0;
    this.tf_score;

    this.explosion;
};
gameState.prototype = {

    preload: function () {
        game.load.baseURL = 'http://examples.phaser.io/assets/';
        game.load.crossOrigin = 'anonymous';
        game.load.image('ship', 'games/asteroids/ship.png');
        game.load.image('asteroid1', 'games/asteroids/asteroid1.png');
        game.load.image('asteroid2', 'games/asteroids/asteroid2.png');
        game.load.image('asteroid3', 'games/asteroids/asteroid3.png');
        game.load.image('bullets', 'games/asteroids/bullets.png');
        game.load.image('star', 'particlestorm/star.png');
        game.load.image('friend', 'sprites/thrust_ship2.png');
        game.load.image('life', 'particlestorm/heart.png');
        game.load.spritesheet('explosion', '/games/tanks/explosion.png', 64, 64, 23);

    },

    create: function () {
        this.initGraphics();
        this.initPhysics();
        this.initKeyboard();
        this.resetAsteroids('asteroid1');
        this.resetAsteroids('asteroid2');
        this.resetAsteroids('asteroid3');
    },


    update: function () {

        this.checkPlayerInput();
        this.checkBoundaries(this.ship);
        this.bullets.forEachExists(this.checkBoundaries, this);
        this.asteroids.forEachExists(this.checkBoundaries, this);


        game.physics.arcade.overlap(this.bullets, this.asteroids, this.bulletHitsAsteroid, null, this);
        if (shipProperties.isReady) {
            game.physics.arcade.overlap(this.ship, this.asteroids, this.shipHitsAsteroid, null, this);
        }
    },

    initGraphics: function () {
        this.ship = game.add.sprite(shipProperties.startX, shipProperties.startY, 'ship');
        this.ship.angle = 270;
        this.ship.anchor.set(0.5, 0.5);

        this.bullets = game.add.group();
        this.asteroids = game.add.group();

        this.tf_lives = game.add.text(20, 10, shipProperties.lives, fontAssets.counterFontStyle);

        this.tf_score = game.add.text(gameProperties.width - 100, 10, "0", fontAssets.counterFontStyle);
        this.tf_score.align = 'right';
        this.tf_score.anchor.set(1, 0);

    },

    initPhysics: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.physics.enable(this.ship, Phaser.Physics.ARCADE);

        this.ship.body.drag.set(shipProperties.drag);
        this.ship.body.maxVelocity.set(shipProperties.maxVelocity);

        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(bulletProperties.maxCount, 'bullets');
        this.bullets.setAll('anchor', { x: 0.5, y: 0.5 });
        this.bullets.setAll('lifespan', bulletProperties.lifespan);

        this.asteroids.enableBody = true;
        this.asteroids.physicsBodyType = Phaser.Physics.ARCADE;

        this.explosion = game.add.group();
        this.explosion.createMultiple(20, 'explosion', 0);
        this.explosion.setAll('anchor.x', 0.5);
        this.explosion.setAll('anchor.y', 0.5);
        this.explosion.callAll('animations.add', 'animations', 'explode', null, 30);
    },

    initKeyboard: function () {
        this.keyLeft = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        this.keyRight = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        this.keyUp = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.keySpace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    checkPlayerInput: function () {
        if (this.keyLeft.isDown) {
            this.ship.body.angularVelocity = -shipProperties.angularVelocity;
        } else if (this.keyRight.isDown) {
            this.ship.body.angularVelocity = shipProperties.angularVelocity;
        } else {
            this.ship.body.angularVelocity = 0;
        }

        if (this.keyUp.isDown) {
            game.physics.arcade.accelerationFromRotation(this.ship.rotation, shipProperties.acceleration, this.ship.body.acceleration);
        } else {
            this.ship.body.acceleration.set(0);
        }

        if (this.keySpace.isDown && shipProperties.isLive) {
            this.fire();
        }
    },

    checkBoundaries: function (sprite) {
        if (sprite.x < 0) {
            sprite.x = game.width;
        } else if (sprite.x > game.width) {
            sprite.x = 0;
        }

        if (sprite.y < 0) {
            sprite.y = game.height;
        } else if (sprite.y > game.height) {
            sprite.y = 0;
        }
    },

    fire: function () {
        if (game.time.now > this.bulletInterval) {
            var bullet = this.bullets.getFirstExists(false);

            if (bullet) {
                var length = this.ship.width * 0.5;
                var x = this.ship.x + (Math.cos(this.ship.rotation) * length);
                var y = this.ship.y + (Math.sin(this.ship.rotation) * length);

                bullet.reset(x, y);
                bullet.lifespan = bulletProperties.lifespan;
                bullet.rotation = this.ship.rotation;

                game.physics.arcade.velocityFromRotation(this.ship.rotation, bulletProperties.speed, bullet.body.velocity);
                this.bulletInterval = game.time.now + bulletProperties.interval;
            }
        }
    },

    createAsteroid: function (x, y, type, count) {
        if (count === undefined) {
            count = 1;
        }
        for (var i = 0; i < count; i++) {
            var asteroid = this.asteroids.create(x, y, type);
            asteroid.anchor.set(0.5, 0.5);
            asteroid.body.angularVelocity = game.rnd.integerInRange(asteroidProperties[type].minAngularVelocity, asteroidProperties[type].maxAngularVelocity);
            asteroidProperties[type].exists++;

            var randomAngle = game.math.degToRad(game.rnd.angle());
            var randomVelocity = game.rnd.integerInRange(asteroidProperties[type].minVelocity, asteroidProperties[type].maxVelocity);

            game.physics.arcade.velocityFromRotation(randomAngle, randomVelocity, asteroid.body.velocity);
        }
    },

    resetAsteroids: function (name) {
        if (asteroidProperties[name].exists <= bulletProperties.destroyed * 1.2) {
            for (var i = 0; i < this.asteroidsCount; i++) {
                var side = Math.round(Math.random());
                var x;
                var y;

                if (side) {
                    x = Math.round(Math.random()) * gameProperties.screenWidth;
                    y = Math.round() * gameProperties.screeHeight;
                } else {
                    x = Math.round() * gameProperties.screenWidth;
                    y = Math.round(Math.random()) * gameProperties.screeHeight;
                }
                this.createAsteroid(x, y, name);
            }
        }
    },

    bulletHitsAsteroid: function (bullet, asteroid) {
        bullet.kill();
        asteroid.kill();

        this.resetAsteroids(asteroid.key);
        this.updateScore(asteroidProperties[asteroid.key].score);
        bulletProperties.destroyed++;

        var exp = this.explosion.getFirstExists(false);
        exp.reset(asteroid.x, asteroid.y);
        exp.animations.play('explode', null, false, true);
    },

    shipHitsAsteroid: function (ship, asteroid) {
        ship.kill();
        asteroid.kill();

        shipProperties.isLive = false;
        this.shipLives--;
        this.tf_lives.text = this.shipLives;

        if (this.shipLives) {
            game.time.events.add(Phaser.Timer.SECOND * shipProperties.deadTime, this.resetShip, this);
        }else{
            game.time.events.add(Phaser.Timer.SECOND * shipProperties.deadTime, this.endGame, this);
            
        }
        var exp = this.explosion.getFirstExists(false);
        exp.reset(ship.x, ship.y);
        exp.animations.play('explode', null, false, true);
    },

    resetShip: function () {
        this.ship = game.add.sprite(shipProperties.startX, shipProperties.startY, 'ship');
        this.ship.angle = 270;
        this.ship.anchor.set(0.5, 0.5);

        game.physics.enable(this.ship, Phaser.Physics.ARCADE);
        shipProperties.isLive = true;
        shipProperties.isReady = false;

        game.time.events.add(Phaser.Timer.SECOND * 3, this.shipReady, this);
        game.time.events.repeat(Phaser.Timer.SECOND * shipProperties.blinkDelay, 3 / shipProperties.blinkDelay, this.shipBlink, this);
    },

    shipReady: function () {
        shipProperties.isReady = true;
        this.ship.visible = true;
    },

    shipBlink: function () {
        this.ship.visible = !this.ship.visible;
    },

    updateScore: function (score) {
        this.score += score;
        this.tf_score.text = this.score;
    },

    endGame: function () {
        game.state.start(states.main);
    }

}
game.state.add(states.game, gameState);
game.state.add(states.main, mainState);
game.state.start(states.main);