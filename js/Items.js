class Item {
    constructor(name, description = "", requiresAttunement = false) {
        this.name = name;
        this.description = description;
        this.attunement = requiresAttunement;
    }
}

class Armor extends Item {
    constructor(name, armorType, armorClass, 
        enchantment = 0, description = "", requiresAttunement = false) {
        super(name, description, requiresAttunement);
        this.type = armorType;
        this.armorClass = armorClass;
        this.enchantment = enchantment;
    }
}

class Weapon extends Item {
    constructor(name, weaponType, properties, range, damage, 
        enchantment = 0, description = "", requiresAttunement = false) {
        super(name, description, requiresAttunement);
        this.type = weaponType;
        this.properties = properties;
        this.range = range;
        this.damage = damage;
        this.enchantment = enchantment;
    }
}