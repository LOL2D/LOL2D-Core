// https://docs.unity3d.com/ScriptReference/Behaviour.html

import Component from "./Component.js";

export default class Behaviour extends Component {
    enabled = true; //Enabled Behaviours are Updated, disabled Behaviours are not.
    isActiveAndEnabled = true; //Has the Behaviour had active and enabled called?

    constructor() {
        super();
    }
}
