const DamageResultType = {
    INVULNERABLE: 0x0,
    INVULNERABLENOMESSAGE: 0x1,
    DODGE: 0x2,
    CRITICAL: 0x3,
    NORMAL: 0x4,
    MISS: 0x5,
};

Object.freeze(DamageResultType);
export default DamageResultType;
