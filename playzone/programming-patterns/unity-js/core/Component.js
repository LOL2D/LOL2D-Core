//https://docs.unity3d.com/ScriptReference/Component.html

import BaseObject from "./BaseObject";

export default class Component extends BaseObject {
    // -------------- properties --------------
    #gameObject = null; //The game object this component is attached to. A component is always attached to a game object.

    // -------------- constructor --------------
    constructor(gameObject) {
        super();

        this.#gameObject = gameObject;
    }
}
