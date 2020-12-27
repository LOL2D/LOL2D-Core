const UIHelper = {
    showFPS(x = 40, y = 15) {
        strokeWeight(1);
        stroke("black");
        fill("white");
        textSize(20);
        text("FPS: " + ~~frameRate(), x, y);
    },

    showCursor() {
        strokeWeight(10);
        stroke(150);
        line(mouseX, mouseY, pmouseX, pmouseY);
        strokeWeight(1);
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
};

export default UIHelper;
