export default class ChampionCore {
    constructor(scene, config = {}) {
        this.scene = scene;

        this.position = createVector(0, 0);
        this.destination = createVector(0, 0);

        this.name = config.name;
        this.avatar = scene.sceneManager.gameData.assets[config.avatar];
        this.radius = config.radius;
        this.health = config.health;
        this.mana = config.mana;
        this.abilities = {};
        for (let ab in config.abilities) {
            if (ab) this.abilities[ab] = new ab(scene, this);
        }
    }

    show() {
        if (this.avatar) {
            image(
                this.avatar,
                this.position.x,
                this.position.y,
                this.radius * 2,
                this.radius * 2
            );
        }
    }
}
