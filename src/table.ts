/* esta clase contiene el tablero en sí */

import { Room, CenterRoom } from "./room";
import { VisionRoom } from "./visionRoom";
import { FinalRoom } from "./finalRoom";

import { shuffleInPlace } from "./utils";

export class Table {
    private tablero: Array<Array<Room>>;
    private scene: BABYLON.Scene;
    constructor(scene: BABYLON.Scene) {
        this.tablero = new Array;
        this.scene = scene;
        this.genTablero();
    }
    private isCentralRoom(i: number, j: number): boolean {
        return (i === 2 && j === 2);
    }
    private isFarRoom(i: number, j: number): boolean {
        var far = false;
        far || (i === 0 && j !== 2);
        far || (i === 1 && (j === 0 || j === 4));
        far || (i === 3 && (j === 0 || j === 4));
        far || (i === 4 && j !== 2);
        return far;
    }
    private isNearRoom(i: number, j: number): boolean {
        return !(this.isFarRoom(i, j) || this.isCentralRoom(i, j));
    }
    public printTablero() {
        var buffer = "";
        for (var i = 0; i < this.tablero.length; i++) {
            for (var j = 0; j < this.tablero[i].length; j++) {
                console.dir(this.tablero[i]);
                buffer += " " + this.tablero[i][j].msg();
            }
            buffer += "|";
        }
        console.log(buffer);
    }
    private genTablero() {
        var placedVision = false;
        var placedRoom25 = false;

        // CREATE 22 DIFFERENT ROOMS HERE WITH new

        var rooms = [];

        // ONLY FOR TESTING
        for (var i = 0; i < 25; i++) {
            rooms.push(new Room("Room" + i, this.scene));
        }

        shuffleInPlace(rooms);

        for (var i = 0; i < 5; i++) {
            this.tablero[i] = new Array;
            // Este sistema puede fallar... FIXIT
            for (var j = 0; j < 5; j++) {
                if (this.isCentralRoom(i, j)) {
                    // Generar habitacion central
                    this.tablero[i][j] = new CenterRoom(this.scene);
                }
                if (this.isFarRoom(i, j)) {
                    this.tablero[i][j] = rooms.pop();
                }
                if (this.isNearRoom(i, j)) {
                    // Generar habitacion de interior
                    var room: Room = rooms.pop();
                    while (room.onlyFar()) {
                        rooms.unshift(room);
                        room = rooms.pop();
                    }
                    this.tablero[i][j] = room;
                }
            }
        }
    }

}