export default class SceneManager {
    static #scenes = [];
    static #activeScene = null;

    constructor() {}

    static update(dt) {
        if (this.#activeScene) this.#activeScene.update(dt);
    }

    static draw() {
        if (this.#activeScene) this.#activeScene.draw();
    }

    static addScene(scene) {
        try {
            scene.init();
            this.#activeScene = scene;
            this.#scenes.push(scene);
            return true;
        } catch {
            return false;
        }
    }

    static setActiveScene(scene) {
        if (!scene) return;

        if (this.#scenes.indexOf(scene) < 0) {
            this.#scenes.push(scene);
        }

        if (this.#activeScene) {
            this.#activeScene.onExit();
        }

        this.#activeScene = scene;
        this.#activeScene.onEnter();
    }

    static getSceneByName(name) {
        let scene = this.#scenes.find((s) => s.name === name);
        if (scene) {
            return scene;
        }
        return null;
    }

    static getActiveScene() {
        return this.#activeScene;
    }
}
