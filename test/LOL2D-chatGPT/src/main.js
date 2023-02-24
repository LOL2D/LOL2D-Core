import Champion from "./champion.js";
import Spell from "./spell.js";

let player;
let enemies = [];
let spell;

export function setup() {
  createCanvas(700, 500);

  player = new Champion();
  for (let i = 0; i < 10; i++) {
    enemies.push(new Champion(random(width), random(height)));
  }

  spell = new Spell("Fireball", 1, 100, 0.5, 10);
}

export function draw() {
  background(30);

  player.update();
  player.draw();

  for (let enemy of enemies) {
    enemy.update();
    enemy.draw();
  }

  if (mouseIsPressed) {
    player.setDestination(mouseX, mouseY);
  }
}

export function mousePressed() {}

export function keyPressed() {
  if (key === "q") {
    spell.cast(player, enemies[0]);
  }
}
