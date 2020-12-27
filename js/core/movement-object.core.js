import Helper from "../helper/index.js";

export default class MovementObjectCore {
    constructor(config = {}) {
        // default value
        this.position = createVector(0, 0);
        this.destination = createVector(0, 0);
        this.radius = 40;
        this.speed = 3;
        this.fillColor = "white";
        this.strokeColor = "black";
        this.strokeWeight = 1;
        this.bound = null;

        this.isShowPositionTracking = false;
        this.positionTracks = [];
        this.positionTracksLength = 10;
        this.positionTracksWeight = null;
        this.positionTrackColor = "#7772";

        Helper.Other.setValueFromConfig(this, config);
    }

    getSATBody() {
        return new SAT.Circle(
            new SAT.Vector(this.position.x, this.position.y),
            this.radius
        );
    }

    getBoundary() {
        return Helper.Boundary.circle({
            x: this.position.x,
            y: this.position.y,
            radius: this.radius,
        });
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
            strokeWeight(this.positionTrackWeight || this.radius * 2);
            noFill();
            beginShape();
            for (let t of this.positionTracks) {
                vertex(t.x, t.y);
            }
            endShape();
        }
    }

    move() {
        // move to destination
        const { destination, position, speed } = this;

        if (this.isArrivedDestination()) {
            this.position.set(destination.x, destination.y);
        } else {
            let direction = p5.Vector.sub(destination, position);
            this.position.add(direction.setMag(speed));
        }

        // bound position
        let bounded = this.applyBound(position.x, position.y);
        this.position.set(bounded.x, bounded.y);
    }

    isArrivedDestination() {
        const { destination, position, speed } = this;
        return !destination || p5.Vector.dist(position, destination) <= speed;
    }

    moveTo(x, y) {
        let bounded = this.applyBound(x, y);
        this.destination.set(bounded.x, bounded.y);
    }

    removeDestination() {
        this.destination.set(this.position.x, this.position.y);
    }

    applyBound(x, y) {
        if (this.bound) {
            const { top, bottom, left, right } = this.bound;

            return {
                x: constrain(x, left + this.radius, right - this.radius),
                y: constrain(y, top + this.radius, bottom - this.radius),
            };
        }

        return { x, y };
    }
}
