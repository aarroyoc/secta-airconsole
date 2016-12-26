/// <reference path="../node_modules/babylonjs/babylon.d.ts" />

declare function AirConsole(): void;

import { Room } from "./room";
import { Table } from "./table";

function createScene(engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
	var scene = new BABYLON.Scene(engine);
	var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, - 10), scene);
	camera.setTarget(BABYLON.Vector3.Zero());
	camera.attachControl(canvas, false);

	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
	/*var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
	sphere.position.y = 1;*/

	//var ground = BABYLON.Mesh.CreateGround("tablero", 6, 6, 2, scene);
	return scene;
}


function main() {
	//var air = new AirConsole();
	var canvas = <HTMLCanvasElement>document.getElementById("canvas");
	var engine = new BABYLON.Engine(canvas, true);
	var scene = createScene(engine, canvas);
	engine.runRenderLoop(() => {
		scene.render();
	});
	window.addEventListener("resize", () => {
		engine.resize();
	});
	var table = new Table(scene);
	//table.printTablero();
}

window.addEventListener("DOMContentLoaded", () => {
	console.log("Mastin de Jade - The individual has always had to struggle to keep from being overwhelmed by the tribe. If you try it, you will be lonely often, and sometimes frightened. But no price is too high to pay for the privilege of owning yourself. [F. Nietzsche]");
	main();
});
