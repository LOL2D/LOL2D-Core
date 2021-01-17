import Component from "../core/Component.js";

export default class TestComponent extends Component {
    constructor() {
        super();
    }

    doSomething(params) {
        console.log("TestComponent doSomething()", ...params);
    }
}
