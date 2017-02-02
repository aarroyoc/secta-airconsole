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
            case "SELECT_OPTION_1": selectOption(1); break;
            case "SELECT_OPTION_2": selectOption(2); break;
            case "END_SELECT_OPTION": selectDestroy(); break;
            case "SHOW_DIRECTION": showDirection(data.movements); break;
            case "DEBUG": console.log(data.text); break;
        }
    }
};
air.onReady = function (code) {
    console.log("Controller ready");
};

function preload() {
    game.load.image("look", "/data/look.png");
    game.load.image("move", "/data/move.png");
    game.load.image("push", "/data/push.png");
    game.load.image("control", "/data/control.png");
    game.load.image("up", "/data/up.png");
    game.load.image("down", "/data/down.png");
    game.load.image("left", "/data/left.png");
    game.load.image("right", "/data/right.png");
    game.load.image("splash", "/data/splash.png");
    game.load.image("background", "/data/background.png");
}

var splash, splashText, look, move, push, control, info;

function create() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    splash = game.add.sprite(0, 0, "splash");
    splashText = game.add.text(66, 232, "Waiting for more players...", {
        font: "24pt Arial",
        fill: "#000"
    });
}

function resetTint() {
    look.tint = 0xffffff;
    move.tint = 0xffffff;
    push.tint = 0xffffff;
    control.tint = 0xffffff;
}

function selectOption(i) {

    info = game.add.text(96, 64 + 64 + 16, "Select your " + ((i == 1) ? "first" : "second") + " action for the turn", {
        font: "16pt Arial",
        fill: "#fff"
    });

    look = game.add.sprite(96 + 32, 64, "look");
    look.width = 64;
    look.height = 64;
    look.inputEnabled = true;
    look.events.onInputDown.add(function () {
        air.message(AirConsole.SCREEN, { id: "SET_ACTION", type: "LOOK", index: i });
        resetTint();
        look.tint = 0x04a933;
    });

    move = game.add.sprite(96 + 32 + 64 + 96, 64, "move");
    move.width = 64;
    move.height = 64;
    move.inputEnabled = true;
    move.events.onInputDown.add(function () {
        air.message(AirConsole.SCREEN, { id: "SET_ACTION", type: "MOVE", index: i });
        resetTint();
        move.tint = 0x04a933;
    });

    push = game.add.sprite(96 + 32, 64 + 64 + 64, "push");
    push.width = 64;
    push.height = 64;
    push.inputEnabled = true;
    push.events.onInputDown.add(function () {
        air.message(AirConsole.SCREEN, { id: "SET_ACTION", type: "PUSH", index: i });
        resetTint();
        push.tint = 0x04a933;
    });

    control = game.add.sprite(96 + 32 + 64 + 96, 64 + 64 + 64, "control");
    control.width = 64;
    control.height = 64;
    control.inputEnabled = true;
    control.events.onInputDown.add(function () {
        air.message(AirConsole.SCREEN, { id: "SET_ACTION", type: "CONTROL", index: i });
        resetTint();
        control.tint = 0x04a933;
    });
}

function selectDestroy() {
    info.destroy();
    look.destroy();
    move.destroy();
    push.destroy();
    control.destroy();
}

function showDirection() {
    info = game.add.text(96, 64 + 64 + 16, "Select the direction of the action", {
        font: "16pt Arial",
        fill: "#fff"
    });

    look = game.add.sprite(96 + 32, 64, "up");
    look.width = 64;
    look.height = 64;
    look.inputEnabled = true;
    look.events.onInputDown.add(function () {
        air.message(AirConsole.SCREEN, { id: "SET_DIRECTION", dir: "UP" });
        resetTint();
        look.tint = 0x04a933;
    });

    move = game.add.sprite(96 + 32 + 64 + 96, 64, "down");
    move.width = 64;
    move.height = 64;
    move.inputEnabled = true;
    move.events.onInputDown.add(function () {
        air.message(AirConsole.SCREEN, { id: "SET_DIRECTION", dir: "DOWN" });
        resetTint();
        move.tint = 0x04a933;
    });

    push = game.add.sprite(96 + 32, 64 + 64 + 64, "left");
    push.width = 64;
    push.height = 64;
    push.inputEnabled = true;
    push.events.onInputDown.add(function () {
        air.message(AirConsole.SCREEN, { id: "SET_DIRECTION", dir: "LEFT" });
        resetTint();
        push.tint = 0x04a933;
    });

    control = game.add.sprite(96 + 32 + 64 + 96, 64 + 64 + 64, "right");
    control.width = 64;
    control.height = 64;
    control.inputEnabled = true;
    control.events.onInputDown.add(function () {
        air.message(AirConsole.SCREEN, { id: "SET_DIRECTION", dir: "RIGHT" });
        resetTint();
        control.tint = 0x04a933;
    });
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