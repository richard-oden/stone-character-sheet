const stone = {
    name: 'Stone',
    class: 'Fighter',
    subclass: 'Rune Knight',
    race: 'Warforged',
    subrace: null,
    level: 11,

    currentHitPoints: 127,
    maxHitPoints: 127,
    hitDie: "d10",

    abilityScores: {
        STR: 18,
        DEX: 10,
        CON: 18,
        INT: 14,
        WIS: 12,
        CHA: 8
    },

    proficiencies: {
        savingThrows: ['STR', 'CON'],
        skills: ['Athletics', 'Insight', 'Investigation', 'Perception', 'Religion'],
        languages: ['Common', 'Gnomish', 'Giant', 'Primordial'],
        tools: ['Cartographer\'s Tools', 'Dragonchess Set'],
        weapons: ['Simple', 'Martial'],
        armor: ['Light', 'Medium', 'Heavy', 'Shields']
    },

    expertise: {
        skills: ['History']
    },

    weapons: [
        new Weapon('Kanabo +1 (Maul +1)', 'Martial', ['Heavy', 'Two-Handed'], 
            '5', {Bludgeoning: "2d6"}, enchantment = 1),
        new Weapon('Javelin of Lightning', 'Simple', ['Range', 'Thrown'],
            '30/120', {Piercing: '1d6', Lightning: '4d6'}, 13,
            description = `This Javelin is a Magic Weapon. When you hurl it and speak its Command Word, it transforms into a bolt of lightning, forming a line 5 feet wide that extends out from you to a target within 120 feet. Each creature in the line excluding you and the target must make a DC 13 Dexterity saving throw, taking 4d6 lightning damage on a failed save, and half as much damage on a successful one. The Lightning Bolt turns back into a Javelin when it reaches the target. Make a ranged weapon Attack against the target. On a hit, the target takes damage from the Javelin plus 4d6 lightning damage.
            The javelin's property can't be used again until the next dawn. In the meantime, the Javelin can still be used as a Magic Weapon.`),
        new Weapon('Staff of Scorching Ray', 'N/A', 'N/A', 120, {Fire: '6d6'},
            description = 'You create three rays of fire and hurl them at targets within range. You can hurl them at one target or several. Make a ranged spell attack for each ray. On a hit, the target takes 2d6 fire damage.')
    ],
    armor: [
        new Armor('Plate Armor', 'Heavy', 18)
    ],
    items: [
        new Item('Enchantment of Protection (Cloak of Protection)', 
            'You gain a +1 bonus to AC and Saving Throws while you wear this cloak.', 
            true),
        new Item('Auto Stabilizer (Periapt of Wound Closure)', 
            'While you wear this pendant, you stabilize whenever you are dying at the start of Your Turn. In addition, whenever you roll a Hit Die to regain Hit Points, double the number of Hit Points it restores.', 
            true),
        new Item('Clockwork Amulet', 
            'When you make an attack roll while wearing the amulet, you can forgo rolling the d20 to get a 10 on the die. Once used, this property can\'t be used again until the next dawn.'),
        new Item('Ring of Mind Shielding', 
            `While wearing this ring, you are immune to magic that allows other creatures to read your thoughts, determine whether you are lying, know your Alignment, or know your creature type. Creatures can telepathically communicate with you only if you allow it.
            You can use an action to cause the ring to become Invisible until you use another action to make it visible, until you remove the ring, or until you die.
            If you die while wearing the ring, your soul enters it, unless it already houses a soul. You can remain in the ring or depart for The Afterlife. As long as your soul is in the ring, you can telepathically communicate with any creature wearing it. A wearer can't prevent this Telepathic Communication.`,
            true),
        new Item('Superior Healing Potion',
            `You regain 8d4 + 8 hit points when you drink this potion. The potion's red liquid glimmers when agitated.`)
    ],
    wealth: 432,

    resources: {
        augmentSize: {currentUses: 4, maxUses: 4},
        runicShield: {currentUses: 4, maxUses: 4},
        hillRune: {currentUses: 1, maxUses: 1},
        stoneRune: {currentUses: 1, maxUses: 1},
        fireRune: {currentUses: 1, maxUses: 1},
        stormRune: {currentUses: 1, maxUses: 1},
        actionSurge: {currentUses: 1, maxUses: 1},
        secondWind: {currentUses: 1, maxUses: 1},
        indomitable: {currentUses: 1, maxUses: 1},
        scorchingRay: {currentUses: 8, maxUses: 10}
    },

    get armorClass() {
        let ac = 0;
        this.armor.forEach(armor => {
            ac += armor.armorClass;
            if (armor.type === 'Light') {
                ac += this.abilityScoreMods['DEX'];
            } else if (armor.type === 'Medium') {
                ac += Math.min(this.abilityScoreMods['DEX'], 2);
            }
        });
        if (!ac) ac = 10 + this.abilityScoreMods['DEX'];
        return ac;
    },

    get proficiencyBonus() {
        const profBonusesByLevel = { 1: 2, 5: 3, 9: 4, 13: 5, 17: 6 };
        const levels = Object.keys(profBonusesByLevel);
        const maxLevel = Math.max(...levels.filter(l => l <= this.level));
        return profBonusesByLevel[maxLevel];
    },

    get abilityScoreMods() {
        const mods = {};
        for (const score in this.abilityScores) {
            mods[score] = (this.abilityScores[score] - 10) / 2;
        }
        return mods;
    },

    get initiative() {
        this.abilityScoreMods.DEX;
    },

    get savingThrows() {
        const throws = {};
        for (const score in this.abilityScores) {
            throws[score] = this.abilityScoreMods[score]
                + (this.proficiencies.savingThrows.includes(score) ? 
                    this.proficiencyBonus : 0)
                + 1 // Cloak of Protection;
        }
        return throws;
    },

    get skills() {
        const skills = {};
        for (const skill of Skill.skillsLookUp) {
            let mod = this.abilityScoreMods[skill.ability];
            if (this.expertise.skills.includes(skill.name)) {
                mod += this.proficiencyBonus * 2;
            } else if (this.proficiencies.skills.includes(skill.name)) {
                mod += this.proficiencyBonus;
            }
            skills[skill.fullName] = mod;
        }
        return skills;
    }
}