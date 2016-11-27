import { Room } from "./room";

export class VisionRoom extends Room {
    constructor(scene: BABYLON.Scene) {
        super("VisionRoom", scene);
    }
    onlyFar(): boolean {
        return true;
    }
}