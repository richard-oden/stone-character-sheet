class Item {
    constructor(name, description = "", requiresAttunement = false) {
        this.name = name;
        this.description = description;
        this.attunement = requiresAttunement;
    }
}

module.exports = Item;