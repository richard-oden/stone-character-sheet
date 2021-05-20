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

const filterToggleBtns = document.querySelectorAll('.toggle-btn-input');
for (const toggleBtn of filterToggleBtns) {
    toggleBtn.addEventListener('change', event => {
        const label = document.querySelector(`label[for=${event.target.id}]`);
        label.style.backgroundColor = event.target.checked ? 'var(--active-background)' : 'var(--highlight-background)';
    });
}

const toggleDescHandler = event => {
    let queryElement = event.target.parentElement;
    let description;
    let attempts = 0;
    while (!description && attempts < 10) {
        description = queryElement.querySelector(`.${event.target.value}`);
        queryElement = queryElement.parentElement;
        attempts++;
    }
    if (description) {
        description.style.display = event.target.checked ? 'flex' : 'none';
        postHandler(event);
    }
}

let postTimeout = null;
const postHandler = async (event, onSuccess) => {
    clearTimeout(postTimeout);
    postTimeout = setTimeout(async () => {
        const obj = {
            propPath: event.target.id,
            value: event.target.type === 'checkbox' 
                ? event.target.checked
                : parseIntIfNumeric(event.target.textContent)
        }
        const res = await fetch('/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(obj)
        });
        if (onSuccess) onSuccess(await res.json());
    }, 1000);
}

const get = async url => {
    try {
        return await fetch(url);
    } catch (error) {
        throw error;
    }
}

const getJSON = async url => {
    return (await get(url)).json();
}

