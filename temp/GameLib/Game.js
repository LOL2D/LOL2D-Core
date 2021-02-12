import ApiFunctionManager from "./API/ApiFunctionManager.js";
import ApiEventManager from "./API/ApiEventManager.js";
import PlayerManager from "./Players/PlayerManager.js";
import ObjectManager from "./ObjectManager.js";

export default class Game {
    constructor() {
        // this.itemManager = new ItemManager();
        // this.playerManager = new PlayerManager(this);
    }

    initialize(config) {
        // this.config = config;
        this.objectManager = new ObjectManager(this);
        // this.protectionManager = new ProtectionManager(this);
        // this.gameMap = new GameMap(this);
        this.gameTime = 0;

        ApiFunctionManager.setGame(this);
        ApiEventManager.setGame(this);

        // this.gameMap.init();

        // for (let p in this.config.players) {
        //     this.playerManager.addPlayer(p);
        // }
    }

    initializePacketHandlers() {}

    gameLoop() {
        this.gameTime += Math.min(deltaTime, 250);

        while (this.gameTime > 1000 / 61) {
            this.update(deltaTime);
            this.gameTime -= 1000 / 60;

            if (this.gameTime < 1000 / 59 - 1000 / 60) this.gameTime = 0;
        }
    }

    update(diff) {
        fill(255);
        text("Playing", width / 2, height / 2);

        this.objectManager.update(diff);
        // this.protectionManager.update(diff);
        // this.gameMap.update(diff);
    }
}
