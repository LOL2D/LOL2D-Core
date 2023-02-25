import Buff from "./Buff.js";

export default class Spell {
    constructor(name, cooldown, range, castTime, cost) {
        this.name = name;
        this.cooldown = cooldown;
        this.range = range;
        this.castTime = castTime;
        this.cost = cost;
    }

    cast(caster, target) {
        // Implement spell logic here
        let b = new Buff("Fireball", 1000);
        b.apply(target);

        setTimeout(() => {
            b.remove(target);
        }, b.duration);
    }
}
