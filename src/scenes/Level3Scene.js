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

    checkScientistHit() {

        for (const scientist of this.scientists) {

            if (this.isScientistInDanger(scientist)) {

                GameData.lives--;

                GameData.score = Math.max(0, GameData.score - 100);
                this.score = GameData.score;

                this.scoreText.setText(
                    "Puntos: " + this.score
                );

                this.livesText.setText(
                    "Vidas: " + GameData.lives
                );

                if (GameData.lives <= 0) {

                    this.scene.start("GameOverScene");

                }

                break;
            }
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

    isScientistInDanger(scientist) {

        return Math.abs(
            scientist.x - this.dangerZone.x
        ) < 60;

    }   

    create() {

        this.rescueGoal = 7;

        this.add.image(
            400,
            300,
            "floor"
        ).setDisplaySize(1920, 1080);

        this.invulnerable = false;

        this.score = GameData.score;
        this.lives = GameData.lives;
        this.rescued = 0;

        this.levelCompleted = false;

        this.add.text(
            550,
            120,
            "NIVEL 3",
            {
                fontSize: "28px",
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


        this.scoreText = this.add.text(
            40,
            20,
            "Puntos: " + this.score,
            {
                fontSize: "24px",
                color: "#ffffff"
            }
        );

        this.livesText = this.add.text(
            550,
            20,
            "Vidas: " + GameData.lives,
            {
                fontSize: "24px",
                color: "#ffffff"
            }
        );

        this.rescuedText = this.add.text(
            1000,
            20,
            "Rescatados: 0/7",
            {
                fontSize: "24px",
                color: "#ffffff"
            }
        );

        this.dangerZone = this.add.image(
            400,
            260,
            "danger"
        );

        this.dangerZone.setDisplaySize(128, 128);

        this.player = this.add.image(
            600,
            550,
            "player"
        );

        this.player.setDisplaySize(100, 100);

        this.robot = this.add.image(
            150,
            400,
            "robot"
        );

        this.robot.setDisplaySize(100, 100);

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
                150 + (i * 160),
                250,
                "scientist"
            );

            scientist.setDisplaySize(100, 100);

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

        this.fallingObject.setDisplaySize(64, 64);

        this.checkScientistHit();

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

                this.scene.start("VictoryScene");

            }
        );
    }

    update() {

        this.robot.x += 2 * this.robotDirection;

        if (this.robot.x > 1100) {

            this.robotDirection = -1;
            this.robot.setFlipX(true);
        }

        if (this.robot.x < 100) {

            this.robotDirection = 1;
            this.robot.setFlipX(false);
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

            const scientist = this.getNearestScientist();

            if (!scientist) return;

            const distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                scientist.x,
                scientist.y
            );

            if (
                distance < 70 &&
                !this.isScientistInDanger(scientist)
            ) {

                scientist.destroy();

                this.scientists =
                    this.scientists.filter(
                        s => s !== scientist
                    );

                this.score += 100;
                this.rescued++;

                GameData.score = this.score;

                this.scoreText.setText(
                    "Puntos: " + this.score
                );

                this.rescuedText.setText(
                    "Rescatados: " + this.rescued + "/7"
                );
            }
        }

        if (this.cursors.left.isDown) {
            this.player.x -= 4;
            this.player.setFlipX(true);
        }

        if (this.cursors.right.isDown) {
            this.player.x += 4;
            this.player.setFlipX(false);
        }

        if (this.cursors.up.isDown) {
            this.player.y -= 4;
        }

        if (this.cursors.down.isDown) {
            this.player.y += 4;
        }

        if (Phaser.Input.Keyboard.JustDown(this.pushKey)) {

            this.player.setTexture("playerPush");

            this.time.delayedCall(200, () => {
                this.player.setTexture("player");
            });

            const scientist = this.getNearestScientist();

            if (!scientist) return;

            const distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                scientist.x,
                scientist.y
            );

            if (distance < 70) {

                if (!this.isScientistInDanger(scientist)) {

                    // Ya estaba fuera de peligro
                    this.score = Math.max(0, this.score - 50);
                    GameData.score = this.score;

                    this.scoreText.setText(
                        "Puntos: " + this.score
                    );

                } else {

                    scientist.x += 80;

                    if (!this.isScientistInDanger(scientist)) {

                        this.score += 50;
                        GameData.score = this.score;

                        this.scoreText.setText(
                            "Puntos: " + this.score
                        );
                    }
                }
            }
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