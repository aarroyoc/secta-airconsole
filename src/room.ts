/* esta es la clase de cada habitacion */

import { Character } from "./character";

export class Room extends BABYLON.Node {
    private visible = false;
    constructor(roomName: string, scene: BABYLON.Scene) {
        // Build room in BABYLON
        super(roomName, scene);
    }
    onEnter(character: Character): void {

    }
    moveRoom() {

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
    constructor(scene: BABYLON.Scene) {
        super("CentralRoom", scene);
    }
}