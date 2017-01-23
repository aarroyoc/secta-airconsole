/* La clase de cada personaje */

export enum CharacterType {
    ESCAPIST,
    SPY
}

export class Character {
    private mesh: BABYLON.Mesh;
    private name: string;
    private scene: BABYLON.Scene;
    constructor(type: CharacterType, name: string, scene: BABYLON.Scene) {
        this.name = name;
        this.scene = scene;
        this.mesh = BABYLON.Mesh.CreateCylinder(name, 0.6, 0.5, 0.5, 24, 1, scene);
        this.mesh.position.y = 0.5;
    }
    moveTo(x: number, y: number) {
        this.mesh.position = new BABYLON.Vector3(x, 0, y);
    }
    // Acciones del controlador
    push() {

    }
    lookAt() {

    }
    reArrange() {

    }
    getTo() {

    }
}