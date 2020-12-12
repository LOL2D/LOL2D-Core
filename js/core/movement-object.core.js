class MovementObjectCore {
    constructor(config = {}) {
        // default value
        this.position = createVector(0, 0);
        this.targetMove = null;
        this.radius = 40;
        this.speed = 3;
        this.fillColor = "white";
        this.strokeColor = "black";
        this.bound = null;

        this.positionTracking = false;
        this.positionTracks = [];

        // set value
        for (let c in config) {
            this[c] = config[c];
        }
    }

    show() {
        fill(this.fillColor);
        stroke(this.strokeColor);
        strokeWeight(1);
        circle(this.position.x, this.position.y, this.radius * 2);

        if (this.positionTracking) {
            // add tracks
            this.tracks.push({ x: this.position.x, y: this.position.y });
            if (this.tracks.length > 10) {
                this.tracks.shift();
            }

            // show tracks
            if (this.tracks.length > 2) {
                stroke("#5577bb55");
                strokeWeight(this.radius / 2);
                noFill();
                beginShape();
                for (let t of this.tracks) {
                    vertex(t.x, t.y);
                }
                endShape();
            }
        }
    }

    move() {
        // move to targetMove
        const { targetMove, position, speed } = this;

        if (!this.isArrivedTargetMove()) {
            let direction = p5.Vector.sub(targetMove, position);
            this.position.add(direction.setMag(speed));
        } else if (targetMove != null) {
            this.position.set(targetMove.x, targetMove.y);
        }

        // bound position
        let bounded = this.applyBound(position.x, position.y);
        this.position.set(bounded.x, bounded.y);
    }

    isArrivedTargetMove() {
        const { targetMove, position, speed } = this;
        return !targetMove || p5.Vector.dist(position, targetMove) <= speed;
    }

    moveTo(x, y) {
        let bounded = this.applyBound(x, y);

        if (this.targetMove) {
            this.targetMove.set(bounded.x, bounded.y);
        } else {
            this.targetMove = bounded;
        }
    }

    applyBound(x, y) {
        if (this.bound) {
            const { top, bottom, left, right } = this.bound;

            return createVector(
                constrain(x, left + this.radius, right - this.radius),
                constrain(y, top + this.radius, bottom - this.radius)
            );
        }

        return createVector(x, y);
    }

    overlap(other, customRange) {
        let range = customRange || this.radius + other.radius;
        return p5.Vector.dist(this.position, other.position) < range;
    }
}
