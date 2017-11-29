var game = new Phaser.Game(window.innerWidth / 2, window.innerHeight, Phaser.AUTO, '', {
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
    game.load.image('star', 'particlestorm/star.png');
    game.load.image('friend', 'sprites/thrust_ship2.png');

}

var ship;
var cursors;
var asteroids;
var asteroids2;
var asteroids3;
var bullets;
var stars;
var friends;
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

    stars = game.add.physicsGroup();
    stars.createMultiple(1000, 'star');
    stars.setAll('anchor.y', 0.5);
    stars.setAll('outOfBoundsKill', true);
    stars.setAll('checkWorldBounds', true);

    friends = game.add.physicsGroup();
    friends.createMultiple(1000, 'friend');
    friends.setAll('anchor.y', 0.5);
    friends.setAll('outOfBoundsKill', true);
    friends.setAll('checkWorldBounds', true);
}
var x = 0,
    y = 5;
var nextBulletTime = 0;
var nextAsteroidTime = 0;
var nextStarTime = 15000;
var nextFriendTime = 9000;

function update() {
    ship.body.velocity.x = 0;
    rotation += 1;

    if (cursors.left.isDown) {
        ship.body.velocity.x = -250;
    } else if (cursors.right.isDown) {
        ship.body.velocity.x = 250;
    }
    if ((game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)).isDown) {
        fire = true;
    } else {
        fire = false;
    }
    if (game.time.now > nextAsteroidTime) {
        var randAsteroid = Math.floor(Math.random() * 4);
        var rand = Math.floor(Math.random() * game.width - 10);
        var asteroid;
        if (randAsteroid == 1) {
            asteroid = asteroids.getFirstExists(false);
        } else if (randAsteroid == 2) {
            asteroid = asteroids2.getFirstExists(false);
        } else {
            asteroid = asteroids3.getFirstExists(false);
        }
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
    if (game.time.now > nextStarTime) {
        var star;
        rand = Math.floor(Math.random() * game.width - 10);
        star = stars.getFirstExists(false);
        nextStarTime = game.time.now + 15000;
        star.reset(rand, 0);
        star.body.velocity.y = 10;
    }
    if (game.time.now > nextFriendTime) {
        var firend;
        rand = Math.floor(Math.random() * game.width - 10);
        friend = friends.getFirstExists(false);
        nextFriendTime = game.time.now + 8000;
        friend.reset(rand, 0);
        friend.body.velocity.y = 10;
        friend.angle = 180;
    }

    game.physics.arcade.collide(bullets, asteroids, bulletHitsAsteroid);
    game.physics.arcade.collide(bullets, asteroids2, bulletHitsAsteroid);
    game.physics.arcade.collide(bullets, asteroids3, bulletHitsAsteroid);
    game.physics.arcade.collide(bullets, stars, bulletHitsStar);
    game.physics.arcade.collide(bullets, friends, bulletHitsFriend);
}


function bulletHitsAsteroid(bullet, asteroid) {
    asteroid.kill();
    bullet.kill();
}

function bulletHitsStar(bullet, star) {
    star.kill();
    bullet.kill();
    //todo logic
}

function bulletHitsFriend(bullet, friend) {
    friend.kill();
    bullet.kill();
    //todo logic
}