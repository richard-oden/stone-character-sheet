const stone = {
    name: 'Stone',
    class: 'Fighter',
    subclass: 'Rune Knight',
    race: 'Warforged',
    level: 11,

    currentHitPoints: 127,
    maxHitPoints: 127,
    hitDie: 'd10',
    remainingHitDice: 11,
    speed: 30,
    vision: "Dark Vision: 120ft",
    inspiration: false,

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
        new Weapon('Kanabo (Maul +1)', 'Martial', ['Heavy', 'Two-Handed'], 
            range = '5', {bludgeoning: "2d6"}, enchantment = 1),
        new Weapon('Javelin of Lightning', 'Simple', ['Range', 'Thrown'],
            range = '30/120', {piercing: '1d6', lightning: '4d6'}, enchantment = 0, savingThrow = 13,
            description = `This Javelin is a Magic Weapon. When you hurl it and speak its Command Word, it transforms into a bolt of lightning, forming a line 5 feet wide that extends out from you to a target within 120 feet. Each creature in the line excluding you and the target must make a DC 13 Dexterity saving throw, taking 4d6 lightning damage on a failed save, and half as much damage on a successful one. The Lightning Bolt turns back into a Javelin when it reaches the target. Make a ranged weapon Attack against the target. On a hit, the target takes damage from the Javelin plus 4d6 lightning damage.
            The javelin's property can't be used again until the next dawn. In the meantime, the Javelin can still be used as a Magic Weapon.`),
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

    advantage: [
            "STR Checks (during Augmented Size)",
            "STR Saving throws (during Augmented Size)",
            "Insight (while Stone Rune is worn)",
            "Arcana (while Storm Rune is worn)",
            "Poison Saves (Constructed Resilience)"
    ],

    disadvantage: [
        "Stealth Checks (while wearing Plate Armor)"
    ],

    resistances: [
        "Poison (Constructed Resilience)",
        "Bludgeoning, Piercing, and Slashing (while Hill Rune is active)"
    ],

    immunities: [
        "Disease (Constructed Resilience)",
        "Magic that induces sleep (Constructed Resilience)"
    ],

    deathSaves: {
        successes: 0,
        failures: 0
    },

    get maxHitDice() {return this.level},

    get armorClass() {
        let ac = 0;
        this.armor.forEach(armor => {
            ac += armor.armorClass + armor.enchantment;
            if (armor.type === 'Light') {
                ac += this.abilityScoreMods['DEX'];
            } else if (armor.type === 'Medium') {
                ac += Math.min(this.abilityScoreMods['DEX'], 2);
            }
        });
        if (!ac) ac = 10 + this.abilityScoreMods['DEX'];
        ac += 1; // Cloak of Protection
        ac += 1; // Constructed Resilience
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

            skills[skill.name] = {
                name: skill.name, 
                ability: skill.ability,
                fullName: skill.fullName,
                mod: mod, 
                roll: `d20${mod >= 0 ? '+' : '-'}${mod}`
            };
        }
        return skills;
    },

    get actions() {
        const basicActions = Action.getActionLookUp(this);

        const createActionFromWeapon = (weapon, extraAttackMod = 0, extraDamageMod = 0) => {
            let mod = this.abilityScoreMods.STR;
            if (weapon.enchantment) mod += weapon.enchantment;

            let attackMod = mod + extraAttackMod + (this.proficiencies.weapons.includes(weapon.type) ? this.proficiencyBonus : 0);
            let damageMod = mod + extraDamageMod;

            let rollsString = `Attack: d20+${attackMod} / Damage: `;
            for (const damageType of Object.keys(weapon.damage)) {
                rollsString += weapon.damage[damageType];
                if (Object.keys(weapon.damage)[0] == damageType) rollsString += (mod >= 0 ? '+' : '-') + damageMod;
                rollsString += ` ${damageType} `;
            }

            return new Action(`Attack with ${weapon.name}`, 'Action', rollsString, weapon.description, weapon.range);
        };
        
        const weaponAttackActions = this.weapons.map(weapon => createActionFromWeapon(weapon));
        const gwmAttackActions = this.weapons.filter(w => w.properties.includes('Heavy')).map(weapon => {
            const tempAction = createActionFromWeapon(weapon, -5, 10);
            tempAction.name = 'GWM ' + tempAction.name;
            return tempAction;
        });

        const otherActions = [
            new Action('Second Wind', 'Bonus Action', `1d10+${this.level}`,
                'You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again.',
                usesRemaining = 1, totalUses = 1),
            new Action('Interception', 'Reaction', `1d10+${this.proficiencyBonus}`,
                'When a creature you can see hits a target, other than you, within 5 feet of you with an attack, you can use your reaction to reduce the damage the target takes by 1d10 + your proficiency bonus (to a minimum of 0 damage). You must be wielding a shield or a simple or martial weapon to use this reaction.',
                range = 5),
            new Action('Invoke Fire Rune', 'Free Action', `Damage: 2d6 fire`,
                `In addition, when you hit a creature with an attack using a weapon, you can invoke the rune to summon fiery shackles: the target takes an extra 2d6 fire damage, and it must succeed on a Strength (DC ${8 + this.proficiencyBonus + this.abilityScoreMods.CON}) saving throw or be restrained for 1 minute. While restrained by the shackles, the target takes 2d6 fire damage at the start of each of its turns. The target can repeat the saving throw at the end of each of its turns, banishing the shackles on a success. Once you invoke this rune, you can’t do so again until you finish a short or long rest.`,
                usesRemaining = 1, totalUses = this.level < 15 ? 1 : 2),
            new Action('Invoke Stone Rune', 'Reaction', null,
                `In addition, when a creature you can see ends its turn within 30 feet of you, you can use your reaction to invoke the rune and force the creature to make a Wisdom (DC ${8 + this.proficiencyBonus + this.abilityScoreMods.CON}) saving throw. Unless the save succeeds, the creature is charmed by you for 1 minute. While charmed in this way, the creature has a speed of 0 and is incapacitated, descending into a dreamy stupor. The creature repeats the saving throw at the end of each of its turns, ending the effect on a success. Once you invoke this rune, you can’t do so again until you finish a short or long rest.`,
                range = 30, usesRemaining = 1, totalUses = this.level < 15 ? 1 : 2),
            new Action('Invoke Hill Rune', 'Bonus Action', null,
                `In addition, you can invoke the rune as a bonus action, gaining resistance to bludgeoning, piercing, and slashing damage for 1 minute. Once you invoke this rune, you can’t do so again until you finish a short or long rest.`,
                usesRemaining = 1, totalUses = this.level < 15 ? 1 : 2),
            new Action('Invoke Storm Rune', 'Bonus Action', null,
                `In addition, you can invoke the rune as a bonus action to enter a prophetic state for 1 minute or until you’re incapacitated. Until the state ends, when you or another creature you can see within 60 feet of you makes an attack roll, a saving throw, or an ability check, you can use your reaction to cause the roll to have advantage or disadvantage. Once you invoke this rune, you can’t do so again until you finish a short or long rest.`,
                range = 60, usesRemaining = 1, totalUses = this.level < 15 ? 1 : 2),
            new Action('Invoke Storm Rune (while active)', 'Reaction', null,
                `In addition, you can invoke the rune as a bonus action to enter a prophetic state for 1 minute or until you’re incapacitated. Until the state ends, when you or another creature you can see within 60 feet of you makes an attack roll, a saving throw, or an ability check, you can use your reaction to cause the roll to have advantage or disadvantage. Once you invoke this rune, you can’t do so again until you finish a short or long rest.`,
                range = 60),
            new Action('Augment Size (Giant\'s Might)', 'Bonus action', null,
                `As a bonus action, you magically gain the following benefits, which last for 1 minute:
    - If you are smaller than Large, you become Large, along with anything you are wearing. If you lack the room to become Large, your size doesn’t change.
    - You have advantage on Strength checks and Strength saving throws.
    - Once on each of your turns, one of your attacks with a weapon or an unarmed strike can deal an extra 1d6 damage to a target on a hit.
You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses of it when you finish a long rest.`,
                usesRemaining = 4, totalUses = this.proficiencyBonus),
            new Action('Augmented Strength (Giant\'s Might)', 'Free action', this.level < 18 ? '1d8' : '1d10',
                `Once on each of your turns, one of your attacks with a weapon or an unarmed strike can deal an extra 1d6 damage to a target on a hit.`),
            new Action('Runic Shield', 'Reaction', null,
                `When another creature you can see within 60 feet of you is hit by an attack roll, you can use your reaction to force the attacker to reroll the d20 and use the new roll.
You can use this feature a number of times equal to your proficiency bonus, and you regain all expended uses when you finish a long rest.`,
                range = 60, usesRemaining = 4, totalUses = this.proficiencyBonus),
            new Action('Action Surge', 'Bonus Action', null,
                `On Your Turn, you can take one additional action on top of your regular action and a possible Bonus Action.
Once you use this feature, you must finish a short or Long Rest before you can use it again. Starting at 17th level, you can use it twice before a rest, but only once on the same turn.`,
                usesRemaining = 1, totalUses = this.level < 17 ? 1 : 2),
            new Action('Indomitable', 'Free Action', null,
                `Beginning at 9th level, you can reroll a saving throw that you fail. If you do so, you must use the new roll, and you can't use this feature again until you finish a Long Rest.
You can use this feature twice between long rests starting at 13th level and three times between long rests starting at 17th level.`,
                usesRemaining = 1, totalUses = this.level < 17 ? (this.level < 13 ? 1 : 2) : 3),
            new Action('Clockwork Amulet', 'Free Action', null,
                `When you make an attack roll while wearing the amulet, you can forgo rolling the d20 to get a 10 on the die. Once used, this property can't be used again until the next dawn.`,
                usesRemaining = 1, totalUses = 1),
        ];

        return [...basicActions, ...weaponAttackActions, ...gwmAttackActions, ...otherActions];
    },
}