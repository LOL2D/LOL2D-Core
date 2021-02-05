import CameraCore from "../core/camera.core.js";
import ChampionCore from "../core/champion.core.js";
import GroundMapCore from "../core/ground-map.core.js";
import Champ from "../core/champion/index.js";

export default class GameScene {
    setup() {}

    enter() {
        this.camera = new CameraCore();
        this.groundMap = new GroundMapCore();

        this.champions = [];
        this.abilityObjects = [];
        this.turrets = [];
        // this.monsters = [];
        // this.minions = [];

        this.player = new ChampionCore(this, Champ.Ahri);
        this.player.position.set(width / 2, height / 2);
    }

    draw() {
        background(30);

        this.player.show();
    }
}
