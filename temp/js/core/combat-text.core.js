import GlobalTime from "../global/time.global.js";
import Helper from "../helper/index.js";

// https://lh6.googleusercontent.com/WtyMzAZqnNs_Na_Smy_aIrb85e22H0IW4jZd4EBBw3cjzkhTgOlLh95w8bzU3wTK3SaCjoNvrJb01cWjr_yJTMiD9PiRMF0KewMKc9d824Rc_ID3MJYqIS6QgonMe463OU06s58G
export default class CombatTextCore {
    constructor(config = {}) {
        this.position = createVector(0, 0);
        this.velocity = createVector(0, 0);
        this.gravity = createVector(0.01, 0.05);
        this.movedVector = createVector(0, 0);

        this.text = "noti";
        this.color = "red";
        this.alpha = 255;
        this.colorAlpha = "red";

        this.lifeSpan = 700;
        this.startTime = GlobalTime.getNow();

        Helper.Other.setValueFromConfig(this, config);
    }

    show() {
        strokeWeight(1);
        stroke(this.colorAlpha);
        fill(this.colorAlpha);
        text(
            this.text,
            this.position.x + this.movedVector.x,
            this.position.y + this.movedVector.y
        );
    }

    update() {
        const lifeTime = GlobalTime.getNow() - this.startTime;

        this.movedVector.add(this.velocity);
        this.velocity.add(this.gravity);
        this.alpha = map(lifeTime, 0, this.lifeSpan, 255, 10);
        this.colorAlpha = Helper.Color.applyColorAlpha(this.color, this.alpha);
    }

    isFinished() {
        return GlobalTime.getNow() - this.startTime > this.lifeSpan;
    }
}
