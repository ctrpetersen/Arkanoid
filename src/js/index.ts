const Phaser = require('phaser');

const width = 224;
const height = 256;
const scaling = 2;

var border;
var paddle;
var cursors;
var ball;

var readyToShoot = true;

var config = {
    type: Phaser.AUTO,
    width: width * scaling,
    height: height * scaling,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade'
    },
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'http://localhost:8080/assets/background.png');
    this.load.image('ball', 'http://localhost:8080/assets/ball.png');
    this.load.image('paddle', 'http://localhost:8080/assets/paddle.png');
    this.load.image('borderTop', 'http://localhost:8080/assets/borderTop.png');
    this.load.image('borderSide', 'http://localhost:8080/assets/borderSide.png');
}

function create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0);

    border = this.physics.add.staticGroup();
    border.create(0, 33, 'borderTop').setOrigin(0, 0).refreshBody();
    border.create(0, 47, 'borderSide').setOrigin(0, 0).refreshBody();
    border.create(432, 47, 'borderSide').setOrigin(0, 0).refreshBody();

    paddle = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 220, 'paddle');
    paddle.body.immovable = true;

    ball = this.physics.add.sprite(this.cameras.main.centerX-3, this.cameras.main.centerY + 202, 'ball');
    ball.setBounce(1);
    ball.setVelocityX(-300);
    ball.setVelocityY(-300);

    this.physics.add.collider(paddle, border);
    this.physics.add.collider(ball, border);
    this.physics.add.collider(ball, paddle);
    
    //this.physics.add.overlap(paddle, border, stopPaddle, null, this);

    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    if (cursors.left.isDown) { paddle.setVelocityX(-200); }
    else if (cursors.right.isDown) { paddle.setVelocityX(200); }
    else { paddle.setVelocityX(0); }
    
    if (paddle.x > 402) { paddle.x = 402; }
    else if (paddle.x <50) {paddle.x = 50; }
}




