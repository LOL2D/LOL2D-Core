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

        // set value f
        Utils.setValueFromConfig(this, config);

        // calculate color for later use
        this.colorAlpha = Utils.applyColorAlpha(this.color, this.alpha);
    }

    run() {
        this.update();
        this.show();
    }

    show() {
        strokeWeight(1);
        stroke(this.colorAlpha);
        fill(this.colorAlpha);
        text(this.text, this.position.x, this.position.y);
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.mult(this.friction);
        this.alpha = map(millis() - this.startTime, 0, this.lifeSpan, 255, 50);
    }

    isFinished() {
        return millis() - this.startTime > this.lifeSpan;
    }
}
