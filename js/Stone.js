const stone = {
    name: 'Stone',
    class: 'Fighter',
    subclass: 'Rune Knight',
    race: 'Warforged',
    subrace: null,
    level: 11,

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