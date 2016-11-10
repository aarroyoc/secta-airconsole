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
}