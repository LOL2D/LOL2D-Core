const SurrenderReason = {
    FAILED: 0,
    TOO_EARLY: 1,
    TOO_QUICKLY: 2,
    ALREADY_VOTED: 3,
    PASSED: 4,
};

Object.freeze(SurrenderReason);
export default SurrenderReason;
