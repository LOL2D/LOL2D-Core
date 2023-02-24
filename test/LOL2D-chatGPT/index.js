import * as f from "./src/main.js";

console.log(f);

for (let _ in f) {
  window[_] = f[_];
}
