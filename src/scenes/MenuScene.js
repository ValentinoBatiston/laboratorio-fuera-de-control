import { GameData } from "../managers/GameData.js";

export class MenuScene extends Phaser.Scene {

    constructor() {
        super("MenuScene");
    }

    create() {

        this.cameras.main.setBackgroundColor("#7f9696");

        this.add.text(
            640,
            90,
            "LABORATORIO FUERA DE CONTROL",
            {
                fontSize: "48px",
                fontStyle: "bold",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

        this.add.text(
            640,
            260,
            "Un accidente provocó una fuga de sustancias peligrosas.\n" +
            "Rescata a todos los científicos antes de que sea demasiado tarde.",
            {
                fontSize: "26px",
                align: "center",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

        const playButton = this.add.rectangle(
            640,
            430,
            280,
            70,
            0xff9800
        ).setInteractive();

        this.add.text(
            640,
            430,
            "JUGAR",
            {
                fontSize: "34px",
                fontStyle: "bold",
                color: "#000000"
            }
        ).setOrigin(0.5);

        playButton.on("pointerdown", () => {

            GameData.score = 0;
            GameData.lives = 3;

            this.scene.start("Level1Scene");

        });

        this.add.text(
            640,
            580,
            "Controles\n\n← → ↑ ↓   Moverse\nESPACIO   Rescatar\n  E      Empujar",
            {
                fontSize: "24px",
                align: "center",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

    }

}