import Sketch from "./Game/Sketch.js";

for (let o in Sketch) {
    window[o] = Sketch[o];
}
