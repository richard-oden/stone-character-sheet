class Action {
    constructor(name, type, rolls, description, range = null, remainingUses = null, totalUses = null) {
        this.name = name,
        this.type = type,
        this.rolls = rolls,
        this.description = description,
        this.range = range,
        this.remainingUses = remainingUses,
        this.totalUses = totalUses
    }

    static getActionLookUp(character)  {
        return [
            // Move actions:
            new Action('Move', 'Move (Basic)', null, 'Cost: 5ft per 5ft'),
            new Action('Climb', 'Move (Basic)', `${character.skills['Athletics'].fullName}: ${character.skills['Athletics'].roll}`, 
                'Cost: 10ft per 5ft'),
            new Action('Swim', 'Move (Basic)', `${character.skills['Athletics'].fullName}: ${character.skills['Athletics'].roll}`, 
                'Cost: 10ft per 5ft'),
            new Action('Jump', 'Move (Basic)', `${character.skills['Athletics'].fullName}: ${character.skills['Athletics'].roll} / ${character.skills['Acrobatics'].fullName}: ${character.skills['Acrobatics'].roll}`, 'Cost: 5ft per 5ft'),
            new Action('Crawl', 'Move (Basic)', null, 'Cost: 10ft per 5ft'),
            new Action('Drop prone', 'Move (Basic)', null, 'Cost: 0ft'),
            new Action('Stand up', 'Move (Basic)', null, 'Cost: half movement speed'),
            
            // Standard actions:
            new Action('Grapple', 'Action (Basic)', `${character.skills['Athletics'].fullName}: ${character.skills['Athletics'].roll}`, 
                'Attack. Athletics check contested by target\'s Athletics or Acrobatics check.'),
            new Action('Shove', 'Action (Basic)', `${character.skills['Athletics'].fullName}: ${character.skills['Athletics'].roll}`, 
                'Attack. Athletics check contested by target\'s Athletics or Acrobatics check. Knock target prone or push 5 ft away.'),
            new Action('Dash', 'Action (Basic)', null,
                'Movement speed is doubled, after applying modifiers.'),
            new Action('Disengage', 'Action (Basic)', null,
                'Movement doesn\'t provoke opportunity attacks.'),
            new Action('Dodge', 'Action (Basic)', null,
                'Until next turn, attacks against you are at disadvantage if you can see the attacker, and you have advantage on DEX saving throws.'),
            new Action('Help', 'Action (Basic)', null,
                'Give ally advantage on an ability check or attack until start of your next turn.'),
            new Action('Ready', 'Action (Basic)', null,
                'Hold an action until a specific circumstance occurs, then use your reaction to do the action.'),
            new Action('Drink potion', 'Action (Basic)', null, null),
            
            // Reactions:
            new Action('Opportunity Attack', 'Reaction (Basic)', null,
                'Make one melee attack against an enemy than leaves your reach.'),
        ];
    }
}

module.exports = Action;