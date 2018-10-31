const Phaser = require('phaser');
const axios = require('axios');

const hsTable: HTMLTableElement = <HTMLTableElement>document.getElementById("hsTable");

const width = 224;
const height = 256;
const scaling = 2;

var speedScaling = 1.0;

var border;
var paddle;
var cursors;
var ball;
var bricks;

var score = 0;
var scoreText;

var lives = 3;
var livesText;


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
    this.load.image('background', 'http://ctrpetersen.azurewebsites.net/arkanoid/assets/background.png');
    this.load.image('ball', 'http://ctrpetersen.azurewebsites.net/arkanoid/assets/ball.png');
    this.load.image('paddle', 'http://ctrpetersen.azurewebsites.net/arkanoid/assets/paddle.png');
    this.load.image('borderTop', 'http://ctrpetersen.azurewebsites.net/arkanoid/assets/borderTop.png');
    this.load.image('borderSide', 'http://ctrpetersen.azurewebsites.net/arkanoid/assets/borderSide.png');
    this.load.image('brick', 'http://ctrpetersen.azurewebsites.net/arkanoid/assets/brick.png');
}

function create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0);

    border = this.physics.add.staticGroup();
    border.create(0, 33, 'borderTop').setOrigin(0, 0).refreshBody();
    border.create(0, 47, 'borderSide').setOrigin(0, 0).refreshBody();
    border.create(432, 47, 'borderSide').setOrigin(0, 0).refreshBody();

    var graphics = this.add.graphics(0,0)
    graphics.fillStyle(0x000000, 1.0);
    graphics.fillRect(0, 0, width*scaling, 32);

    this.add.text(this.cameras.main.centerX-36, -5, 'HIGH SCORE', { fontSize: '22px', fill: '#FF0000', fontFamily: 'VT323' });
    scoreText = this.add.text(this.cameras.main.centerX, 12, score, { fontSize: '22px', fill: '#FFFFFF', fontFamily: 'VT323' });

    this.add.text(60, -5, '1UP', { fontSize: '22px', fill: '#FF0000', fontFamily: 'VT323' });
    livesText = this.add.text(70, 12, lives, { fontSize: '22px', fill: '#FFFFFF', fontFamily: 'VT323' });
   

    bricks = this.physics.add.staticGroup();
    

    //    for (let i = 0; i < 5; i++) {
    //      for (let x = 0; x < 11; x++) {

    for (let i = 0; i < 5; i++) {
        for (let x = 0; x < 11; x++) {
            var hex = randomHex();
            var graphics = this.add.graphics(0,0);
            graphics.fillStyle(0x000000, 1.0);
            graphics.fillRect(0, 0, 37, 18);
            graphics.fillStyle(hex, 1.0);
            graphics.fillRect(0, 0, 35, 16);
            graphics.generateTexture(hex.toString(), 37, 18);
            bricks.create((x*38)+16, (i*19)+100, hex.toString()).setOrigin(0, 0).refreshBody();
            graphics.destroy();
        }
    }

    paddle = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 220, 'paddle');
    paddle.body.immovable = true;

    ball = this.physics.add.sprite(this.cameras.main.centerX-3, this.cameras.main.centerY + 202, 'ball');
    ball.setBounce(1);

    this.physics.add.collider(ball, border);
    this.physics.add.collider(ball, bricks, killBlock, null, this);

    this.physics.add.overlap(paddle, ball, bounceBall, null, this);

    cursors = this.input.keyboard.createCursorKeys();
}

function update(){
    if (this.input.activePointer.isDown && this.input.activePointer.y < 170 && readyToShoot) {
        readyToShoot = false;
        ball.setVelocityY(-300*speedScaling)
    }
    
    if (cursors.left.isDown || (this.input.activePointer.isDown && this.input.activePointer.x < 230)) { paddle.setVelocityX(-200); }
    else if (cursors.right.isDown || this.input.activePointer.isDown) { paddle.setVelocityX(200); }
    else { paddle.setVelocityX(0); }

    if (paddle.x > 402) { paddle.x = 402; }
    else if (paddle.x <50) {paddle.x = 50; }

    if (readyToShoot) { ball.x = paddle.x-3 }

    if (cursors.up.isDown && readyToShoot){
        readyToShoot = false;
        ball.setVelocityY(-300*speedScaling)
        ball.setVelocityX(paddle.body.velocity.x*speedScaling);
    }

    if (ball.y > 530){
        readyToShoot = true;
        ball.x = paddle.x-3
        ball.y = paddle.y-20;
        ball.setVelocityX(0);
        ball.setVelocityY(0);

        lives--;
        livesText.setText(lives);
        if (lives == 0){
            this.scene.restart();
            lives = 3;
            score = 0;
            speedScaling = 1;
            
            //enter name and submit score
        }
    }

}

function bounceBall():void{
    var diff = (Math.abs(ball.x - paddle.x)) * 6;
    ball.setVelocityY(-300*speedScaling)
    if (ball.x > paddle.x) { ball.setVelocityX(diff*speedScaling) }
    else { ball.setVelocityX(-diff*speedScaling) }
}

function randomHex(){
    return '0x' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
}

function killBlock(ball, brick){
    brick.destroy();
    speedScaling += 0.001;
    score++;
    scoreText.setText(score);

    if (bricks.getLength() < 1){
        this.scene.restart();
        readyToShoot = true;
        lives++;
        score += 10;
        livesText.setText(lives);
        scoreText.setText(score);
    }
}

function submitScore(){

}

function fetchScores(){

}
