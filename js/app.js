const characterName = document.querySelector('.char-name');
const basicInfo = document.querySelector('.basic-info');
const topRow = document.querySelector('.top-row');
const basicStats = document.querySelector('.basic-stats');
const skills = document.querySelector('.skills');
const hp = document.querySelector('.hp');
const inventory = document.querySelector('.inventory');
const wealth = document.querySelector('.wealth');
const inventoryFilter = document.querySelector('.inventory-filter');
const items = document.querySelector('.items');
const situationalInfo = document.querySelector('.situational-info');
const proficiencies = document.querySelector('.proficiencies');
const actionsFilter = document.querySelector('.actions-filter');
const actions = document.querySelector('.actions');

characterName.textContent = stone.name;
basicInfo.textContent = `level ${stone.level} ${stone.race} ${stone.subclass} ${stone.class}`;

let topRowHTML = '';
for (const abil in stone.abilityScores) {
    const label = abil;
    const score = stone.abilityScores[abil];
    const mod = stone.abilityScoreMods[abil]
    const savingThrow = stone.savingThrows[abil];

    topRowHTML += 
    `
        <div class="abil col bordered stat-card">
            <small>${label}</small>
            <div class="fig-l">${score} / ${mod > 0 ? '+' : ''}${mod}</div>
            <div class="save">(${savingThrow > 0 ? '+' : ''}${savingThrow})</div>
        </div>
    `;
}
topRowHTML += 
`
    <div class="death-saves col bordered stat-card">
        <small>Death Saves</small>
        <div class="num-death-saves">
            <span style="color: green" >${stone.deathSaves.successes}</span> :
            <span style="color: red">${stone.deathSaves.failures}</span>
        </div>
    </div>
`;
topRow.innerHTML = topRowHTML;

basicStats.innerHTML = 
`
    <div class="ac col bordered stat-card">
        <small>Armor Class</small>
        <div class="fig-l">
            ${stone.armorClass}
        </div>
    </div>
    <div class="initiative col bordered stat-card">
        <small>Initiative</small>
        <div class="fig-l">
            ${stone.initiative > 0 ? '+' : ''}${stone.initiative}
        </div>
    </div>
    <div class="prof-bonus col bordered stat-card">
        <small>Proficiency</small>
        <div class="fig-l">
            ${stone.proficiencyBonus}
        </div>
    </div>
    <div class="inspiration col bordered stat-card">
        <small>Inspriation</small>
        <div>
            <input type="checkbox" ${stone.inspiration ? ' checked' : ''}></input>
        </div>
    </div>
`;

hp.innerHTML +=
`
    <div class="hit-points col bordered stat-card">
        <small>Hit Points</small>
        <div class="fig-l">
            ${stone.currentHitPoints} / ${stone.maxHitPoints} (+${stone.tempHitPoints})
        </div>
    </div>
`;