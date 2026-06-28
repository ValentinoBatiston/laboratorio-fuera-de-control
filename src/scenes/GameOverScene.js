import { GameData } from "../managers/GameData.js";

export class GameOverScene extends Phaser.Scene {

    constructor() {
        super("GameOverScene");
    }

    create() {

        this.cameras.main.setBackgroundColor("#7f9696");

        this.add.text(
            640,
            120,
            "GAME OVER",
            {
                fontSize: "60px",
                fontStyle: "bold",
                color: "#ff4444"
            }
        ).setOrigin(0.5);

        this.add.text(
            640,
            230,
            "El laboratorio quedó fuera de control.",
            {
                fontSize: "28px",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

        this.add.text(
            640,
            310,
            "Puntaje: " + GameData.score,
            {
                fontSize: "32px",
                color: "#ffff00"
            }
        ).setOrigin(0.5);

        const retryButton = this.add.rectangle(
            640,
            470,
            300,
            65,
            0xff9800
        ).setInteractive();

        this.add.text(
            640,
            470,
            "REINTENTAR",
            {
                fontSize: "28px",
                fontStyle: "bold",
                color: "#000000"
            }
        ).setOrigin(0.5);

        retryButton.on("pointerdown", () => {

            GameData.score = 0;
            GameData.lives = 3;

            this.scene.start("Level1Scene");

        });

        const menuButton = this.add.rectangle(
            640,
            560,
            300,
            65,
            0xff9800
        ).setInteractive();

        this.add.text(
            640,
            560,
            "MENÚ PRINCIPAL",
            {
                fontSize: "26px",
                fontStyle: "bold",
                color: "#000000"
            }
        ).setOrigin(0.5);

        menuButton.on("pointerdown", () => {

            GameData.score = 0;
            GameData.lives = 3;

            this.scene.start("MenuScene");

        });

    }

}