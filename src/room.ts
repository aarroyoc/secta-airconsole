/* esta es la clase de cada habitacion */

import { Character } from "./character";

export class Room extends BABYLON.Node {
    private visible = false;
    private floorMesh: BABYLON.Mesh;
    constructor(roomName: string, scene: BABYLON.Scene) {
        // Build room in BABYLON
        super(roomName, scene);
        this.floorMesh = BABYLON.Mesh.CreateGround(roomName + "_floor", 1, 1, 1, scene, true);
        var floorMat = new BABYLON.StandardMaterial(roomName + "_floor_mat", scene);
        //floorMat.sideOrientation = BABYLON.Mesh.DOUBLESIDE;
        floorMat.backFaceCulling = false;
        floorMat.diffuseTexture = new BABYLON.Texture("data/Suelo.png", this.getScene(), true, false);
        //floorMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
        this.floorMesh.material = floorMat;
    }
    onEnter(character: Character): void {

    }
    moveRoom(x: number, y: number) {
        this.floorMesh.position.x = x;
        this.floorMesh.position.z = y;
    }
    isVisible() {
        return this.visible;
    }
    canPush(): boolean {
        return true;
    }
    canControl(): boolean {
        return true;
    }
    msg(): string {
        return "A dummy room";
    }
    onlyFar(): boolean {
        return false;
    }
    floor(): BABYLON.Texture {
        return new BABYLON.Texture("data/yellow.png", this.getScene(), true, false);
    }
    flip() {
        // TODO: Add effects and 3D Meshes
        if (!this.visible) {
            this.visible = true;
            var n = 1;
            var id = setInterval(() => {
                this.floorMesh.rotation.x += Math.PI / (2 * 100);
                n++;
                if (n > 60) {
                    this.floorMesh.material["diffuseTexture"] = this.floor();
                }
                if (n > 200) {
                    clearInterval(id);
                }
            }, 25);
        }
    }
}

export class CenterRoom extends Room {
    canPush(): boolean {
        return false;
    }
    canControl(): boolean {
        return false;
    }
    msg(): string {
        return "The central room"; // MORE COMPLETE DESCRIPTION
    }
    floor(): BABYLON.Texture {
        return new BABYLON.Texture("data/red.png", this.getScene(), true, false);
    }
    constructor(scene: BABYLON.Scene) {
        super("CentralRoom", scene);
    }
}