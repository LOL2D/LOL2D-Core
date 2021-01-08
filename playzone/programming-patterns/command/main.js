function makeMoveUnitCommand(unit, x, y) {
    var xBefore, yBefore;
    return {
        execute: function () {
            xBefore = unit.getX();
            yBefore = unit.getY();
            unit.moveTo(x, y);
        },
        undo: function () {
            unit.moveTo(xBefore, yBefore);
        },
    };
}

let player, undoButton, moveButton;

function setup() {
    createCanvas(500, 500);

    player = {
        x: 10,
        y: 10,
        r: 20,
        xTo: 10,
        yTo: 20,
        moveCommand: null,
        getX: function () {
            return this.x;
        },
        getY: function () {
            return this.y;
        },
        show: function () {
            fill(100);
            circle(this.x, this.y, this.r * 2);
        },
        move: function () {
            this.x = lerp(this.x, this.xTo, 0.1);
            this.y = lerp(this.y, this.yTo, 0.1);
        },
        moveTo: function (x, y) {
            this.xTo = x;
            this.yTo = y;
        },
    };

    undoButton = createButton("Undo");
    undoButton.mousePressed(() => {
        player.moveCommand?.undo();
    });

    moveButton = createButton("Move");
    moveButton.mousePressed(() => {
        let moveCommand = makeMoveUnitCommand(
            player,
            random(width),
            random(height)
        );

        player.moveCommand = moveCommand;
        player.moveCommand.execute();
    });
}

function draw() {
    background(30);

    player.move();
    player.show();
}
