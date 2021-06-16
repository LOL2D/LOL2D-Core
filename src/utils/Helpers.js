export function preventRightClick(canvas) {
    canvas.addEventListener(
        "contextmenu",
        function (evt) {
            evt.preventDefault();
        },
        false
    );
}

export function HasFlag(status, flag) {
    return status & flag;
}
