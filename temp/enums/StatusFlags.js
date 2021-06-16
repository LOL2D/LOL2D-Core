// Enum of all statuses that can be applied to a unit.
const StatusFlags = {
    CallForHelpSuppressor: 1 << 0, // ??
    CanAttack: 1 << 1, // Có thể đánh thường
    CanCast: 1 << 2, // Có thể dùng chiêu
    CanMove: 1 << 3, // Có thể di chuyển
    CanMoveEver: 1 << 4, // ??
    Charmed: 1 << 5, // Bị quyến rũ (E Ahri, ..)
    DisableAmbientGold: 1 << 6, // Không nhận được vàng từ lính chết xung quanh
    Disarmed: 1 << 7, // Không đánh thường được
    Feared: 1 << 8, // Sợ hãi
    ForceRenderParticles: 1 << 9, // ??
    GhostProof: 1 << 10, // ?? Flee?
    Ghosted: 1 << 11, // ??
    IgnoreCallForHelp: 1 << 12, // ??
    Immovable: 1 << 13, // Không thể di chuyển
    Invulnerable: 1 << 14, // Miễn nhiễm mọi sát thương 
    MagicImmune: 1 << 15, // Miễn nhiềm sát thương phép thuật
    NearSighted: 1 << 16, // Giảm tầm nhìn
    Netted: 1 << 17, // Đánh lưới, Bị làm chậm ??
    NoRender: 1 << 18, // Tàng hình
    Pacified: 1 << 19, // Làm dịu ??
    PhysicalImmune: 1 << 20, // Miễn nhiễm sát thương vật lý
    RevealSpecificUnit: 1 << 21, // Tiết lộ đơn vị cụ thể ??
    Rooted: 1 << 22, // Bị sa lầy
    Silenced: 1 << 23, // Bị câm lặng - không thể dùng chiêu
    Sleep: 1 << 24, // Ngủ
    Stealthed: 1 << 25, // Bị đánh cắp ??
    Stunned: 1 << 26, // Bị làm choáng
    SuppressCallForHelp: 1 << 27, // ??
    Suppressed: 1 << 28, // Bị đàn áp ??
    Targetable: 1 << 29, // Có thể chọn làm mục tiêu
    Taunted: 1 << 30, // Bị khiêu kích (E Rammus)
};

Object.freeze(StatusFlags);
export default StatusFlags;
