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

export enum CharacterAction {
    LOOK,
    MOVE,
    PUSH,
    CONTROL,
    NOT_YET
}

interface CharacterMovements {
    left: boolean,
    right: boolean,
    up: boolean,
    down: boolean
}

export class Character {
    private mesh: BABYLON.Mesh;
    private name: string;
    private scene: BABYLON.Scene;
    public device_id: any;
    private color: string;
    private air: any;
    public nextAction: Array<CharacterAction>;
    private direction: number;
    constructor(type: CharacterType, name: string, device_id: any, position: CharacterPosition, color: string, air: any, scene: BABYLON.Scene) {
        this.name = name;
        this.scene = scene;
        this.device_id = device_id;
        this.color = color;
        this.air = air;
        this.nextAction = [];
        this.direction = 0;
        //this.mesh = BABYLON.Mesh.CreateCylinder(name, 0.6, 0.25, 0.25, 24, 1, scene);
        BABYLON.SceneLoader.ImportMesh("Cuerpo", "/data/", "sectarian2.babylon", scene, (meshes, ps, skeletons) => {
            this.mesh = <BABYLON.Mesh>meshes[0];
            this.mesh.isVisible = true;
            this.mesh.position.y = 0.5;
            this.mesh.scaling.x = 0.05;
            this.mesh.scaling.y = 0.05;
            this.mesh.scaling.z = 0.05;
            console.log(this.mesh.animations);
            console.log(this.mesh.skeleton.getAnimatables());
            this.mesh.skeleton.beginAnimation("rotation animation", true, 1.0);
            this.mesh.beginAnimation("rotation animation", true, 1.0);

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
        });
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
            case "SET_ACTION": {
                switch (data.type) {
                    case "LOOK": this.nextAction[data.index - 1] = CharacterAction.LOOK; break;
                    case "MOVE": this.nextAction[data.index - 1] = CharacterAction.MOVE; break;
                    case "PUSH": this.nextAction[data.index - 1] = CharacterAction.PUSH; break;
                    case "CONTROL": this.nextAction[data.index - 1] = CharacterAction.CONTROL; break;
                }
            } break;
            case "SET_DIRECTION": {
                switch (data.dir) {
                    case "UP": this.direction = 1; break;
                    case "DOWN": this.direction = 2; break;
                    case "LEFT": this.direction = 3; break;
                    case "RIGHT": this.direction = 4; break;
                }
            }
        }
    }
    getMovements(): CharacterMovements {
        var movements = {
            left: true,
            right: true,
            up: true,
            down: true
        };
        if (this.mesh.position.x < -1.5)
            movements.left = false;
        if (this.mesh.position.x > 1.5)
            movements.right = false;
        if (this.mesh.position.z < -1.5)
            movements.up = false;
        if (this.mesh.position.z > 1.5)
            movements.down = false;
        return movements;
    }

    doNextAction(i: number): Promise<any> {
        return new Promise((resolve) => {
            switch (this.nextAction[i]) {
                case CharacterAction.LOOK: {
                    var movements = this.getMovements();
                    this.sendMsg({ id: "SHOW_DIRECTION", movements: movements });
                    var int = setInterval(() => {
                        if (this.direction != 0) {
                            clearInterval(int);
                            // ejecutar animación, enviar información
                            this.sendMsg({ id: "END_SELECT_OPTION" });
                            this.sendMsg({ id: "DEBUG", text: "Sala en pruebas" });
                            // resolver promesa
                            this.direction = 0;
                            resolve();
                        }
                    }, 100);
                } break;
                case CharacterAction.MOVE: {
                    var movements = this.getMovements();
                    this.sendMsg({ id: "SHOW_DIRECTION", movements: movements });
                    var int = setInterval(() => {
                        if (this.direction != 0) {
                            clearInterval(int);
                            // enviar información
                            switch (this.direction) {
                                case 1: this.getTo(0, 1); break;
                                case 2: this.getTo(0, -1); break;
                                case 3: this.getTo(-1, 0); break;
                                case 4: this.getTo(1, 0); break;
                            }
                            this.sendMsg({ id: "END_SELECT_OPTION" });
                            this.sendMsg({ id: "DEBUG", text: "Sala en pruebas" });
                            this.direction = 0;
                            resolve();
                        }
                    }, 100);
                } break;
                case CharacterAction.PUSH: {
                    resolve();
                } break;
                case CharacterAction.CONTROL: {
                    resolve();
                }
            }
        });
    }

    moveTo(x: number, y: number) {
        this.mesh.position = new BABYLON.Vector3(x, 0.5, y); // Hacer animacion
    }
    // Acciones del controlador
    push() {

    }
    lookAt() {

    }
    reArrange() {

    }
    getTo(x: number, y: number) {
        this.moveTo(this.mesh.position.x + x, this.mesh.position.z + y);
        // Enter ROOM (and open it if needed)
    }
}