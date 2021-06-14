const DamageSource = {
    /// Unmitigated.
    RAW: 1,

    /// Executes, pure.
    INTERNALRAW: 2,

    /// Buff spell dots.
    PERIODIC: 3,

    /// Causes Proc (spell specific or attack based) events to fire, pre initial damage.
    PROC: 4,

    /// On proc.
    REACTIVE: 5,

    /// Unknown, self-explanatory?
    ONDEATH: 6,

    /// Single instance spell damage.
    SPELL: 7,

    /// Attack based spells (proc onhit effects).
    ATTACK: 8,

    /// Buff Summoner spell damage (single and multi instance)
    DEFAULT: 9,

    /// Any area based spells.
    SPELLAOE: 10,

    /// Passive, on update or timed repeat.
    SPELLPERSIST: 11,

    /// Unknown, self-explanatory?
    PET: 12,
};
