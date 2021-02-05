export default class UIButton {
    constructor(t, x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.t = t;

        this.fillColor = "#555";
        this.strokeColor = "#000";
        this.textColor = "#ddd";
        this.scale = 1;
    }

    show() {
        stroke(this.strokeColor);
        fill(this.fillColor);
        rect(this.x, this.y, this.w * this.scale, this.h * this.scale);

        fill(this.textColor);
        text(this.t, this.x, this.y);
    }

    onClick() {}
    onMouseOver() {
        // default effects
        this.fillColor = "#666";
        cursor(HAND);
    }
    onMouseOut() {
        // default effects
        this.fillColor = "#555";
        cursor(ARROW);
    }
}
