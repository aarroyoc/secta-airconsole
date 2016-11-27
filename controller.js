var game = new Phaser.Game(480, 320, Phaser.CANVAS, "canvas", { preload: preload, create: create, update: update });

function preload() {
    game.load.image("look", "/data/red.png");
    game.load.image("move", "/data/blue.png");
    game.load.image("push", "/data/green.png");
    game.load.image("control", "/data/yellow.png");
}

function create() {
    var look = game.add.sprite(96 + 32, 64, "look");
    look.width = 64;
    look.height = 64;
    look.inputEnabled = true;
    look.events.onInputDown.add(function () {

    });

    var move = game.add.sprite(96 + 32 + 64 + 96, 64, "move");
    move.width = 64;
    move.height = 64;
    move.inputEnabled = true;
    move.events.onInputDown.add(function () {

    });

    var push = game.add.sprite(96 + 32, 64 + 64 + 64, "push");
    push.width = 64;
    push.height = 64;
    push.inputEnabled = true;
    push.events.onInputDown.add(function () {

    });

    var control = game.add.sprite(96 + 32 + 64 + 96, 64 + 64 + 64, "control");
    control.width = 64;
    control.height = 64;
    control.inputEnabled = true;
    control.events.onInputDown.add(function () {

    });
}

function update() {

}

