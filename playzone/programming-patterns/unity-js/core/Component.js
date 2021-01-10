//https://docs.unity3d.com/ScriptReference/Component.html

import BaseObject from "./BaseObject.js";

export default class Component extends BaseObject {
    // -------------- properties --------------
    gameObject = null; //The game object this component is attached to. A component is always attached to a game object.
    tag = ""; //The tag of this game object.
    transform = null; //The Transform attached to this GameObject.

    // -------------- constructor --------------
    constructor(gameObject) {
        super();

        this.gameObject = gameObject;
        this.tag = gameObject.tag;
        this.transform = gameObject.transform;
    }

    broadcastMessage() {} //Calls the method named methodName on every MonoBehaviour in this game object or any of its children.
    sendMessage() {} //Calls the method named methodName on every MonoBehaviour in this game object.
    sendMessageUpwards() {} //Calls the method named methodName on every MonoBehaviour in this game object and on every ancestor of the behaviour.

    //Returns the component of Type type if the game object has one attached, null if it doesn't.
    getComponent(type) {
        return this.gameObject.getComponent(type);
    }

    //Returns all components of Type type in the GameObject.
    getComponents(type) {
        return this.gameObject.getComponents(type);
    }
}
