/// <reference path="../node_modules/babylonjs/babylon.d.ts" />

declare function AirConsole(): void;
declare function FontFace(name: string, css: string): void;

import { Room } from "./room";
import { Table } from "./table";
import { Character, CharacterType, CharacterPosition, CharacterAction } from "./character";
import { shuffleInPlace, delay } from "./utils";

var players: Array<Character> = new Array;
var turnsLeft, air;

function createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
	var scene = new BABYLON.Scene(engine);
	var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, - 5), scene);
	camera.setTarget(BABYLON.Vector3.Zero());
	camera.attachControl(canvas, false);

	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
	var lightDown = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, -1, 0), scene);
	/*var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
	sphere.position.y = 1;*/

	//var ground = BABYLON.Mesh.CreateGround("tablero", 6, 6, 2, scene);
	return scene;
}


function main() {
	air = new AirConsole();
	var canvas = <HTMLCanvasElement>document.getElementById("canvas");
	var engine = new BABYLON.Engine(canvas, true);
	var scene = createScene(engine, canvas);
	scene.clearColor = new BABYLON.Color3(32 / 256, 94 / 256, 200 / 256);
	engine.runRenderLoop(() => {
		scene.render();
	});
	window.addEventListener("resize", () => {
		engine.resize();
	});

	var ui = new BABYLON.WorldSpaceCanvas2D(scene, new BABYLON.Size(8, 8), {
		id: "UI",
		worldPosition: new BABYLON.Vector3(0, 1, 0),
		enableInteraction: true,
		renderScaleFactor: 128,
		children: [
			new BABYLON.Text2D("Mastín de Jade", { fontName: "45pt ParkLaneNF", marginAlignment: "h: center, v: center" })
		]
	});
	var status = new BABYLON.Text2D("Waiting...", { parent: ui, id: "waiting2d", fontName: "30pt serif", marginAlignment: "h: center, v: top" });
	var camera: BABYLON.FreeCamera = <BABYLON.FreeCamera>scene.getCameraByID("camera1");

	var animationText = setInterval(() => {
		status.text += ".";
		if (status.text == "Waiting....")
			status.text = "Waiting";
	}, 1000);

	var animationTitle = new BABYLON.Animation("AnimTitle", "lockedTarget", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
	var keys = [{ frame: 0, value: BABYLON.Vector3.Zero() }, { frame: 100, value: new BABYLON.Vector3(0, 5, 0) }, { frame: 150, value: new BABYLON.Vector3(0, 5, 0) }, { frame: 250, value: BABYLON.Vector3.Zero() }, { frame: 300, value: BABYLON.Vector3.Zero() }];
	animationTitle.setKeys(keys);
	camera.animations.push(animationTitle);
	scene.beginAnimation(camera, 0, 300, true, 1);

	var table = new Table(scene);
	//table.printTablero();

	// Event Manager - AirConsole
	const MAX_PLAYERS = 4; // sustituir por 4 en la release
	turnsLeft = 15;
	air.onConnect = function (device) {
		var active_players = air.getActivePlayerDeviceIds();
		var connected_controllers = air.getControllerDeviceIds();
		console.log(`Active Players: ${active_players.length}`);
		console.log(`Connected controllers: ${connected_controllers.length}`);
		if (active_players.length == 0) {
			if (connected_controllers.length >= MAX_PLAYERS) {
				air.setActivePlayers(MAX_PLAYERS);
				// START GAME!!
				ui.dispose();
				scene.stopAnimation(camera);
				camera.setTarget(BABYLON.Vector3.Zero());
				camera.lockedTarget = BABYLON.Vector3.Zero();

				var colors = ["red", "green", "yellow", "blue"];
				colors = shuffleInPlace(colors);

				var positions = [CharacterPosition.TOP_LEFT, CharacterPosition.TOP_RIGHT, CharacterPosition.BOTTOM_LEFT, CharacterPosition.BOTTOM_RIGHT];
				positions = shuffleInPlace(positions);

				active_players = air.getActivePlayerDeviceIds();
				players.push(new Character(CharacterType.ESCAPIST, "Esc1", active_players[0], positions[0], colors[0], air, table, scene));
				players.push(new Character(CharacterType.SPY, "Spy1", active_players[1], positions[1], colors[1], air, table, scene));
				players.push(new Character(CharacterType.ESCAPIST, "Esc2", active_players[2], positions[2], colors[2], air, table, scene));
				players.push(new Character(CharacterType.SPY, "Spy2", active_players[3], positions[3], colors[3], air, table, scene));

				Turn();
			}
		}
	}

	air.onDisconnect = function (device) {
		console.log(`Active Players: ${air.getActivePlayerDeviceIds().length}`);
		if (air.getActivePlayerDeviceIds().length != MAX_PLAYERS) {
			air.broadcast({ id: "RELOAD" });
			window.location.reload();
		}
	}
	air.onMessage = function (from, data) {
		var player = players.filter((character) => {
			if (character.device_id == from) {
				return true;
			} else {
				return false;
			}
		})[0];
		player.onMsg(data);
	};

}

async function Turn() {
	await delay(500);
	air.broadcast({ id: "SHOW_MENU" });
	//air.broadcast({ id: "SHOW_INTRO" });

	// START LOGIC LOOP Un turno, una promesa

	// FIRST SET TIME LEFT
	{
		air.broadcast({ id: "SET_TURNS", turns: turnsLeft });
		turnsLeft--;
	}
	// SELECT YOUR OPTION
	{
		players.forEach((p) => {
			p.nextAction[0] = CharacterAction.NOT_YET;
			p.nextAction[1] = CharacterAction.NOT_YET;
		});
		air.broadcast({ id: "SELECT_OPTION_1" });
		// WAIT UNTIL EVERYBODY HAS SELECTED AN OPTION
		await SelectOption(0);
		air.broadcast({ id: "END_SELECT_OPTION" });
		air.broadcast({ id: "SELECT_OPTION_2" });
		await SelectOption(1);
		air.broadcast({ id: "END_SELECT_OPTION" });
		await delay(200);
		for (var j = 0; j < 2; j++) {
			for (var i = 0; i < players.length; i++) {
				await players[i].doNextAction(j); // CAMERA ZOOM
			}
		}

	}
	await Turn();
}

function SelectOption(i: number): Promise<any> {
	return new Promise((resolve) => {
		var int = setInterval(() => {
			if (players.reduce((prev, curr) => {
				return prev && (curr.nextAction[i] != CharacterAction.NOT_YET);
			}, true)) {
				clearInterval(int);
				resolve();
			}
		}, 100);
	});
}

window.addEventListener("DOMContentLoaded", () => {
	console.log("Mastin de Jade - The individual has always had to struggle to keep from being overwhelmed by the tribe. If you try it, you will be lonely often, and sometimes frightened. But no price is too high to pay for the privilege of owning yourself. [F. Nietzsche]");
	// TODO: Seleccionar mejor la fuente
	var parkLaneNF = (new FontFace("ParkLaneNF", "local('Park Lane NF'), url('ParkLaneNF.ttf') format('truetype')")).load();
	var antiqueBookCover = (new FontFace("AntiqueBookCover", "url('AntiqueBookCover.otf') format('opentype')")).load();
	Promise.all([parkLaneNF, antiqueBookCover]).then((data) => {
		data.forEach(function (font) {
			document.fonts.add(font);
		});
		main();
	})
});