const getClasses = (stone, queryItem, queryType = '', profArr = []) => {
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

const generateTopLeftCornerHTML = stone => {
    characterName.textContent = stone.name;
    basicInfo.innerHTML = `lvl <span id="level" contenteditable="true" onclick="document.execCommand('selectAll',false,null)">${stone.level}</span> ${stone.race} ${stone.subclass}`;
    basicInfo.parentElement.addEventListener('input', e => postHandler(e, loadAllContent))
}

const generateTopRowHTML = stone => {
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
                <div class="fig-l${getClasses(stone, abil, 'check')}">
                    <span id="abilityScores_${abil}" contenteditable="true" onclick="document.execCommand('selectAll',false,null)">${score}</span> 
                    <span>/ ${mod > 0 ? '+' : ''}${mod}<span>
                </div>
                <div class="fig-m${getClasses(stone, abil, 'saving throw', stone.proficiencies.savingThrows)}">
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
                <span id="deathSaves_successes" contenteditable="true" onclick="document.execCommand('selectAll',false,null)">&nbsp${stone.deathSaves.successes}</span>
                <span>:</span>
                <span id="deathSaves_failures" contenteditable="true" onclick="document.execCommand('selectAll',false,null)">${stone.deathSaves.failures}&nbsp</span>
            </div>
            <div class="row">
                <small>success</small>
                <small>failure</small>
            </div>
        </div>
    `;
    topRow.innerHTML = topRowHTML;
    topRow.addEventListener('input', async e => postHandler(e, loadAllContent));
}

const generateSkillsHTML = stone => {
    skillsHTML = '';
    for (const skill in stone.skills) {
        const cssClass = `${getClasses(stone, skill, '', stone.proficiencies.skills)} ${getClasses(stone, stone.skills[skill].ability, 'check')}`;
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

const generateBasicStatsHTML = stone => {
    basicStats.innerHTML =
    `
        <div class="hit-points col bordered stat-card">
            <small>Hit Points</small>
            <div class="fig-l">
                <span id="currentHitPoints" contenteditable="true" onclick="document.execCommand('selectAll',false,null)">${stone.currentHitPoints}</span>+<span id="tempHitPoints" contenteditable="true" onclick="document.execCommand('selectAll',false,null)">${stone.tempHitPoints}</span>
            </div>
            <small>${stone.maxHitPoints} total</small>
        </div>
        <div class="hit-dice col bordered stat-card">
            <small>Hit Dice</small>
            <div id="currentHitDice" class="fig-l" contenteditable="true" onclick="document.execCommand('selectAll',false,null)">${stone.currentHitDice}</div>
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
                <input id="inspiration" type="checkbox" ${stone.inspiration ? ' checked' : ''}></input>
            </div>
        </div>
    `;
    basicStats.addEventListener('input', postHandler)
}

const generateWealthHTML = stone => {
    wealth.innerHTML =
    `
        <small>Wealth</small>
        <div id="wealth" class="fig-m" contenteditable="true" onclick="document.execCommand('selectAll',false,null)">${stone.wealth}</div>
    `;
    wealth.addEventListener('input', postHandler);
}

const generateSituationalInfoHTML = stone => {
    const checkDescToggleState = keyword => {
        return stone[keyword].some ? stone.descriptionsExpanded[keyword] ? 'checked' : '' : 'disabled';
    }

    let situationalInfoHTML = '';
    situationalInfoHTML += 
    `<h3 class="advantage toggle-header">
        <input type="checkbox" value="advantage-desc" id="descriptionsExpanded_advantage" class="toggle-desc small" ${checkDescToggleState('advantage')}></input>
        Advantage
    </h3>
    <div class="border-bottom-l"><div class="col advantage-desc sit-wrap">`
        for (const adv of stone.advantage) {
            situationalInfoHTML += `<span class="small">${adv}</span>`;
        }
    situationalInfoHTML += 
    `</div></div>
    <h3 class="disadvantage toggle-header">
        <input type="checkbox" value="disadvantage-desc" id="descriptionsExpanded_disadvantage" class="toggle-desc small" ${checkDescToggleState('disadvantage')}></input>
        Disadvantage
    </h3>
    <div class="border-bottom-l"><div class="col disadvantage-desc sit-wrap">`
        for (const disadv of stone.disadvantage) {
            situationalInfoHTML += `<span class="small">${disadv}</span>`;
        }
    situationalInfoHTML += 
    `</div></div>
    <h3 class="toggle-header">
        <input type="checkbox" value="resistances-desc" id="descriptionsExpanded_resistances" class="toggle-desc small" ${checkDescToggleState('resistances')}></input>
        Resistances
    </h3>
    <div class="border-bottom-l"><div class="col resistances-desc sit-wrap">`
        for (const resistance of stone.resistances) {
            situationalInfoHTML += `<span class="small">${resistance}</span>`;
        }
    situationalInfoHTML += 
    `</div></div>
    <h3 class="toggle-header">
        <input type="checkbox" value="immunities-desc" id="descriptionsExpanded_immunities" class="toggle-desc small" ${checkDescToggleState('immunities')}></input>
        Immunities
    </h3>
    <div class="border-bottom-l"><div class="col immunities-desc sit-wrap">`
        for (const immunity of stone.immunities) {
            situationalInfoHTML += `<span class="small">${immunity}</span>`;
        }
    situationalInfoHTML += 
    `</div></div>
    <h3 class="toggle-header">
        <input type="checkbox" value="miscellaneous-desc" id="descriptionsExpanded_miscellaneous" class="toggle-desc small" ${checkDescToggleState('miscellaneous')}></input>
        Miscellaneous
    </h3>
    <div class="border-bottom-l"><div class="col miscellaneous-desc sit-wrap">`
        for (const misc of stone.miscellaneous) {
            situationalInfoHTML += `<span class="small">${misc}</span>`;
        }
    situationalInfoHTML += 
    `</div></div>
    <h3 class="proficient toggle-header">
        <input type="checkbox" value="proficiencies-desc" id="descriptionsExpanded_proficiencies" class="toggle-desc small"${stone.descriptionsExpanded.proficiencies ? 'checked' : ''}></input>
        Proficiencies
    </h3>
    <div class="border-bottom-l"><div class="col proficiencies-desc sit-wrap">`
        for (const prof in stone.proficiencies) {
            situationalInfoHTML += 
            `<span class="small grid prof-category">
                <b>${unCamelCase(prof)}:&nbsp</b>
                <span>${toCommaSeparatedList(stone.proficiencies[prof])}</span>
            </span>`;
        }
    situationalInfoHTML += 
        `</div></div>
        <h3 class="toggle-header">
            <input type="checkbox" value="notes-desc" id="descriptionsExpanded_notes" class="toggle-desc small" ${stone.descriptionsExpanded.notes ? 'checked' : ''}></input>
            Notes
        </h3>
        <div class="border-bottom-l">
            <p class="notes-desc sit-wrap bordered small" id="notes" contenteditable="true">${stone.notes}</p>
        </div>`
    situationalInfo.innerHTML = situationalInfoHTML;

    for (const header of situationalInfo.querySelectorAll('.toggle-header')) {
        const toggleInput = header.querySelector('.toggle-desc');
        situationalInfo.querySelector(`.${toggleInput.value}`).style.display = toggleInput.checked ? 'flex' : 'none';
    }

    situationalInfo.addEventListener('click', event => {
        if (event.target.classList.contains('toggle-desc')) {
            toggleDescHandler(event);
        }
    });

    document.querySelector('#notes').addEventListener('input', postHandler);
}

const generateResourcesHTML = stone => {
    resourcesHTML = '';
    const limitedActions = stone.actions
        .filter(a => a.totalUses > 0)
        .sort(compareObjectsByName);
    for (const action of limitedActions) {
        resourcesHTML +=
        `
        <div class="col bordered stat-card">
            <small class="ellipsis">${shortenResourceName(action.name)}</small>
            <div class="fig-m">
                <span id="resources_${action.name.replace(/ /g, '-')}" contenteditable="true" onclick="document.execCommand('selectAll',false,null)">${action.remainingUses}</span> 
                <span>/ ${action.totalUses}</span>
            </div>
        </div>
        `;
    }
    resources.innerHTML = resourcesHTML;
    resources.addEventListener('input', e => postHandler(e, queryActions));
}

const generateStatesHTML = stone => {
    statesHTML = '';
    for (const state of stone.states) {
        statesHTML +=
        `
        <div class="col bordered stat-card">
            <small class="ellipsis">${state.name}</small>
            <div>
                <input id="states_${state.name.replace(/ /g, '-')}" type="checkbox" ${state.isActive ? ' checked' : ''}></input>
            </div>
        </div>
        `;
    }
    states.innerHTML = statesHTML;
    states.addEventListener('input', e => postHandler(e, loadAllContent));
}

const generateItemsHTML = (stone, arr) => {
    const checkDescToggleState = item => {
        return item.description ? stone.descriptionsExpanded[item.name] ? 'checked' : '' : 'disabled';
    }

    let inventoryHTML = '';
    for (const item of arr) {
        const attunementHTML = item.attunement ? 
        `<span class="attuned row">
            <small>Attuned:&nbsp</small>
            <input class="small toggle-attuned" id="attunement_${item.name.replace(/ /g, '-')}" type="checkbox" ${stone.attunement[item.name] ? ' checked' : ''}></input>
        </span>` : '';

        inventoryHTML +=
        `
            <div class="item col bordered">
                <div class="item-info toggle-header">
                    <input type="checkbox" value="item-desc" id="descriptionsExpanded_${item.name.replace(/ /g, '-')}" class="toggle-desc small"${checkDescToggleState(item)}></input>
                    <span class="name">${item.name}</span>
                    ${item.armorClass ? `<span class="small">AC: ${item.armorClass}</span>` : ''}
                    ${item.range ? `<span class="small">${item.range}ft</span>` : ''}
                    ${attunementHTML}
                </div>
                ${item.description ? `<div class="description item-desc small border-top" style="display: none">${item.description}</div>` : ''}
            </div>
        `;
    }
    items.innerHTML = inventoryHTML;

    const itemCards = document.querySelectorAll('.item');
    for (const itemCard of itemCards) {
        const description = itemCard.querySelector('.description');
        if (description) description.style.display = itemCard.querySelector('.toggle-desc').checked ? 'flex' : 'none';

        itemCard.addEventListener('click', event => {
            if (event.target.classList.contains('toggle-desc')) {
                toggleDescHandler(event);
            } else if (event.target.classList.contains('toggle-attuned')) {
                postHandler(event);
            }
        });
    }
}

const generateActionsHTML = async (stone, arr) => {
    const checkDescToggleState = action => {
        return action.description ? stone.descriptionsExpanded[action.name] ? 'checked' : '' : 'disabled';
    }

    let actionsColLeftHTML = '';
    let actionsColRightHTML = '';
    const getHTML = async action => {
        const actionTypeIcon = await (await get('icon/' + shortenResourceName(action.type).toLowerCase())).text();
        console.log(actionTypeIcon);
        return `<div class="action col bordered${action.remainingUses != null && action.remainingUses <= 0 ? ' expended' : ''}">
                    <div class="toggle-header">
                        <input type="checkbox" value="action-desc" id="descriptionsExpanded_${action.name.replace(/ /g, '-')}" class="toggle-desc small"${checkDescToggleState(action)}></input>
                        <span class="name">${action.name}</span>
                        <span class="small">${actionTypeIcon}</span>
                        ${action.rolls ? `<span class="small">${action.rolls}</span>` : ''}
                        ${action.range ? `<span class="small">${action.range}ft</span>` : ''}
                        ${action.totalUses ? `<span class="small">${action.remainingUses} / ${action.totalUses}</span>` : ''}
                    </div>
                    ${action.description ? `<div class="description action-desc small border-top" style="display: none">${action.description}</div>` : ''}
                </div>`;
    }

    for (let i = 0; i < arr.length; i++) {
        if (i % 2 === 0) {
            actionsColLeftHTML += await getHTML(arr[i]);
        } else {
            actionsColRightHTML += await getHTML(arr[i]);
        }
    }

    actions.querySelector('.actions-col-left').innerHTML = actionsColLeftHTML;
    actions.querySelector('.actions-col-right').innerHTML = actionsColRightHTML;

    const actionCards = document.querySelectorAll('.action');
    for (const actionCard of actionCards) {
        const description = actionCard.querySelector('.description');
        if (description) description.style.display = actionCard.querySelector('.toggle-desc').checked ? 'flex' : 'none';

        actionCard.addEventListener('click', event => {
            if (event.target.classList.contains('toggle-desc')) {
                toggleDescHandler(event);
            }
        });
    }
}

const applyFilter = (arr, filterElement) => {
    const searchInput = filterElement.querySelector('.search').value.toLowerCase();
    if (searchInput) arr = arr.filter(i => 
        i.name.toLowerCase().includes(searchInput) 
        || i.description && i.description.toLowerCase().includes(searchInput));

    const checkedToggles = Array.from(filterElement.querySelectorAll('.toggle-btn-input')).filter(toggle => toggle.checked);
    if (!checkedToggles.length) return arr;

    let tempArr = [];
    for (const toggle of checkedToggles) {
        tempArr.push(...arr.filter(i => i.type.includes(toggle.value)));
    }
    return tempArr;
}

const queryInventory = stone => {
    generateItemsHTML(stone, applyFilter(stone.inventory, inventoryFilter).sort(compareObjectsByName));
}

const queryActions = stone => {
    generateActionsHTML(stone, applyFilter(stone.actions, actionsFilter).sort(compareObjectsByName));
}

const resetFilterEventListeners = stone => {
    inventoryFilter.removeEventListener('input', () => {queryInventory(stone)});
    actionsFilter.removeEventListener('input', () => {queryActions(stone)});
    inventoryFilter.addEventListener('input', () => {queryInventory(stone)});
    actionsFilter.addEventListener('input', () => {queryActions(stone)});
}

const loadAllContent = stone => {
    generateTopLeftCornerHTML(stone);
    generateTopRowHTML(stone);
    generateSkillsHTML(stone);
    generateBasicStatsHTML(stone);
    generateWealthHTML(stone);
    generateSituationalInfoHTML(stone);
    generateResourcesHTML(stone);
    generateStatesHTML(stone);
    queryInventory(stone);
    queryActions(stone);
    resetFilterEventListeners(stone);
}

window.addEventListener('DOMContentLoaded', async () => {
    loadAllContent(await getJSON('get'));
});