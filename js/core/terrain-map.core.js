class TerrainMapCore {
    constructor(config = {}) {
        this.position = createVector(0, 0);
        this.width = 1000;
        this.height = 1000;

        this.polygons = [];
        this.quadtree = null;

        Helper.Other.setValueFromConfig(this, config);

        // setup
        this.quadtree = new Quadtree(
            {
                x: 0,
                y: 0,
                w: this.width,
                h: this.height,
            },
            10
        );
    }

    effect(champion) {
        let data = this.getTerrainsInSight(champion);

        for (let item of data) {
            let poly = item.ref;

            fill("white");
            beginShape();
            for (let p of poly) {
                vertex(p[0], p[1]);
            }
            endShape(CLOSE);

            let response = new SAT.Response();

            let collided = SAT.testPolygonCircle(
                new SAT.Polygon(
                    new SAT.Vector(),
                    poly.map((p) => new SAT.Vector(p[0], p[1]))
                ),
                champion.getSATBody(),
                response
            );

            if (collided) {
                champion.position.x += response.overlapV.x;
                champion.position.y += response.overlapV.y;
            }
        }
    }

    update() {
        this.quadtree.clear();

        for (let poly of this.polygons) {
            let bound = this.getBoundaryOfPolygon(poly);
            this.quadtree.insert({
                ...bound,
                ref: poly, // reference to terrain
            });
        }

        this.drawQuadtree(this.quadtree);
    }

    show() {
        strokeWeight(3);
        stroke("#fff6");
        fill("#555");

        for (let poly of this.polygons) {
            beginShape();
            for (let p of poly) {
                vertex(p[0], p[1]);
            }
            endShape(CLOSE);
        }

        // fill("red");
        // noStroke();
        // for (let poly of this.polygons) {
        //     for (let p of poly) {
        //         circle(p[0], p[1], 10);
        //     }
        // }
    }

    getBoundaryOfPolygon(polygon) {
        let left = Infinity;
        let bottom = -Infinity;
        let top = Infinity;
        let right = -Infinity;

        for (let p of polygon) {
            left = min(left, p[0]);
            right = max(right, p[0]);
            top = min(top, p[1]);
            bottom = max(bottom, p[1]);
        }

        return {
            x: left,
            y: top,
            w: right - left,
            h: bottom - top,
        };
    }

    getTerrainsInSight(champion) {
        let data = this.quadtree.retrieve({
            x: champion.position.x - champion.sightRadius,
            y: champion.position.y - champion.sightRadius,
            w: 1000,
            h: 1000,
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
