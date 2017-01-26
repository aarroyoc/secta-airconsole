/* La clase de cada personaje */

export enum CharacterType {
    ESCAPIST,
    SPY
}

export enum CharacterPosition {
    TOP_LEFT,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_RIGHT
}

export class Character {
    private mesh: BABYLON.Mesh;
    private name: string;
    private scene: BABYLON.Scene;
    public device_id: any;
    private color: string;
    private air: any;
    constructor(type: CharacterType, name: string, device_id: any, position: CharacterPosition, color: string, air: any, scene: BABYLON.Scene) {
        this.name = name;
        this.scene = scene;
        this.device_id = device_id;
        this.color = color;
        this.air = air;
        this.mesh = BABYLON.Mesh.CreateCylinder(name, 0.6, 0.25, 0.25, 24, 1, scene);
        this.mesh.position.y = 0.5;

        switch (position) {
            case CharacterPosition.TOP_LEFT:
                this.mesh.position.x = -0.25;
                this.mesh.position.z = -0.25;
                break;
            case CharacterPosition.TOP_RIGHT:
                this.mesh.position.x = 0.25;
                this.mesh.position.z = -0.25;
                break;
            case CharacterPosition.BOTTOM_LEFT:
                this.mesh.position.x = -0.25;
                this.mesh.position.z = 0.25;
                break;
            case CharacterPosition.BOTTOM_RIGHT:
                this.mesh.position.x = 0.25;
                this.mesh.position.z = 0.25;
                break;
        }
        this.sendMsg({
            id: "SET_COLOR",
            color: this.color
        });
        this.sendMsg({
            id: "SET_ROLE",
            role: (type === CharacterType.ESCAPIST) ? "ESCAPIST" : "SPY"
        });

    }
    sendMsg(data: any) {
        this.air.message(this.device_id, data);
    }
    onMsg(data: any) {
        switch (data.id) {
            case "LOOK": alert(this.color + " says " + data.text); break;
        }
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