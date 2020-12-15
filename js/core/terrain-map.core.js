class TerrainMapCore {
    constructor(config = {}) {
        this.position = createVector(0, 0);
        this.terrains = [];
        this.map = [];

        Helper.Other.setValueFromConfig(this, config);

        for (let tp of this.map) {
            this.terrains.push(
                new TerrainCore({
                    position: createVector(tp.position.x, tp.position.y),
                    paths: tp.paths,
                })
            );
        }
    }

    show() {
        for (let t of this.terrains) {
            t.show();
        }
    }
}
