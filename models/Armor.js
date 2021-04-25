const Item = require('./Item');

class Armor extends Item {
    constructor(name, armorType, armorClass, 
        enchantment = 0, description = "", requiresAttunement = false) {
        super(name, description, requiresAttunement);
        this.type = armorType;
        this.armorClass = armorClass;
        this.enchantment = enchantment;
    }
}

module.exports = Armor;