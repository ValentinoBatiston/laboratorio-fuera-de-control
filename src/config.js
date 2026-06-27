import { MenuScene } from "./scenes/MenuScene.js";
import { Level1Scene } from "./scenes/Level1Scene.js";
import { Level2Scene } from "./scenes/Level2Scene.js";
import { Level3Scene } from "./scenes/Level3Scene.js";
import { GameOverScene } from "./scenes/GameOverScene.js";
import { VictoryScene } from "./scenes/VictoryScene.js";

export const config = {
    type: Phaser.AUTO,

    width: 800,
    height: 600,

    backgroundColor: "#1d2030",

    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },

    scene: [
        MenuScene,
        Level1Scene,
        Level2Scene,
        Level3Scene,
        GameOverScene,
        VictoryScene
    ]
};