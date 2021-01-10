// https://docs.unity3d.com/ScriptReference/Object.html

export default class BaseObject {
    // -------------- static --------------
    static _objects = [];
    static _idGenerator = idGenerator();

    static findObjectOfType(type) {
        return this._objects.find((o) => o instanceof type) || null;
    }

    static findObjectsOfType(type) {
        return this._objects.filter((o) => o instanceof type) || [];
    }

    static instantiate(obj) {}

    static destroy(obj) {
        let index = BaseObject._objects.indexOf(obj);

        if (index > -1) {
            BaseObject._objects.splice(index, 1);
        }
    }

    // -------------- properties --------------
    #id = BaseObject._idGenerator.next().value; // The unique id (auto increasement) of the object.
    #name = ""; // The name of the object.

    // -------------- constructor --------------
    constructor() {
        BaseObject._objects.push(this);
    }

    // -------------- getter/setter --------------
    get name() {
        return this.#name;
    }
    set name(newName) {
        if (typeof newName === "string") this.#name = newName;
    }

    // -------------- methods --------------
    getInstanceID() {
        return this.#id;
    }
}

function* idGenerator(start = 0) {
    let index = start;
    while (true) yield "" + index++;
}

function uuidv4() {
    // https://stackoverflow.com/a/2117523/11898496
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );
}
