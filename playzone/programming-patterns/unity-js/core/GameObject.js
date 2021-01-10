// https://docs.unity3d.com/Manual/GameObjects.html

import BaseObject from "./BaseObject.js";
import Transform from "./Transform.js";

export default class GameObject extends BaseObject {
    // -------------- static --------------
    //Creates a game object with a primitive mesh renderer and appropriate collider.
    static createPrimitive(type) {}

    //Finds a GameObject by name and returns it.
    static find(name) {
        let gameObjs = BaseObject.findObjectsOfType(GameObject);
        return gameObjs.filter((g) => g.name === name && g.isActive()) || null;
    }

    //Returns an array of active GameObjects tagged tag. Returns empty array if no GameObject was found.
    static findGameObjectsWithTag(tag) {
        let gameObjs = BaseObject.findObjectsOfType(GameObject);
        return gameObjs.filter((g) => g.tag === tag && g.isActive()) || [];
    }

    //Returns one active GameObject tagged tag. Returns null if no GameObject was found.
    static findWithTag() {
        let gameObjs = BaseObject.findObjectsOfType(GameObject);
        return gameObjs.find((g) => g.tag === tag && g.isActive()) || [];
    }

    // -------------- properties --------------
    #components = [];
    #activeSelf = true; //The local active state of this GameObject. (Read Only)
    #layer = 1; //The layer the game object is in.
    #scene = null; //Scene that the GameObject is part of.
    #tag = ""; //The tag of this game object.
    #transform = new Transform(this); //The Transform attached to this GameObject.

    // -------------- constructor --------------
    constructor() {
        super();
    }

    // -------------- getter/setter --------------
    get transform() {
        return this.#transform;
    }

    get tag() {
        return this.#tag;
    }
    set tag(value) {
        if (typeof value == "string") this.#tag = value;
    }

    get scene() {
        return this.#scene;
    }

    get layer() {
        return this.#layer;
    }
    set layer(value) {
        if (typeof value === "number") this.#layer = value;
    }

    // -------------- methods --------------
    isActive() {
        return this.#activeSelf; // TODO check parent's active
    }

    //Adds a component class named className to the game object.
    addComponent(componentType) {
        this.#components.push(new componentType(this));
    }

    sendMessage; //Calls the method named methodName on every MonoBehaviour in this game object.
    sendMessageUpwards; //Calls the method named methodName on every MonoBehaviour in this game object and on every ancestor of the behaviour.
    broadcastMessage; //Calls the method named methodName on every MonoBehaviour in this game object or any of its children.

    //Returns the component of Type type if the game object has one attached, null if it doesn't.
    getComponent(type) {
        return this.#components.find((c) => c instanceof type) || null;
    }

    //Returns all components of Type type in the GameObject.
    getComponents(type) {
        return this.#components.filter((c) => c instanceof type) || [];
    }

    //Activates/Deactivates the GameObject, depending on the given true or false value.
    setActive(value) {
        if (typeof value === "boolean") this.#activeSelf = value;
    }
}
