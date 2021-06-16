import AhriQ from "./spellScripts/Ahri/Q.js";

const SpellClasses = {
    AhriQ,
};

export function getSpellScript(spellName) {
    return new SpellClasses[spellName]();
}
