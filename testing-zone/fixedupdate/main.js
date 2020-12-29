// source https://stackoverflow.com/a/39834661/11898496

var t = 0;
var dt = 0.01;

var currentTime;
var accumulator = 0;

var previousState = { x: 100, v: 0 };
var currentState = { x: 100, v: 0 };

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// start animation loop
requestAnimationFrame(animate);

function animate(newTime) {
    requestAnimationFrame(animate);

    if (currentTime) {
        var frameTime = newTime - currentTime;
        if (frameTime > 250) frameTime = 250;
        accumulator += frameTime;

        while (accumulator >= dt) {
            previousState = currentState;
            currentState = integrate(currentState, t, dt);
            t += dt;
            accumulator -= dt;
        }

        var alpha = accumulator / dt;
        var interpolatedPosition =
            currentState.x * alpha + previousState.x * (1 - alpha);

        render(interpolatedPosition);
    }

    currentTime = newTime;
}

// Move simulation forward
function integrate(state, time, fixedDeltaTime) {
    var fixedDeltaTimeSeconds = fixedDeltaTime / 1000;
    var f = (200 - state.x) * 3;
    var v = state.v + f * fixedDeltaTimeSeconds;
    var x = state.x + v * fixedDeltaTimeSeconds;
    return { x: x, v: v };
}

// Render the scene
function render(position) {
    // Clear
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw circle
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(position, 100, 50, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}
