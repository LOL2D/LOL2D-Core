const Utils = {
    setValueFromConfig(thisObject, config) {
        for (let c in config) {
            thisObject[c] = config[c];
        }
    },
    
    preventRightClick() {
        document.getElementsByTagName("canvas")[0].addEventListener(
            "contextmenu",
            function (evt) {
                evt.preventDefault();
            },
            false
        );
    },

    showFPS(x = 30, y = 10) {
        strokeWeight(1);
        stroke("black");
        fill("white");
        text("FPS: " + ~~frameRate(), x, y);
    },

    showCursor() {
        strokeWeight(10);
        stroke(150);
        line(mouseX, mouseY, pmouseX, pmouseY);
        strokeWeight(1);
    },

    getVectorWithRange(rootVector, targetVector, range) {
        let from = rootVector.copy();
        let to = p5.Vector.add(
            from,
            p5.Vector.sub(targetVector, from).setMag(range)
        );

        return {
            from,
            to,
        };
    },

    rectFromVectorRange(vectorRange, rectWidth) {
        const { from, to } = vectorRange;

        const vecSub = to.copy().sub(from);
        const rectLength = vecSub.mag();
        const angle = vecSub.heading();

        push();
        translate(from.x, from.y);
        rotate(angle);
        rect(0, -rectWidth / 2, rectLength, rectWidth);
        pop();
    },

    applyColorAlpha(colorCode, alpha) {
        let c = color(colorCode);
        c.setAlpha(alpha);
        return c;
    },

    collidePointCircle(px, py, cx, cy, cr) {
        return dist(px, py, cx, cy) <= cr;
    },
};
