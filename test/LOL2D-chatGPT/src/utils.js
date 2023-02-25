export function disableRightClick(ele) {
    ele.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });
}
