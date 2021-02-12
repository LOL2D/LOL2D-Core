import ItemData from "./ItemData.js";

export default class ItemManager {
    constructor() {
        this._itemTypes = {};
    }

    getItemType(itemId) {
        return this._itemTypes[itemId];
    }

    safeGetItemType(itemId, defaultValue = null) {
        if (!(itemId in this._itemTypes)) {
            return defaultValue;
        }

        return this._itemTypes[itemId];
    }

    resetItems() {
        this._itemTypes = {};
    }

    addItems(contentCollection) {
        for (let key in contentCollection) {
            let value = contentCollection[key];
            let itemType = ItemData.Load(this, value);
            this._itemTypes[key] = itemType;
        }
    }
}
