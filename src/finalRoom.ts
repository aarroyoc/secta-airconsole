import { Room } from "./room";

export class FinalRoom extends Room {
    constructor(scene: BABYLON.Scene) {
        super("FinalRoom", scene);
    }
    onlyFar(): boolean {
        return true;
    }
}