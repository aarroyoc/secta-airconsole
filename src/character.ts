/* La clase de cada personaje */

export class Character {
    private mesh: BABYLON.Mesh;
    private name: string;
    private scene: BABYLON.Scene;
    constructor(name: string, scene: BABYLON.Scene) {
        this.name = name;
        this.scene = scene;
        this.mesh = BABYLON.Mesh.CreateCylinder(name, 10, 1, 1, 24, 1, scene);
    }
    moveTo(x: number, y: number) {

    }
}