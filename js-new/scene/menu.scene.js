import UIButton from "../ui/button.ui.js";
import UIManager from "../ui/manager.ui.js";
import GameScene from "./game.scene.js";

export default class MenuScene {
    setup() {
        this.uimanager = new UIManager();

        // play button
        let playBtn = new UIButton("Play", width / 2, height / 2 - 25, 100, 40);
        playBtn.onClick = () => {
            this.sceneManager.showScene(GameScene);
        };
        this.uimanager.add(playBtn);

        // setting button
        let settingBtn = new UIButton(
            "Setting",
            width / 2,
            height / 2 + 25,
            100,
            40
        );
        this.uimanager.add(settingBtn);
    }

    enter() {
        this.sceneManager.showScene(GameScene);
    }

    draw() {
        background(30);

        push();
        textSize(36);
        fill(255);
        noStroke();
        text("League of Legends 2D", width / 2, 100);
        pop();

        this.uimanager.update();
        this.uimanager.show();
    }
}
