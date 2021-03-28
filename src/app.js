import Sketch from "./Sketch.js";

for (let o in Sketch) {
    window[o] = Sketch[o];
}
