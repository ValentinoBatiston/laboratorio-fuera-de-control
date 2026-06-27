import { GameData } from "../managers/GameData.js";

export class GameOverScene extends Phaser.Scene {

    constructor() {
        super("GameOverScene");
    }

    create() {

        this.add.text(
            250,
            180,
            "GAME OVER",
            {
                fontSize: "48px",
                color: "#ff0000"
            }
        );

        this.add.text(
            250,
            260,
            "Puntaje: " + GameData.score,
            {
                fontSize: "32px",
                color: "#ffffff"
            }
        );

        const button = this.add.text(
            280,
            360,
            "VOLVER AL MENU",
            {
                fontSize: "28px",
                backgroundColor: "#4f5789",
                padding: 10
            }
        );

        button.setInteractive();

        button.on("pointerdown", () => {

            this.scene.start("MenuScene");

        });

    }
}