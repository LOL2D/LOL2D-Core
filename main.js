import Game from "./js-new/game.js";

for (let o in Game) {
    window[o] = Game[o];
}
