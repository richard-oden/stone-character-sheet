class Action {
    constructor(name, type, rolls, description) {
        this.name = name;
        this.type = type;
        this.rolls = rolls;
        this.description = description;
    }

    static getActionLookUp(character)  {
        return [
            // Move actions:
            new Action('Move', 'Move', null, 'Cost: 5ft per 5ft'),
            new Action('Climb', 'Move', `${character.skills['Athletics'].fullName} - ${character.skills['Athletics'].roll}`, 
                'Cost: 10ft per 5ft'),
            new Action('Swim', 'Move', `${character.skills['Athletics'].fullName} - ${character.skills['Athletics'].roll}`, 
                'Cost: 10ft per 5ft'),
            new Action('Jump', 'Move', `${character.skills['Athletics'].fullName} - ${character.skills['Athletics'].roll} or ${character.skills['Acrobatics'].fullName} - ${character.skills['Acrobatics'].roll}`, 'Cost: 5ft per 5ft'),
            new Action('Crawl', 'Move', null, 'Cost: 10ft per 5ft'),
            new Action('Drop prone', 'Move', null, 'Cost: 0ft'),
            new Action('Stand up', 'Move', null, 'Cost: half movement speed'),
            
            // Standard actions:
            new Action('Grapple', 'Action', `${character.skills['Athletics'].fullName} - ${character.skills['Athletics'].roll}`, 
                'Attack. Athletics check contested by target\'s Athletics or Acrobatics check.'),
            new Action('Shove', 'Action', `${character.skills['Athletics'].fullName} - ${character.skills['Athletics'].roll}`, 
                'Attack. Athletics check contested by target\'s Athletics or Acrobatics check. Knock target prone or push 5 ft away.'),
            new Action('Dash', 'Action', null,
                'Movement speed is doubled, after applying modifiers.'),
            new Action('Disengage', 'Action', null,
                'Movement doesn\'t provoke opportunity attacks.'),
            new Action('Dodge', 'Action', null,
                'Until next turn, attacks against you are at disadvantage if you can see the attacker, and you have advantage on DEX saving throws.'),
            new Action('Help', 'Action', null,
                'Give ally advantage on an ability check or attack until start of your next turn.'),
            new Action('Ready', 'Action', null,
                'Hold an action until a specific circumstance occurs, then use your reaction to do the action.'),
            
            // Reactions:
            new Action('Opportunity Attack', 'Reaction', null,
                'Make one melee attack against an enemy than leaves your reach.'),
        ];
    }
}