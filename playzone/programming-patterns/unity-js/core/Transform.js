// https://docs.unity3d.com/Manual/class-Transform.html
export default class Transform {
    constructor(gameObject) {
        this.position = createVector(0, 0, 0);
        this.rotation = createVector(0, 0, 0);
        this.scale = createVector(0, 0, 0);

        this.gameObject = gameObject;
    }
}
