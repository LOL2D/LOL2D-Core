class MovementObjectCore {
    constructor(config = {}) {
        // default value
        this.position = createVector(0, 0);
        this.targetMove = null;
        this.radius = 40;
        this.speed = 3;
        this.fillColor = "white";
        this.strokeColor = "black";
        this.strokeWeight = 1;
        this.bound = null;

        this.isShowPositionTracking = false;
        this.positionTracks = [];
        this.positionTracksLength = 10;
        this.positionTrackColor = "#7772";

        Helper.Other.setValueFromConfig(this, config);
    }

    show() {
        // show position track
        if (this.isShowPositionTracking) {
            this.showPositionTrack();
        }

        // show this
        fill(this.fillColor);
        stroke(this.strokeColor);
        strokeWeight(this.strokeWeight);
        circle(this.position.x, this.position.y, this.radius * 2);
    }

    showPositionTrack() {
        // add positionTracks
        this.positionTracks.push({
            x: this.position.x,
            y: this.position.y,
        });

        // limit track length
        if (this.positionTracks.length > this.positionTracksLength) {
            this.positionTracks.shift();
        }

        // show positionTracks
        if (this.positionTracks.length > 2) {
            stroke(this.positionTrackColor);
            strokeWeight(this.radius * 2);
            noFill();
            beginShape();
            for (let t of this.positionTracks) {
                vertex(t.x, t.y);
            }
            endShape();
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
        // TODO convert to helper.collide
        let range = customRange || this.radius + other.radius;
        return p5.Vector.dist(this.position, other.position) < range;
    }
}
