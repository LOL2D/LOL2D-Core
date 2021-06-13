export default class AhriQ {
    constructor() {}

    onActivate(owner) {
        console.log("activate");
    }

    onDeactivate(owner) {
        console.log("deactivate");
    }

    onStartCasting(owner, spell, target) {
        console.log("start casting");
    }

    onFinishCasting(owner, spell, target) {
        console.log("finish casting");
    }

    applyEffects(owner, target, spell, projectile) {
        console.log("apply effect");
    }

    onUpdate() {
        // console.log("update")
    }
}
