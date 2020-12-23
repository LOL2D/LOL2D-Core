class TerrainMapCore {
    constructor(config = {}) {
        this.position = createVector(0, 0);
        this.width = 1000;
        this.height = 1000;

        this.terrains = [];
        this.data = [];
        this.quadtree = null;

        Helper.Other.setValueFromConfig(this, config);

        // setup
        this.convertDataToTerrain();
        this.initQuadtree();
    }

    convertDataToTerrain() {
        for (let t of this.data) {
            this.terrains.push(
                new TerrainCore({
                    position: { x: t.position[0], y: t.position[1] },
                    polygons: t.polygons,
                })
            );
        }
    }

    initQuadtree() {
        this.quadtree = new Quadtree(
            {
                x: 0,
                y: 0,
                w: this.width,
                h: this.height,
            },
            2
        );
    }

    effect(champions) {
        for (let ter of this.terrains) {
            ter.effect(champions);
        }
    }

    update() {
        this.quadtree.clear();

        for (let t of this.terrains) {
            let bound = t.getBoundary();

            fill("#ff02");
            rect(bound.x, bound.y, bound.w, bound.h);
            fill("white");
            text("Boundary", bound.x, bound.y);

            this.quadtree.insert({
                ...bound,
                ref: t, // reference to terrain
            });
        }

        this.drawQuadtree(this.quadtree);
    }

    show() {
        for (let t of this.terrains) {
            t.show();
        }
    }

    getTerrainsInSight(champion) {
        let data = this.quadtree.retrieve({
            x: champion.position.x - champion.sightRadius,
            y: champion.position.y - champion.sightRadius,
            w: champion.sightRadius * 2,
            h: champion.sightRadius * 2,
        });

        return data;
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
