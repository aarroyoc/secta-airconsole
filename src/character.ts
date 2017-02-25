/* La clase de cada personaje */

import { Table } from "./table";
import { Room } from "./room";

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
    private table: Table;
    constructor(type: CharacterType, name: string, device_id: any, position: CharacterPosition, color: string, air: any, table: Table, scene: BABYLON.Scene) {
        this.name = name;
        this.scene = scene;
        this.device_id = device_id;
        this.color = color;
        this.air = air;
        this.nextAction = [];
        this.direction = 0;
        this.table = table;
        this.mesh = BABYLON.Mesh.CreateBox(name, 0.25, scene);
        var mat = new BABYLON.StandardMaterial(name + "_mat", scene);
        switch (color) {
            case "red": mat.diffuseColor = new BABYLON.Color3(1, 0, 0); break;
            case "blue": mat.diffuseColor = new BABYLON.Color3(0, 0, 1); break;
            case "green": mat.diffuseColor = new BABYLON.Color3(0, 1, 0); break;
            case "yellow": mat.diffuseColor = new BABYLON.Color3(1, 1, 0); break;
        }
        this.mesh.material = mat;
        this.mesh.position.y = 0;
        //this.mesh = BABYLON.Mesh.CreateCylinder(name, 0.6, 0.25, 0.25, 24, 1, scene);
        //BABYLON.SceneLoader.ImportMesh("", "/data/", "sectarian4.babylon", scene, (meshes, ps, skeletons) => {
        //    this.mesh = <BABYLON.Mesh>meshes[0];
        this.mesh.isVisible = true;
        //this.mesh.position.y = 0.5;
        //this.mesh.scaling.x = 0.05;
        //this.mesh.scaling.y = 0.05;
        //this.mesh.scaling.z = 0.05;
        //this.mesh.skeleton.beginAnimation("Caminar", true, 1.0); // ANIMATION DOESN'T WORK

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
        //});
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
            movements.down = false;
        if (this.mesh.position.z > 1.5)
            movements.up = false;
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
                            var room: Room;
                            switch (this.direction) {
                                case 1: room = this.table.getRoom(this.mesh.position.x, this.mesh.position.z + 1); break;
                                case 2: room = this.table.getRoom(this.mesh.position.x, this.mesh.position.z - 1); break;
                                case 3: room = this.table.getRoom(this.mesh.position.x - 1, this.mesh.position.z); break;
                                case 4: room = this.table.getRoom(this.mesh.position.x + 1, this.mesh.position.z); break;
                            }
                            this.sendMsg({ id: "SHOW_ROOM_INFO", img: room.img(), title: room.title(), text: room.msg() });
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
                            var x = 0;
                            var y = 0;
                            switch (this.direction) {
                                case 1: y = 1; break;
                                case 2: y = -1; break;
                                case 3: x = -1; break;
                                case 4: x = 1; break;
                            }
                            this.sendMsg({ id: "END_SELECT_OPTION" });
                            this.getTo(x, y);
                            var room = this.table.getRoom(this.mesh.position.x + x, this.mesh.position.z + y);
                            this.sendMsg({ id: "SHOW_ROOM_INFO", img: room.img(), title: room.title(), text: room.msg() });
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
        //this.mesh.position = new BABYLON.Vector3(x, 0, y); // Hacer animacion
        var anim = new BABYLON.Animation("", "position", 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE);
        var easing = new BABYLON.QuadraticEase();
        easing.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        var keys = [{ frame: 0, value: this.mesh.position }, { frame: 100, value: new BABYLON.Vector3(x, 0, y) }];
        anim.setKeys(keys);
        anim.setEasingFunction(easing);
        this.mesh.animations = [];
        this.mesh.animations.push(anim);
        this.scene.beginAnimation(this.mesh, 0, 100, false, 1);
    }
    // Acciones del controlador
    push() {

    }
    lookAt() {

    }
    reArrange() {

    }
    getTo(x: number, y: number) {
        var room = this.table.getRoom(this.mesh.position.x + x, this.mesh.position.z + y);
        if (!room.isVisible()) {
            room.flip();
        }
        this.moveTo(this.mesh.position.x + x, this.mesh.position.z + y);
        room.onEnter(this);

        // Enter ROOM (and open it if needed) Apply effects to character
    }
}