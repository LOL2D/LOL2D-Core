// https://docs.unity3d.com/ScriptReference/Vector3.html

export default class Vector2 {
    static get zero() {
        return new Vector2(0, 0);
    }

    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    mag() {
        return Math.sqrt(this.sqrMag());
    }

    sqrMag() {
        return this.x * this.x + this.y * this.y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vec2) {
        this.x += vec2.x;
        this.y += vec2.y;
    }

    equal(vec2) {
        return this.x === vec2.x && this.y === vec2.y;
    }
}
