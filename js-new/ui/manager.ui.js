export default class UIManager {
    constructor() {
        this.buttons = [];
        this.pMouseIsPressed = false;
    }

    add(btn) {
        this.buttons.push(btn);
    }

    update() {
        for (let btn of this.buttons) {
            let hovered = this.isHovered(btn);

            // on mouse over
            if (hovered && !btn.hovered) {
                btn.hovered = true;
                btn.onMouseOver();
            }

            // on mouse out
            if (!hovered && btn.hovered) {
                btn.hovered = false;
                btn.onMouseOut();
            }

            // onclick
            if (hovered && this.pMouseIsPressed && !mouseIsPressed) {
                btn.onClick();
                btn.onMouseOut();
            }
        }

        this.pMouseIsPressed = mouseIsPressed;
    }

    show() {
        for (let btn of this.buttons) {
            btn.show();
        }
    }

    isHovered(btn) {
        return !(
            mouseX < btn.x - btn.w / 2 ||
            mouseX > btn.x + btn.w / 2 ||
            mouseY < btn.y - btn.h / 2 ||
            mouseY > btn.y + btn.h / 2
        );
    }
}
