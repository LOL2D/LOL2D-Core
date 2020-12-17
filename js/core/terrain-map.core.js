class TerrainMapCore {
    constructor(config = {}) {
        this.position = createVector(0, 0);
        this.terrains = [];
        this.map = [];

        Helper.Other.setValueFromConfig(this, config);

        for (let t of this.map) {
            this.terrains.push(
                new TerrainCore({
                    position: createVector(t.position.x, t.position.y),
                    shapeVertices: t.shapeVertices,
                })
            );
        }
    }

    effect(champions) {
        for (let ter of this.terrains) {
            ter.effect(champions);
        }
    }

    show() {
        for (let t of this.terrains) {
            t.show();
        }
    }
}
