var game = new Phaser.Game(480, 320, Phaser.CANVAS, "canvas", { preload: preload, create: create, update: update });
var air = new AirConsole({ orientation: AirConsole.ORIENTATION_LANDSCAPE });

console.dir(air);

var color = "black";
var escapist = true;
var turnsLeft = 15;

air.onMessage = function (from, data) {
    if (from == AirConsole.SCREEN) {
        switch (data.id) {
            case "SHOW_MENU": gameReady(); break;
            case "RELOAD": window.location.reload(); break;
            case "SHOW_INTRO": showIntro(); break;
            case "SET_COLOR": color = data.color; break;
            case "SET_ROLE": escapist = (data.role == "ESCAPIST"); break;
            case "SET_TURNS": turnsLeft = data.turns; break;
            case "SELECT_OPTION": selectOption(); break;
            case "END_SELECT_OPTION": selectDestroy(); break;
        }
    }
};
air.onReady = function (code) {
    console.log("Controller ready");
};

function preload() {
    game.load.image("look", "/data/look.png");
    game.load.image("move", "/data/move.png");
    game.load.image("push", "/data/green.png");
    game.load.image("control", "/data/yellow.png");
    game.load.image("splash", "/data/splash.png");
    game.load.image("background", "/data/background.png");
}

var splash, splashText, look, move, push, control;

function create() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    splash = game.add.sprite(0, 0, "splash");
    splashText = game.add.text(66, 232, "Waiting for more players...", {
        font: "24pt Arial",
        fill: "#000"
    });
}

function selectOption() {
    look = game.add.sprite(96 + 32, 64, "look");
    look.width = 64;
    look.height = 64;
    look.inputEnabled = true;
    look.events.onInputDown.add(function () {
        air.message(AirConsole.SCREEN, { id: "LOOK", text: "Hey, look!" });
    });

    move = game.add.sprite(96 + 32 + 64 + 96, 64, "move");
    move.width = 64;
    move.height = 64;
    move.inputEnabled = true;
    move.events.onInputDown.add(function () {

    });

    push = game.add.sprite(96 + 32, 64 + 64 + 64, "push");
    push.width = 64;
    push.height = 64;
    push.inputEnabled = true;
    push.events.onInputDown.add(function () {

    });

    control = game.add.sprite(96 + 32 + 64 + 96, 64 + 64 + 64, "control");
    control.width = 64;
    control.height = 64;
    control.inputEnabled = true;
    control.events.onInputDown.add(function () {

    });
}

function selectDestroy() {
    look.destroy();
    move.destroy();
    push.destroy();
    control.destroy();
}

function gameReady() {
    splash.destroy();
    splashText.destroy();

    game.add.sprite(0, 0, "background");

    game.add.text(32 + 16, 32, (escapist) ? "You're an escapist" : "You're an spy", {
        font: "16pt Arial",
        fill: "#fff"
    });

    game.add.text(96 + 32 + 64 + 64, 32, color.toUpperCase() + " character", {
        font: "16pt Arial",
        fill: color
    });

    var turnLeft = game.add.text(64, 320 - 32, turnsLeft + " turns left", {
        font: "16pt Arial",
        fill: "#fff"
    });

}

function showIntro() {
    // ESCRIBIR Y MOSTRAR LORE Y TUTORIAL
}

function update() {

}