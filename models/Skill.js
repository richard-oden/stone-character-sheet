class Skill {
    constructor(skillName, skillAbility) {
        this.name = skillName;
        this.ability = skillAbility;
        this.fullName = `${skillName} (${skillAbility})`;
    }

    static skillsLookUp = [
        new Skill('Acrobatics', 'DEX'),
        new Skill('Animal Handling', 'WIS'),
        new Skill('Arcana', 'INT'),
        new Skill('Athletics', 'STR'),
        new Skill('Deception', 'CHA'),
        new Skill('History', 'INT'),
        new Skill('Insight', 'WIS'),
        new Skill('Intimidation', 'CHA'),
        new Skill('Investigation', 'INT'),
        new Skill('Medicine', 'WIS'),
        new Skill('Nature', 'INT'),
        new Skill('Perception', 'WIS'),
        new Skill('Performance', 'CHA'),
        new Skill('Persuasion', 'CHA'),
        new Skill('Religion', 'INT'),
        new Skill('Sleight of Hand', 'DEX'),
        new Skill('Stealth', 'DEX'),
        new Skill('Survival', 'WIS'),
    ];
}

module.exports = Skill;
