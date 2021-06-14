const Channel = {
    HANDSHAKE: 0,
    C2S: 1,
    GAMEPLAY: 2,
    S2C: 3,
    LOW_PRIORITY: 4,
    COMMUNICATION: 5,
    LOADING_SCREEN: 7,
};

Object.freeze(Channel);
export default Channel;
