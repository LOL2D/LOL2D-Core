// https://docs.unity3d.com/ScriptReference/Transform.html
import Component from "./Component.js";
import Vector2 from "./Vector.js";

export default class Transform extends Component {
    constructor(position, scale, rotation) {
        super();

        this.position = position || Vector2.zero;
        this.scale = scale || Vector2.zero;
        this.rotation = rotation || Vector2.zero;
    }

    translate(vec2) {
        this.position.add(vec2);
    }
}
