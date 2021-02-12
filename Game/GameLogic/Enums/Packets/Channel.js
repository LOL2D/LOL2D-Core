const Channel = {
    CHL_HANDSHAKE: 0,
    CHL_C2S: 1,
    CHL_GAMEPLAY: 2,
    CHL_S2C: 3,
    CHL_LOW_PRIORITY: 4,
    CHL_COMMUNICATION: 5,
    CHL_LOADING_SCREEN: 7,
};

Object.freeze(Channel);
export default Channel;
