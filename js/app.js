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

const getClasses = (queryItem, queryType = '', profArr = []) => {
    const isProf = profArr.includes(queryItem);
    const isAdv = stone.advantage.some(a => 
        a.toLowerCase().includes(queryItem.toLowerCase()) 
        && a.toLowerCase().includes(queryType.toLowerCase()));
    const isDisAdv = stone.disadvantage.some(a => 
        a.toLowerCase().includes(queryItem.toLowerCase()) 
        && a.toLowerCase().includes(queryType.toLowerCase()));
    
    let style = isProf ? ' proficient' : '';
    if (isAdv && isDisAdv) {
        return style;
    } else if (isAdv) {
        return style + ' advantage';
    } else if (isDisAdv) {
        return style + ' disadvantage'
    }
    return style;
}

characterName.textContent = stone.name;
basicInfo.textContent = `lvl ${stone.level} ${stone.race} ${stone.subclass} ${stone.class}`;

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
            <div class="fig-l${getClasses(abil, 'check')}">${score} / ${mod > 0 ? '+' : ''}${mod}</div>
            <div class="fig-m${getClasses(abil, 'saving throw', stone.proficiencies.savingThrows)}">
                (${savingThrow > 0 ? '+' : ''}${savingThrow})
            </div>
        </div>
    `;
}
topRowHTML += 
`
    <div class="death-saves col bordered stat-card">
        <small>Death Saves</small>
        <div class="row fig-xl">
            <span>&nbsp${stone.deathSaves.successes}</span>
            <span>:</span>
            <span>${stone.deathSaves.failures}&nbsp</span>
        </div>
        <div class="row">
            <small>success</small>
            <small>failure</small>
        </div>
    </div>
`;
topRow.innerHTML = topRowHTML;

skillsHTML = '';
for (const skill in stone.skills) {
    skillsHTML +=
    `
        <div class="grid skill border-bottom${getClasses(skill, '', stone.proficiencies.skills)}">
            <span class="skill-mod">${stone.skills[skill].mod}</span>
            <span>${stone.skills[skill].name}</span>
            <span>(${stone.skills[skill].ability})</span>
        </div>
    `;
}
skills.innerHTML = skillsHTML;

basicStats.innerHTML +=
`
    <div class="hit-points col bordered stat-card">
        <small>Hit Points</small>
        <div class="fig-l">${stone.currentHitPoints}+${stone.tempHitPoints}</div>
        <small>${stone.maxHitPoints} total</small>
    </div>
    <div class="hit-dice col bordered stat-card">
        <small>Hit Dice</small>
        <div class="fig-l"> ${stone.currentHitDice}</div>
        <small>${stone.maxHitDice}${stone.hitDie} total</small>
    </div>
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
    <div class="speed col bordered stat-card">
        <small>Speed</small>
        <div class="fig-l">
            ${stone.speed}
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

wealth.innerHTML =
`
    <small>Wealth</small>
    <div class="fig-m">${stone.wealth}</div>
`;

let situationalInfoHTML = '';
situationalInfoHTML += 
`<h3 class="advantage">Advantage</h3>
    <div class="col border-bottom-l">`
        for (const adv of stone.advantage) {
            situationalInfoHTML += `<span class="small">${adv}</span>`;
        }
situationalInfoHTML += 
`   </div>
<h3 class="disadvantage">Disadvantage</h3>
    <div class="col border-bottom-l">`
        for (const disadv of stone.disadvantage) {
            situationalInfoHTML += `<span class="small">${disadv}</span>`;
        }
situationalInfoHTML += 
`   </div>
<h3 class="proficient">Proficiencies</h3>
    <div class="col border-bottom-l">`
        for (const prof in stone.proficiencies) {
            situationalInfoHTML += 
            `<span class="small grid prof-category">
                <b>${unCamelCase(prof)}:&nbsp</b>
                <span>${toCommaSeparatedList(stone.proficiencies[prof])}</span>
            </span>`;
        }
situationalInfoHTML += '</div>'
situationalInfo.innerHTML = situationalInfoHTML;

const populateInventory = arr => {
    let inventoryHTML = '';
    for (const item of arr) {
        const attunementHTML = item.attunement ? 
        `<span class="attuned row">
            <small>Attuned:&nbsp</small>
            <input class="small" type="checkbox" ${stone.attunedItemNames.includes(item.name) ? ' checked' : ''}></input>
        </span>` : '';

        inventoryHTML +=
        `
            <div class="item col bordered">
                <div class="item-info border-bottom grid">
                    <input type="checkbox" class="toggle-desc small"${item.description ? '' : ' disabled'}></input>
                    <span>${item.name}</span>
                    ${item.armorClass ? `<span class="small">AC: ${item.armorClass}</span>` : ''}
                    ${item.damage ? `<span class="small">${item.getRollsString(stone)}</span>` : ''}
                    ${item.range ? `<span class="small">${item.range}ft</span>` : ''}
                    ${attunementHTML}
                </div>
                ${item.description ? `<div class="description small">${item.description}</div>` : ''}
            </div>
        `;
    }
    items.innerHTML = inventoryHTML;
}

const applyInventoryFilter = arr => {
    const includeWeapons = document.querySelector('#toggle-weapons').checked;
    const includeArmor = document.querySelector('#toggle-armor').checked;
    const includeMisc = document.querySelector('#toggle-misc').checked;

    let tempArr = [];
    if (!includeWeapons && !includeArmor && !includeMisc) {
        return arr;
    }
    if (includeWeapons) {
        tempArr.push(...[arr.filter(i => i.constructor.name === 'Weapon')]);
    }
    if (includeArmor) { 
        tempArr.push(...[arr.filter(i => i.constructor.name === 'Armor')]);
    } 
    if (includeMisc) {
        tempArr.push(...[arr.filter(i => i.constructor.name === 'Item')]);
    }
    return tempArr;
}

const toggleBtns = document.querySelectorAll('.toggle-btn-input');
for (const toggleBtn of toggleBtns) {
    toggleBtn.addEventListener('change', event => {
        const label = document.querySelector(`label[for=${event.target.id}]`);
        label.style.backgroundColor = event.target.checked ? 'var(--active-background)' : 'var(--highlight-background)';
    });
}

populateInventory(applyInventoryFilter(stone.inventory));