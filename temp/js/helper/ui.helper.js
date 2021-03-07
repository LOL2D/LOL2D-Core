const UIHelper = {
    showFPS(x = 40, y = 15) {
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

    rectFromVectorRange(vectorRange, width, rounded = false) {
        const { from, to } = vectorRange;

        const vecSub = to.copy().sub(from);
        const len = vecSub.mag();
        const angle = vecSub.heading();

        push();
        translate(from.x, from.y);
        rotate(angle);

        rounded
            ? rect(0, -width * 0.5, len, width, 0, width, width, 0)
            : rect(0, -width * 0.5, len, width);

        pop();
    },
};

export default UIHelper;
