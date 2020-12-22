class TerrainMapCore {
    constructor(config = {}) {
        this.position = createVector(0, 0);
        this.width = 1000;
        this.height = 1000;

        this.terrains = [];
        this.data = {};
        this.quadtree = null;

        Helper.Other.setValueFromConfig(this, config);

        // setup
        this.convertDataToTerrain();
        this.initQuadtree();
        // this.update();
    }

    convertDataToTerrain() {
        for (let t in this.data) {
            this.terrains.push(
                new TerrainCore({
                    position: createVector(
                        this.data[t].position.x,
                        this.data[t].position.y
                    ),
                    rects: this.data[t].rects,
                })
            );
        }
    }

    initQuadtree() {
        this.quadtree = new Quadtree({
            x: 0,
            y: 0,
            w: this.width,
            h: this.height,
        });
    }

    effect(champions) {
        for (let ter of this.terrains) {
            ter.effect(champions);
        }
    }

    update() {
        this.quadtree.clear();

        for (let t of this.terrains) {
            for (let r of t.rects) {
                this.quadtree.insert(r);
            }
        }

        this.drawQuadtree(this.quadtree);
    }

    show() {
        for (let t of this.terrains) {
            t.show();
        }
    }

    getTerrainsInView(champion) {
        let rects = this.quadtree.retrieve({
            x: champion.position.x - champion.sightRadius,
            y: champion.position.y - champion.sightRadius,
            w: champion.sightRadius * 2,
            h: champion.sightRadius * 2,
        });

        return rects;
    }

    drawQuadtree(node) {
        var bounds = node.bounds;

        //no subnodes? draw the current node
        if (node.nodes.length === 0) {
            stroke("red");
            noFill();
            strokeWeight(1);
            rect(bounds.x, bounds.y, bounds.w, bounds.h);

            //has subnodes? drawQuadtree them!
        } else {
            for (var i = 0; i < node.nodes.length; i++) {
                this.drawQuadtree(node.nodes[i]);
            }
        }
    }
}
