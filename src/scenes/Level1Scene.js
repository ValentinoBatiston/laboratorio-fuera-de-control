import { GameData } from "../managers/GameData.js";

export class Level1Scene extends Phaser.Scene {
    
    constructor() {
        super("Level1Scene");
    }

    preload() {

        this.load.image("player", "assets/player.png");
        this.load.image("playerPush", "assets/player_push.png");

        this.load.image("scientist", "assets/scientist.png");

        this.load.image("robot", "assets/robot.png");

        this.load.image("object", "assets/object.png");

        this.load.image("danger", "assets/danger_zone.png");

        this.load.image("floor", "assets/floor.png");

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

        this.add.image(
            400,
            300,
            "floor"
        ).setDisplaySize(1920, 1080);

        this.dangerZone = this.add.image(
            400,
            330,
            "danger"
        );

        this.dangerZone.setDisplaySize(128, 128);
    
        this.invulnerable = false;

        this.scientists = [];

        for(let i = 0; i < 3; i++){

            const scientist = this.add.image(
                150 + (i * 450),
                320,
                "scientist"
            );

            scientist.setDisplaySize(100, 100);

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
            40,
            20,
            "Puntos: 0",
            {
                fontSize: "24px",
                color: "#ffffff"
            }
        );

        this.livesText = this.add.text(
            550,
            20,
            "Vidas: 3",
            {
                fontSize: "24px",
                color: "#ffffff"
            }
        );

        this.rescuedText = this.add.text(
            1000,
            20,
            "Rescatados: 0/3",
            {
                fontSize: "24px",
                color: "#ffffff"
            }
        );

        this.add.text(
            350,
            70,
            "LABORATORIO FUERA DE CONTROL",
            {
                fontSize: "34px",
                color: "#ffffff",
                fontStyle: "bold"
            }
        );

        this.add.text(
            550,
            120,
            "NIVEL 1",
            {
                fontSize: "28px",
                color: "#ffffff"
            }
        );

        this.player = this.add.image(
            600,
            550,
            "player"
        );

        this.player.setDisplaySize(100, 100);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.createDangerEvent();
    }

    dropObject() {

        this.fallingObject = this.add.image(
            this.dangerZone.x,
            0,
            "object"
        );

        this.fallingObject.setDisplaySize(64, 64);

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
            450,
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
                this.pushKey
            )
        ) {

            this.player.setTexture("playerPush");

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

                    this.rescuedText.setText(
                        "Rescatados: " + this.rescued + " /3"
                    );

                    this.score += 100;
                    GameData.score = this.score;

                    this.scoreText.setText(
                        "Puntos: " + this.score
                    );

                    console.log("CIENTIFICO SALVADO");
                }
            }

            this.time.delayedCall(
                200,
                () => {
                    this.player.setTexture("player");
                }
            );
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