class NotiEffectCore {
    constructor(config = {}) {
        // default value
        this.position = createVector(0, 0);
        this.velocity = createVector(0, 0);
        this.friction = 0.95;

        this.text = "noti";
        this.color = "red";
        this.alpha = 255;

        this.lifeSpan = 1000;
        this.startTime = millis();

        // set value
        for (let c in config) {
            this[c] = config[c];
        }
    }

    run() {
        this.update();
        this.show();
    }

    show() {
        let c = this.calculateColor();
        strokeWeight(1);
        stroke(c);
        fill(c);
        text(this.text, this.position.x, this.position.y);
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.mult(this.friction);
        this.alpha = map(millis() - this.startTime, 0, this.lifeSpan, 255, 50);
    }

    calculateColor() {
        let c = color(this.color);
        c.setAlpha(this.alpha);
        return c;
    }

    isFinished() {
        return millis() - this.startTime > this.lifeSpan;
    }
}
