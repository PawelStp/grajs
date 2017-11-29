var game = new Phaser.Game(window.innerWidth / 2, window.innerHeight, Phaser.AUTO, '',
    {
        preload: preload,
        create: create,
        update: update
    });

var rotation = 0;

function preload() {
    game.load.baseURL = 'http://examples.phaser.io/assets/';
    game.load.crossOrigin = 'anonymous';
    game.load.image('ship', 'games/asteroids/ship.png');
    game.load.image('asteroid1', 'games/asteroids/asteroid1.png');
    game.load.image('asteroid2', 'games/asteroids/asteroid2.png');
    game.load.image('asteroid3', 'games/asteroids/asteroid3.png');
    game.load.image('bullets', 'games/asteroids/bullets.png');
}

var ship;
var cursors;
var asteroids;
var asteroids2;
var asteroids3;
var bullets;
var fire = false;

function create() {


    ship = game.add.sprite(game.width / 2, game.height, 'ship');
    ship.anchor.set(0.5, 0.5);

    game.physics.arcade.enable(ship);
    ship.angle = 270;
    ship.body.collideWorldBounds = true;
    cursors = game.input.keyboard.createCursorKeys();

    asteroids = game.add.physicsGroup();
    asteroids.createMultiple(1000, 'asteroid1');
    asteroids.setAll('anchor.y', 0.5);
    asteroids.setAll('outOfBoundsKill', true);
    asteroids.setAll('checkWorldBounds', true);
    asteroids.setAll('angle', rotation);

    asteroids2 = game.add.physicsGroup();
    asteroids2.createMultiple(1000, 'asteroid2');
    asteroids2.setAll('anchor.y', 0.5);
    asteroids2.setAll('outOfBoundsKill', true);
    asteroids2.setAll('checkWorldBounds', true);
    asteroids2.setAll('body.velocity.y', 100);

    asteroids3 = game.add.physicsGroup();
    asteroids3.createMultiple(1000, 'asteroid3');
    asteroids3.setAll('anchor.y', 0.5);
    asteroids3.setAll('outOfBoundsKill', true);
    asteroids3.setAll('checkWorldBounds', true);
    asteroids3.setAll('body.velocity.y', 100);

    bullets = game.add.physicsGroup();
    bullets.createMultiple(1000, 'bullets');
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
}
var x = 0, y = 5;
var nextBulletTime = 0;
var nextAsteroidTime = 0;
function update() {
    ship.body.velocity.x = 0;
    rotation += 1;

    if (cursors.left.isDown) {
        ship.body.velocity.x = -250;
    }
    else if (cursors.right.isDown) {
        ship.body.velocity.x = 250;
    }
    if ((game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)).isDown) {
        fire = true;
    }
    else {
        fire = false;
    }
    if (game.time.now > nextAsteroidTime) {
        var rand = Math.floor(Math.random() * game.width - 10);
        var asteroid = asteroids.getFirstExists(false);
        asteroid.reset(rand, 0);
        asteroid.body.velocity.y = 10;

        nextAsteroidTime = game.time.now + 2000;
    }
    if (fire && game.time.now > nextBulletTime) {
        var bullet = bullets.getFirstExists(false);
        bullet.reset(ship.x - 3, ship.y - ship.body.height / 2);
        bullet.body.velocity.y -= 100;
        nextBulletTime = game.time.now + 300;

    }

    game.physics.arcade.collide(bullets, asteroids, bulletHitsAsteroid);

}


function bulletHitsAsteroid(bullet, asteroid) {
    asteroid.kill();
    bullet.kill();
}