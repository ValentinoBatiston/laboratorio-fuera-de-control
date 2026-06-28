import { GameData } from "../managers/GameData.js";

export class Level3Scene extends Phaser.Scene{

    constructor() {
        super("Level3Scene");
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

    checkRobotCollision() {

        const distance =
            Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                this.robot.x,
                this.robot.y
            );

        if (distance < 50) {

            return true;
        }

        return false;
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
        ).setDisplaySize(800, 600);

        this.invulnerable = false;

        this.score = GameData.score;
        this.lives = GameData.lives;
        this.rescued = 0;

        this.levelCompleted = false;

        this.add.text(
            300,
            20,
            "NIVEL 3",
            {
                fontSize: "32px",
                color: "#ffffff"
            }
        );

        this.scoreText = this.add.text(
            20,
            20,
            "Puntos: " + this.score,
            {
                fontSize: "24px",
                color: "#ffffff"
            }
        );

        this.livesText = this.add.text(
            20,
            50,
            "Vidas: " + this.lives,
            {
                fontSize: "24px",
                color: "#ffffff"
            }
        );

        this.rescuedText = this.add.text(
            20,
            80,
            "Rescatados: " + this.rescued,
            {
                fontSize: "24px",
                color: "#ffffff"
            }
        );

        this.goalText = this.add.text(
            20,
            110,
            "Objetivo: 7 rescates",
            {
                fontSize: "24px",
                color: "#ffff00"
            }
        );

        this.dangerZone = this.add.image(
            400,
            250,
            "danger"
        );

        this.dangerZone.setDisplaySize(100, 100);

        this.player = this.add.image(
            400,
            500,
            "player"
        );

        this.player.setDisplaySize(48, 48);

        this.robot = this.add.image(
            100,
            150,
            "robot"
        );

        this.robot.setDisplaySize(48, 48);

        this.robotDirection = 1;

        this.cursors =
            this.input.keyboard.createCursorKeys();

        this.pushKey =
            this.input.keyboard.addKey(
                Phaser.Input.Keyboard.KeyCodes.E
            );

        this.scientists = [];

        for(let i = 0; i < 7; i++){

            const scientist = this.add.image(
                150 + (i * 120),
                250,
                "scientist"
            );

            scientist.setDisplaySize(40, 48);

            scientist.saved = false;

            this.scientists.push(scientist);
        }

        this.fallingObject = null;
        this.accidentResolved = false;

        this.time.addEvent({

            delay: 2500,

            callback: () => {

                this.createDangerEvent();

            },

            loop: true

        });

        this.createDangerEvent();
    }

    dropObject() {

        this.fallingObject = this.add.image(
            this.dangerZone.x,
            0,
            "object"
        );

        this.fallingObject.setDisplaySize(32, 32);

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

                this.scene.start("VictoryScene");

            }
        );
    }

    update() {

        this.robot.x += 2 * this.robotDirection;

        if (this.robot.x > 700) {

            this.robotDirection = -1;
        }

        if (this.robot.x < 100) {

            this.robotDirection = 1;
        }

        if (this.fallingObject) {

            this.fallingObject.y += 5;

        }

        if (this.checkRobotCollision()) {

            this.loseLife();

            this.player.x = 400;
            this.player.y = 500;
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

            this.time.delayedCall(
                200,
                () => {
                    this.player.setTexture("player");
                }
            );
        }

        if (
            !this.levelCompleted &&
            this.rescued >= 7
        ) {

            this.levelCompleted = true;

            this.completeLevel();
        }
    }
}    