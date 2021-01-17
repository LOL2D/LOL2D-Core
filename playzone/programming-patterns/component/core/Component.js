// https://docs.unity3d.com/ScriptReference/Component.html

import BaseObject from "./BaseObject.js";

export default class Component extends BaseObject {
    constructor() {
        super();

        this.gameObject = null;
    }

    get tag() {
        return this.gameObject.tag;
    }
    set tag(value) {
        this.gameObject.tag = value;
    }

    get transform() {
        return this.gameObject.transform;
    }

    attachTo(gameObject) {
        this.gameObject = gameObject;
    }

    getComponent(type) {
        return this.gameObject.getComponent(type);
    }

    getComponents(type) {
        return this.gameObject.getComponents(type);
    }

    sendMessage(methodName, ...params) {
        this.gameObject.sendMessage(methodName, ...params);
    }
}
