import AbilityObjectCore from "../../core/ability-object.core.js";

export default class FlashObject extends AbilityObjectCore {
    constructor(config = {}) {
        // get value from config
        super(config);

        // override
        this.fillColor = "#FFFF73";
        this.strokeColor = "yellow";

        // custom attributes
        this.dots = [];

        for (let i = 0; i < 10; i++) {
            this.dots.push({
                x: random(
                    this.position.x - this.radius,
                    this.position.x + this.radius
                ),
                y: random(
                    this.position.y - this.radius,
                    this.position.y + this.radius
                ),
                r: random(3, 10),
            });
        }
    }

    // override
    update() {
        super.update();

        for (let i = this.dots.length - 1; i >= 0; i--) {
            this.dots[i].x += random(-2, 2);
            this.dots[i].y += random(-2, 2);
            this.dots[i].r -= 0.2;

            if (this.dots[i].r <= 0) {
                this.dots.splice(i, 1);
            }
        }
    }

    // override
    show() {
        // super.show(); // DO NOT NEED

        fill(this.fillColor);
        stroke(this.strokeColor);
        for (let dot of this.dots) {
            circle(dot.x, dot.y, dot.r * 2);
        }
    }

    // override
    // effectChampions(champions) {}

    // override
    // move() {}

    // override
    checkFinished() {
        return this.dots.length <= 0;
    }

    // other functions here
}
