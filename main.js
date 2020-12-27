import Game from "./js/game.js";

for (let o in Game) {
    window[o] = Game[o];
}
