// https://docs.unity3d.com/ScriptReference/GameObject.html

import BaseObject from "./BaseObject.js";
import Transform from "./Transform.js";

export default class GameObject extends BaseObject {
    static find(name) {
        let gameObjs = BaseObject.findObjectsOfType(GameObject);
        return gameObjs.filter((g) => g.name === name) || null;
    }

    static findGameObjectsWithTag(tag) {
        let gameObjs = BaseObject.findObjectsOfType(GameObject);
        return gameObjs.filter((g) => g.tag === tag) || [];
    }

    static findWithTag() {
        let gameObjs = BaseObject.findObjectsOfType(GameObject);
        return gameObjs.find((g) => g.tag === tag) || [];
    }

    constructor() {
        super();

        this.transform = new Transform();
        this.transform.attachTo(this);

        this.components = [];
        this.active = true;
        this.scene = null;
        this.tag = "";
    }

    addComponent(componentType) {
        let component = new componentType();
        component.attachTo(this);
        this.components.push(component);

        return component;
    }

    getComponent(type) {
        return this.components.find((c) => c instanceof type) || null;
    }

    getComponents(type) {
        return this.components.filter((c) => c instanceof type) || [];
    }

    // Calls the method named methodName on every MonoBehaviour in this game object.
    sendMessage(methodName, ...params) {
        let received = false;
        for (let c of this.components) {
            if (c[methodName]) {
                c[methodName](params);
                received = true;
            }
        }

        return received;
    }
}
