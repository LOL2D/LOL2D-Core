const LaneID = {
    BOTTOM: 1,
    MIDDLE: 2,
    TOP: 3,
    /// <summary>
    /// Used for newly created turrets, Azir turrets, Nexus turrets, and Fountain turrets.
    /// </summary>
    NONE: 4,
};

Object.freeze(LaneID);
export default LaneID;
