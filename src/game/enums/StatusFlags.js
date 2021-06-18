const StatusFlags = {
    CanCast: 1 << 1, // Có thể dùng chiêu
    CanMove: 1 << 2, // Có thể di chuyển
    CanAttack: 1 << 3, // Có thể đánh thường
    NoRender: 1 << 4, // Tàng hình
};

Object.freeze(StatusFlags);
export default StatusFlags;
