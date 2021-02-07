import Sketch from "./js-new/sketch.js";

for (let o in Sketch) {
    window[o] = Sketch[o];
}
