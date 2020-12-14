/* 
    ------- quy ước đặt tên class -------
    <Ability>Object

    Trong đó:
        <Ability> : tên của chiêu thức tạo ra instant của class AbilityObject này

    Ví dụ: Ahri có chiêu W tên là FoxFire
        thì chiêu này sẽ tạo ra AbiltityObject tên là FoxFireObject

    => Nói ngắn gọn: Phải thêm hậu tố Object vào sau tên chiêu thức
*/

class AbilityObjectName extends AbilityObjectCore {
    constructor(config = {}) {
        // get value from config
        super(config);

        // override

        // custom attributes
    }

    // override
    show() {}

    // override
    effectChampions(champions) {}

    // override
    move() {}

    // override
    checkFinished() {}

    // // other functions here
}
