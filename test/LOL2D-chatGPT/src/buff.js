export default class Buff {
  constructor(name, duration) {
    this.name = name;
    this.duration = duration;
  }

  apply(champion) {
    // Implement buff logic here
    champion.size += 20;
  }

  remove(champion) {
    // Implement buff removal logic here
    champion.size -= 20;
  }
}
