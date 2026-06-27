import { GameData } from "../managers/GameData.js";

export class MenuScene extends Phaser.Scene {

    constructor() {
        super("MenuScene");
    }

    create() {

        this.add.text(
            250,
            150,
            "PROTOCOLO DE EVACUACION",
            {
                fontSize: "32px",
                color: "#ffffff"
            }
        );

        const button = this.add.text(
            340,
            300,
            "JUGAR",
            {
                fontSize: "28px",
                backgroundColor: "#4f5789",
                padding: 10
            }
        );

        button.setInteractive();

        button.on("pointerdown", () => {
            GameData.score = 0;
            GameData.lives = 3;
            this.scene.start("Level1Scene");
        });
    }
}