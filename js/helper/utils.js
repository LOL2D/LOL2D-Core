function preventRightClick() {
    document.getElementsByTagName("canvas")[0].addEventListener(
        "contextmenu",
        function (evt) {
            evt.preventDefault();
        },
        false
    );
}

function showFPS(x = 10, y = 10) {
    noStroke();
    fill("black");
    text("FPS: " + ~~frameRate(), x, y);
}

function showCursor() {
    strokeWeight(10);
    stroke(150);
    line(mouseX, mouseY, pmouseX, pmouseY);
    strokeWeight(1);
}

function getVectorRange(rootVector, targetVector, range) {
    let from = rootVector.copy();
    let to = p5.Vector.add(
        from,
        p5.Vector.sub(targetVector, from).setMag(range)
    );

    return {
        from,
        to,
    };
}
