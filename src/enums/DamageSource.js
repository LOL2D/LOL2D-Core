const DamageSource = {
    /// Unmitigated.
    DAMAGE_SOURCE_RAW: 1,

    /// Executes, pure.
    DAMAGE_SOURCE_INTERNALRAW: 2,

    /// Buff spell dots.
    DAMAGE_SOURCE_PERIODIC: 3,

    /// Causes Proc (spell specific or attack based) events to fire, pre initial damage.
    DAMAGE_SOURCE_PROC: 4,

    /// On proc.
    DAMAGE_SOURCE_REACTIVE: 5,

    /// Unknown, self-explanatory?
    DAMAGE_SOURCE_ONDEATH: 6,

    /// Single instance spell damage.
    DAMAGE_SOURCE_SPELL: 7,

    /// Attack based spells (proc onhit effects).
    DAMAGE_SOURCE_ATTACK: 8,

    /// Buff Summoner spell damage (single and multi instance)
    DAMAGE_SOURCE_DEFAULT: 9,

    /// Any area based spells.
    DAMAGE_SOURCE_SPELLAOE: 10,

    /// Passive, on update or timed repeat.
    DAMAGE_SOURCE_SPELLPERSIST: 11,

    /// Unknown, self-explanatory?
    DAMAGE_SOURCE_PET: 12,
};
