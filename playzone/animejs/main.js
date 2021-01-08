// https://animejs.com/documentation/

var player = {
    x: 100,
    y: 100,
    r: 20,
};

let animation;

function setup() {
    createCanvas(500, 500);

    fill(255);
    noStroke();

    animation = anime({
        targets: player,
        x: "*=3",
        y: "*=2",
        // round: 2,
        easing: "easeOutSine",
        direction: "alternate",
        loop: true,
        update: function () {
            text(JSON.stringify(player), 10, 10);
        },
        autoplay: false,
    });
}

function draw() {
    background(30);

    animation.tick(millis());

    circle(player.x, player.y, player.r * 2);
}
