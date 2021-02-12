export default class CollisionObject {
    getLeft(obj) {
        return obj.position.x - obj.collisionRadius - 1;
    }

    getRight(obj) {
        return obj.position.x + obj.collisionRadius + 1;
    }

    getTop(obj) {
        return obj.position.y - obj.collisionRadius - 1;
    }

    getBottom(obj) {
        return obj.position.y + obj.collisionRadius + 1;
    }
}
