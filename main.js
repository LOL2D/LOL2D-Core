let player;
let players = [];
let camera;
let gamemap;
let arr = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    preventRightClick();

    gamemap = new GameMap();
    camera = new Camera();

    player = new Player({
        bound: gamemap.getBound(),
    });

    for (let i = 0; i < 15; i++) {
        players.push(
            new Player({
                position: createVector(
                    random(gamemap.width),
                    random(gamemap.height)
                ),
                fillColor: [random(255), random(255), random(255)],
                bound: gamemap.getBound(),
            })
        );
    }

    camera.target = player.position;

    // for (let i = 0; i < 150; i++) {
    //     arr.push({ x: random(gamemap.width), y: random(gamemap.height) });
    // }
}

function draw() {
    background(220);

    // control by mouse
    if (mouseIsPressed) {
        if (mouseButton == RIGHT) {
            let worldPos = camera.convert(mouseX, mouseY);
            player.moveTo(worldPos.x, worldPos.y);
            players[0].moveTo(player.position.x, player.position.y);

            for (let i = 1; i < players.length; i++) {
                players[i].moveTo(
                    players[i - 1].position.x,
                    players[i - 1].position.y
                );
            }
        }
    }

    // show mouse cursor
    strokeWeight(10);
    stroke(150);
    line(mouseX, mouseY, pmouseX, pmouseY);
    strokeWeight(1);

    // begin camera
    camera.beginState();

    gamemap.drawEdge();
    gamemap.drawGrid(camera);

    strokeWeight(0);
    for (let a of arr) {
        circle(a.x, a.y, 20);
    }

    player.run();
    for (let p of players) {
        p.run();
    }

    camera.endState();

    // show fps
    fill("red");
    text("FPS: " + ~~frameRate(), 10, 10);
}

function mouseWheel(event) {
    if (event.delta > 0) {
        if (camera.scaleTo > 0.5) camera.scaleTo -= camera.scaleTo / 10;
    } else {
        if (camera.scaleTo < 1) camera.scaleTo += camera.scaleTo / 10;
    }
}
