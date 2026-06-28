import { GameData } from "../managers/GameData.js";

export class VictoryScene extends Phaser.Scene {

    constructor() {
        super("VictoryScene");
    }

    create() {

        this.cameras.main.setBackgroundColor("#7f9696");

        this.add.text(
            640,
            120,
            "¡MISIÓN CUMPLIDA!",
            {
                fontSize: "54px",
                fontStyle: "bold",
                color: "#00ff66"
            }
        ).setOrigin(0.5);

        this.add.text(
            640,
            240,
            "Todos los científicos fueron rescatados.",
            {
                fontSize: "30px",
                color: "#ffffff"
            }
        ).setOrigin(0.5);

        this.add.text(
            640,
            330,
            "Puntaje Final: " + GameData.score,
            {
                fontSize: "34px",
                color: "#ffff00"
            }
        ).setOrigin(0.5);

        const menuButton = this.add.rectangle(
            640,
            520,
            320,
            70,
            0xff9800
        ).setInteractive();

        this.add.text(
            640,
            520,
            "VOLVER AL MENÚ",
            {
                fontSize: "28px",
                fontStyle: "bold",
                color: "#000000"
            }
        ).setOrigin(0.5);

        menuButton.on("pointerdown", () => {

            this.scene.start("MenuScene");

        });

    }

}