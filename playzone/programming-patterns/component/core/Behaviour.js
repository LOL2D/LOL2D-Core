import Component from "./Component.js";

// Behaviours are Components that can be enabled or disabled.
// https://docs.unity3d.com/ScriptReference/Behaviour.html

export default class Behaviour extends Component {
    constructor() {
        super();

        this.enabled = true;
    }

    get isActiveAndEnabled() {
        return this.enabled && this.gameObject.active;
    }
}
