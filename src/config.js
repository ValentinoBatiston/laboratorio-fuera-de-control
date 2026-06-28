import { MenuScene } from "./scenes/MenuScene.js";
import { Level1Scene } from "./scenes/Level1Scene.js";
import { Level2Scene } from "./scenes/Level2Scene.js";
import { Level3Scene } from "./scenes/Level3Scene.js";
import { GameOverScene } from "./scenes/GameOverScene.js";
import { VictoryScene } from "./scenes/VictoryScene.js";

export const config = {
    type: Phaser.AUTO,

    width: 1280,
    height: 720,

    scale: {

        mode: Phaser.Scale.FIT,

        autoCenter: Phaser.Scale.CENTER_BOTH

    },

    backgroundColor: "#4f5789",

    scene: [
        MenuScene,
        Level1Scene,
        Level2Scene,
        Level3Scene,
        VictoryScene,
        GameOverScene
    ]
};