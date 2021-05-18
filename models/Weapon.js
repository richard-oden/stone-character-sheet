const Item = require('./Item');
const iconDictionary = require('../icon-dictionary');

class Weapon extends Item {
    constructor(name, weaponType, properties, range, damage,
        enchantment = 0, description = "", requiresAttunement = false) {
        super(name, description, requiresAttunement),
        this.weaponType = weaponType,
        this.properties = properties,
        this.range = range,
        this.damage = damage,
        this.enchantment = enchantment,
        this.type = 'Weapon',
        this.getRollsString = (character, extraAttackMod = 0, extraDamageMod = 0) => {
            let mod = character.abilityScoreMods.STR;
            if (this.enchantment) mod += this.enchantment;
    
            let attackMod = mod + extraAttackMod + (character.proficiencies.weapons.includes(this.weaponType) ? character.proficiencyBonus : 0);
            let damageMod = mod + extraDamageMod;
    
            let rollsString = `d20+${attackMod} / `;
            for (const damageType of Object.keys(this.damage)) {
                rollsString += this.damage[damageType];
                if (Object.keys(this.damage)[0] == damageType) rollsString += (mod >= 0 ? '+' : '') + damageMod;
                rollsString += ` ${iconDictionary[damageType]} `;
            }
            return rollsString;
        }
    }
}

module.exports = Weapon;