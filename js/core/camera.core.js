class CameraCore {
    constructor(config = {}) {
        // default value
        this.position = createVector(0, 0);
        this.target = createVector(0, 0);
        this.follow = true;
        this.followLerp = 0.1;
        this.scale = 0.1;
        this.scaleTo = 1;
        this.scaleLerp = 0.07;
        this.borderSize = 25;
        this.borderSpeed = 20;

        Utils.setValueFromConfig(this, config);
    }

    beginState() {
        push();
        translate(width * 0.5, height * 0.5);
        scale(this.scale);
        translate(-this.position.x, -this.position.y);

        // update scale
        this.scale = lerp(this.scale, this.scaleTo, this.scaleLerp);

        // follow target
        if (this.follow) {
            this.position = p5.Vector.lerp(
                this.position,
                this.target,
                this.followLerp
            );
        }

        // move camera on edge
        else if (this.isMouseOnEdge()) {
            let vec = createVector(
                mouseX - width / 2,
                mouseY - height / 2
            ).setMag(this.borderSpeed);
            this.position.add(vec);
        }
    }

    endState() {
        pop();
    }

    changeTarget(target) {
        this.target = target;
    }

    convert(_x, _y) {
        let newX = (_x - width * 0.5) / this.scale + this.position.x;
        let newY = (_y - height * 0.5) / this.scale + this.position.y;

        return createVector(newX, newY);
    }

    isMouseOnEdge() {
        return (
            mouseX > width - this.borderSize ||
            mouseX < this.borderSize ||
            mouseY > height - this.borderSize ||
            mouseY < this.borderSize
        );
    }
}
