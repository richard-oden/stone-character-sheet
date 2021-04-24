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
const resources = document.querySelector('.resources');
const states = document.querySelector('.states');
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

const generateTopLeftCornerHTML = () => {
    characterName.textContent = stone.name;
    basicInfo.textContent = `lvl ${stone.level} ${stone.race} ${stone.subclass} ${stone.class}`;
}

const generateTopRowHTML = () => {
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
}

const generateSkillsHTML = () => {
    skillsHTML = '';
    for (const skill in stone.skills) {
        const cssClass = `${getClasses(skill, '', stone.proficiencies.skills)} ${getClasses(stone.skills[skill].ability, 'check')}`;
        skillsHTML +=
        `
            <div class="grid skill border-bottom ellipsis${cssClass}">
                <span class="skill-mod">${stone.skills[skill].mod}</span>
                <span>${stone.skills[skill].name}</span>
                <span>(${stone.skills[skill].ability})</span>
            </div>
        `;
    }
    skills.innerHTML = skillsHTML;
}

const generateBasicStatsHTML = () => {
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
            <small>Inspiration</small>
            <div>
                <input type="checkbox" ${stone.inspiration ? ' checked' : ''}></input>
            </div>
        </div>
    `;
}

const generateWealthHTML = () => {
    wealth.innerHTML =
    `
        <small>Wealth</small>
        <div class="fig-m">${stone.wealth}</div>
    `;
}

const generateSituationalInfoHTML = () => {
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
}

const generateResourcesHTML = () => {
    resourcesHTML = '';
    const limitedActions = stone.actions
        .filter(a => a.totalUses > 0)
        .sort(compareObjectsByName);
    for (const action of limitedActions) {
        resourcesHTML +=
        `
        <div class="col bordered stat-card">
            <small class="ellipsis">${shortenResourceName(action.name)}</small>
            <div class="fig-m">${action.remainingUses} / ${action.totalUses}</div>
        </div>
        `;
    }
    resources.innerHTML = resourcesHTML;
}

const generateStatesHTML = () => {
    statesHTML = '';
    const actionsWithStates = stone.actions
        .filter(a => a.state)
        .sort(compareObjectsByName);
    for (const action of actionsWithStates) {
        statesHTML +=
        `
        <div class="col bordered stat-card">
            <small class="ellipsis">${shortenResourceName(action.name)}</small>
            <div>
                <input type="checkbox" ${action.state.isActive ? ' checked' : ''}></input>
            </div>
        </div>
        `;
    }
    states.innerHTML = statesHTML;
}

const filterToggleBtns = document.querySelectorAll('.toggle-btn-input');
for (const toggleBtn of filterToggleBtns) {
    toggleBtn.addEventListener('change', event => {
        const label = document.querySelector(`label[for=${event.target.id}]`);
        label.style.backgroundColor = event.target.checked ? 'var(--active-background)' : 'var(--highlight-background)';
    });
}

const generateItemsHTML = arr => {
    let inventoryHTML = '';
    for (const item of arr) {
        const attunementHTML = item.attunement ? 
        `<span class="attuned row">
            <small>Attuned:&nbsp</small>
            <input class="small toggle-attuned" type="checkbox" ${stone.attunedItemNames.includes(item.name) ? ' checked' : ''}></input>
        </span>` : '';

        inventoryHTML +=
        `
            <div class="item col bordered">
                <div class="item-info grid">
                    <input type="checkbox" class="toggle-desc small"${item.description ? '' : ' disabled'}></input>
                    <span class="name">${item.name}</span>
                    ${item.armorClass ? `<span class="small">AC: ${item.armorClass}</span>` : ''}
                    ${item.damage ? `<span class="small">${item.getRollsString(stone)}</span>` : ''}
                    ${item.range ? `<span class="small">${item.range}ft</span>` : ''}
                    ${attunementHTML}
                </div>
                ${item.description ? `<div class="description small border-top" style="display: none">${item.description}</div>` : ''}
            </div>
        `;
    }
    items.innerHTML = inventoryHTML;

    const itemCards = document.querySelectorAll('.item');
    for (const itemCard of itemCards) {
        itemCard.addEventListener('click', event => {
            if (event.target.classList.contains('toggle-desc')) {
                const description = itemCard.querySelector('.description');
                description.style.display = event.target.checked ? 'block' : 'none';
            } else if (event.target.classList.contains('toggle-attuned')) {
                const name = itemCard.querySelector('.name').textContent;
                if (event.target.checked && stone.attunedItemNames.includes(name)) {
                    stone.attunedItemNames.push(name);
                } else {
                    stone.attunedItemNames = stone.attunedItemNames.filter(_ => _ !== name);
                }
            }
        });
    }
}

const generateActionsHTML = arr => {
    let actionsColLeftHTML = '';
    let actionsColRightHTML = '';
    const getHTML = (action) => {
        return `<div class="action col bordered">
                    <div class="item-info grid">
                        <input type="checkbox" class="toggle-desc small"${action.description ? '' : ' disabled'}></input>
                        <span class="name">${action.name}</span>
                        <span class="small">${action.type}</span>
                        ${action.rolls ? `<span class="small">${action.rolls}</span>` : ''}
                        ${action.range ? `<span class="small">${action.range}ft</span>` : ''}
                        ${action.totalUses ? `<span class="small">${action.remainingUses} / ${action.totalUses}</span>` : ''}
                    </div>
                    ${action.description ? `<div class="description small border-top" style="display: none">${action.description}</div>` : ''}
                </div>`;
    }

    for (let i = 0; i < arr.length; i++) {
        if (i % 2 === 0) {
            actionsColLeftHTML += getHTML(arr[i]);
        } else {
            actionsColRightHTML += getHTML(arr[i]);
        }
    }

    actions.querySelector('.actions-col-left').innerHTML = actionsColLeftHTML;
    actions.querySelector('.actions-col-right').innerHTML = actionsColRightHTML;

    const actionCards = document.querySelectorAll('.action');
    for (const actionCard of actionCards) {
        actionCard.addEventListener('click', event => {
            if (event.target.classList.contains('toggle-desc')) {
                const description = actionCard.querySelector('.description');
                description.style.display = event.target.checked ? 'block' : 'none';
            }
        });
    }
}

const applyFilter = (arr, filterElement, predicate) => {
    const searchInput = filterElement.querySelector('.search').value.toLowerCase();
    if (searchInput) arr = arr.filter(i => 
        i.name.toLowerCase().includes(searchInput) 
        || i.description && i.description.toLowerCase().includes(searchInput));

    const checkedToggles = Array.from(filterElement.querySelectorAll('.toggle-btn-input')).filter(toggle => toggle.checked);
    if (!checkedToggles.length) return arr;

    let tempArr = [];
    for (const toggle of checkedToggles) {
        tempArr.push(...arr.filter(i => predicate(i, toggle.value)));
    }
    return tempArr;
}

const queryInventory = () => {
    generateItemsHTML(
        applyFilter(stone.inventory, inventoryFilter,
            (item, value) => { return item.constructor.name === value }).sort(compareObjectsByName)
    );
}

const queryActions = () => {
    generateActionsHTML(
        applyFilter(stone.actions, actionsFilter, 
            (item, value) => { return item.type === value}).sort(compareObjectsByName)
    );
}

generateTopLeftCornerHTML();
generateTopRowHTML();
generateSkillsHTML();
generateBasicStatsHTML();
generateWealthHTML();
generateSituationalInfoHTML();
generateResourcesHTML();
generateStatesHTML();
queryInventory();
queryActions();
inventoryFilter.addEventListener('input', queryInventory);
actionsFilter.addEventListener('input', queryActions);