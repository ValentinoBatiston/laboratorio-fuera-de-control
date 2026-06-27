import { GameData } from "../managers/GameData.js";

export class Level1Scene extends Phaser.Scene {
    
    constructor() {
        super("Level1Scene");
    }

    loseLife() {

        if (this.invulnerable) {
            return;
        }

        this.lives--;

        this.invulnerable = true;

        this.time.delayedCall(
            2000,
            () => {
                this.invulnerable = false;
            }
        );

        GameData.lives = this.lives;

        this.livesText.setText(
            "Vidas: " + this.lives
        );

        if (this.lives <= 0) {

            this.scene.start("GameOverScene");
        }
    }

    getNearestScientist() {

        let nearest = null;
        let minDistance = Infinity;

        this.scientists.forEach(scientist => {

            const distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                scientist.x,
                scientist.y
            );

            if(distance < minDistance){

                minDistance = distance;
                nearest = scientist;
            }

        });

        return nearest;
    }

    checkScientistSafety() {

        if (this.fallingObject) {

            this.fallingObject.destroy();

            this.fallingObject = null;
        }
    }

    create() {
    
        this.invulnerable = false;

        this.scientists = [];

        for(let i = 0; i < 3; i++){

            const scientist = this.add.rectangle(
                500 + (i * 80),
                300,
                40,
                40,
                0x0099ff
            );

            scientist.saved = false;

            this.scientists.push(scientist);
        }

        this.fallingObject = null;

        this.time.addEvent({

            delay: 5000,

            callback: () => {

                this.createDangerEvent();

            },

            loop: true

        });

        this.accidentResolved = false;

        this.dangerZone = this.add.circle(
            600,
            300,
            50,
            0xff0000,
            0.4
        );

        this.spaceKey =
            this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.SPACE
            );

        this.score = GameData.score;
        this.lives = GameData.lives;
        this.rescued = 0;

        this.levelCompleted = false;

        this.pushKey =
            this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.E
            );

        this.scoreText = this.add.text(
            20,
            20,
            "Puntos: 0",
            {
                fontSize: "24px",
                color: "#ffffff"
            }
        );

        this.livesText = this.add.text(
            20,
            50,
            "Vidas: 3",
            {
                fontSize: "24px",
                color: "#ffffff"
            }
        );

        this.rescuedText = this.add.text(
            20,
            80,
            "Rescatados: 0",
            {
                fontSize: "24px",
                color: "#ffffff"
            }
        );

        this.goalText = this.add.text(
            20,
            110,
            "Objetivo: 3 rescates",
            {
                fontSize: "24px",
                color: "#ffff00"
            }
        );

        this.add.text(
            300,
            50,
            "NIVEL 1",
            {
                fontSize: "32px",
                color: "#ffffff"
            }
        );

        this.player = this.add.rectangle(
            400,
            300,
            40,
            40,
            0x00ff00
        );

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    dropObject() {

        this.fallingObject = this.add.rectangle(
            this.dangerZone.x,
            0,
            30,
            30,
            0xffff00
        );

    }

    createDangerEvent() {

        if (this.fallingObject) {
            return;
        }

        const randomX = Phaser.Math.Between(
            150,
            650
        );

        this.dangerZone.x = randomX;

        this.accidentResolved = false;

        this.time.delayedCall(
            2000,
            () => {

                this.dropObject();

            }
        );
    }

    completeLevel() {

        const text = this.add.text(
            220,
            250,
            "NIVEL COMPLETADO",
            {
                fontSize: "40px",
                color: "#00ff00"
            }
        );

        this.time.delayedCall(
            2000,
            () => {

                this.scene.start("Level2Scene");

            }
        );
    }

    update() {

        if (this.fallingObject) {

            this.fallingObject.y += 5;

        }

        if (
            this.fallingObject &&
            !this.accidentResolved &&
            this.fallingObject.y >= this.dangerZone.y
        ) {

            this.accidentResolved = true;

            this.checkScientistSafety();
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {

            this.score += 100;

            this.scoreText.setText(
                "Puntos: " + this.score
            );
        }

        if (this.cursors.left.isDown) {
            this.player.x -= 3;
        }

        if (this.cursors.right.isDown) {
            this.player.x += 3;
        }

        if (this.cursors.up.isDown) {
            this.player.y -= 3;
        }

        if (this.cursors.down.isDown) {
            this.player.y += 3;
        }

        if (
            Phaser.Input.Keyboard.JustDown(
                this.spaceKey
            )
        ) {
            this.score += 100;

            this.scoreText.setText(
                "Puntos: " + this.score
            );
        }

        if (
            Phaser.Input.Keyboard.JustDown(
                this.pushKey
            )
        ) {

            const scientist = this.getNearestScientist();

            if (!scientist) return;

            const distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                scientist.x,
                scientist.y
            );

            if (distance < 70) {

                scientist.x += 80;

                if (
                    !scientist.saved &&
                    scientist.x > this.dangerZone.x + 60
                ) {

                    scientist.saved = true;

                    this.rescued++;
                    GameData.rescued = this.rescued;

                    this.rescuedText.setText(
                        "Rescatados: " + this.rescued
                    );

                    this.score += 100;
                    GameData.score = this.score;

                    this.scoreText.setText(
                        "Puntos: " + this.score
                    );

                    console.log("CIENTIFICO SALVADO");
                }
            }
        }

        if (
            !this.levelCompleted &&
            this.rescued >= 3
        ) {

            this.levelCompleted = true;

            this.completeLevel();
        }
    }
}