/// Determines how a buff should be treated when added.

const BuffAddType = {
    /// Replaces any existing buffs of the same name.
    REPLACE_EXISTING: 1,

    /// Restarts the timer on any buffs of the same name already applied to the buff's target.
    RENEW_EXISTING: 2,

    /// Adds a stack to any buffs of the same name already applied and restarts all other stacks' timers.
    /// Functionally treated as a single buff with a single timer and stack count.
    STACKS_AND_RENEWS: 3,

    /// Adds a completely new buff instance to the buff target regardless of any other buffs of the same name applied.
    /// Inherits stack count of the oldest buff of the same name.
    STACKS_AND_OVERLAPS: 4,
};
