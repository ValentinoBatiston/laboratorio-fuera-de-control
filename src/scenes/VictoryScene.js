import { GameData } from "../managers/GameData.js";

export class VictoryScene extends Phaser.Scene {
    constructor() {
        super("VictoryScene");
    }

    create() {

        this.add.text(
            220,
            150,
            "¡VICTORIA!",
            {
                fontSize: "48px",
                color: "#00ff00"
            }
        );

        this.add.text(
            180,
            250,
            "Has salvado el laboratorio",
            {
                fontSize: "28px",
                color: "#ffffff"
            }
        );

        this.add.text(
            250,
            320,
            "Puntaje: " + GameData.score,
            {
                fontSize: "32px",
                color: "#ffff00"
            }
        );

        const button = this.add.text(
            220,
            420,
            "VOLVER AL MENU",
            {
                fontSize: "28px",
                backgroundColor: "#4f5789",
                color: "#ffffff",
                padding: {
                    x: 10,
                    y: 10
                }
            }
        );

        button.setInteractive();

        button.on("pointerdown", () => {
            this.scene.start("MenuScene");
        });
    }
}