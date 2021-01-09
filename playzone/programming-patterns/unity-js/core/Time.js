export default class Time {
    // Static Properties
    static captureDeltaTime = 0; //Slows game playback time to allow screenshots to be saved between frames.
    static captureFramerate = 30; //The reciprocal of Time.captureDeltaTime.
    static deltaTime = 1; //The completion time in seconds since the last frame (Read Only).
    static fixedDeltaTime = 1; //The interval in seconds at which physics and other fixed frame rate updates (like MonoBehaviour's FixedUpdate) are performed.
    static fixedTime = 0; //The time the latest FixedUpdate has started (Read Only). This is the time in seconds since the start of the game.
    static fixedUnscaledDeltaTime = 0; //The timeScale-independent interval in seconds from the last fixed frame to the current one (Read Only).
    static fixedUnscaledTime = 0; //The TimeScale-independant time the latest FixedUpdate has started (Read Only). This is the time in seconds since the start of the game.
    static frameCount = 0; //The total number of frames that have passed (Read Only).
    static inFixedTimeStep; //Returns true if called inside a fixed time step callback (like MonoBehaviour's FixedUpdate), otherwise returns false.
    static maximumDeltaTime = 100; //The maximum time a frame can take. Physics and other fixed frame rate updates (like MonoBehaviour's FixedUpdate) will be performed only for this duration of time per frame.
    static maximumParticleDeltaTime = 1000; //The maximum time a frame can spend on particle updates. If the frame takes longer than this, then updates are split into multiple smaller updates.
    static realtimeSinceStartup = 0; //The real time in seconds since the game started (Read Only).
    static smoothDeltaTime = 1; //A smoothed out Time.deltaTime (Read Only).
    static time = 0; //The time at the beginning of this frame (Read Only). This is the time in seconds since the start of the game.
    static timeScale = 1; //The scale at which time passes. This can be used for slow motion effects.
    static timeSinceLevelLoad = 0; //The time this frame has started (Read Only). This is the time in seconds since the last level has been loaded.
    static unscaledDeltaTime = 0; //The timeScale-independent interval in seconds from the last frame to the current one (Read Only).
    static unscaledTime = 0; //The timeScale-independant time for this frame (Read Only). This is the time in seconds since the start of the game.
}
