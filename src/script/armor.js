const HELMETS = fetch("/data/armor/helmets.json")
    .then(response => response.json())
    .then(data => data.helmets)
    .catch(error => console.log(error));
const CHESTPIECES = fetch("/data/armor/chestpieces.json")
    .then(response => response.json())
    .then(data => data.chestpieces)
    .catch(error => console.log(error));
const GAUNTLETS = fetch("/data/armor/gauntlets.json")
    .then(response => response.json())
    .then(data => data.gauntlets)
    .catch(error => console.log(error));
const LEGGINGS = fetch("/data/armor/leggings.json")
    .then(response => response.json())
    .then(data => data.leggings)
    .catch(error => console.log(error));

// armor combination lists
const PHYSICAL = fetch("/data/armor/combinations/physical.json")
    .then(response => response.json())
    .catch(error => console.log(error));
const POISE = fetch("/data/armor/combinations/poise.json")
    .then(response => response.json())
    .catch(error => console.log(error));

async function init() {
    // populate filter selects
    populateSelect("locked-option", "select-helmet", await HELMETS);
    populateSelect("locked-option", "select-chestpiece", await CHESTPIECES);
    populateSelect("locked-option", "select-gauntlets", await GAUNTLETS);
    populateSelect("locked-option", "select-leggings", await LEGGINGS);

    update();
}

async function update() {
    // get budget and sorting order
    let budget = equipLoadBudget();
    let sortBy = currentSortBy();

    // find sets under budget
    let best = await findUnderBudget(budget, sortBy, 3);

    // show best sets under budget
    Array.from(document.getElementsByClassName("sort-result")).forEach(elem => elem.parentNode.removeChild(elem));
    populateResults("sort-result", "sort-results", best);
}

function clearEquipment() {
    [...document.getElementsByName("locked-equipment")].forEach(select => select.selectedIndex = 0);
}

function equipLoadBudget() {
    let rollType = [...document.getElementsByName("roll-type")].find(elem => elem.checked).id;
    let rollModifier;
    switch (rollType) {
        case "fast-roll":
            rollModifier = 0.3;
            break;
        case "normal-roll":
            rollModifier = 0.7;
            break;
        case "fat-roll":
            rollModifier = 1.0;
            break;
    }

    return (parseInt(document.getElementById("max-equip-load").value) - parseInt(document.getElementById("current-equip-load").value)) * rollModifier;
}

function currentSortBy() {
    return [...document.getElementsByName("sorting-order")].find(elem => elem.checked).id;
}

async function findUnderBudget(budget, sortBy, amount) {
    let sets;

    switch (sortBy) {
        case "greatest-physical":
            sets = (await PHYSICAL);
            break;
        case "greatest-poise":
            sets = (await POISE);
            break;
    }

    let first = sets.findIndex(set => set.weight <= budget);

    return sets.slice(first, first + amount);
}

function populateSelect(templateId, destinationId, items) {
    let template = document.getElementById(templateId);
    let destination = document.getElementById(destinationId);

    items.forEach(item => {
        let clone = template.content.cloneNode(true);

        clone.value = item.id;
        clone.innerHTML = item.name;

        destination.options.add(new Option(item.name, item.id));
    });
}

async function populateResults(templateId, destinationId, sets) {
    let helmets = await HELMETS;
    let chestpieces = await CHESTPIECES;
    let gauntlets = await GAUNTLETS;
    let leggings = await LEGGINGS;

    let template = document.getElementById(templateId);
    let destination = document.getElementById(destinationId);

    sets.forEach(set => {
        let clone = template.content.cloneNode(true);

        let li = clone.children[0];
        let table = li.children[0];
        let tbody = table.children[1];
        let rows = tbody.children;

        rows[0].children[1].innerText = helmets.find(helmet => helmet.id == set.helmet).name;
        rows[1].children[1].innerText = chestpieces.find(chest => chest.id == set.chestpiece).name;
        rows[2].children[1].innerText = gauntlets.find(gauntlets => gauntlets.id == set.gauntlets).name
        rows[3].children[1].innerText = leggings.find(leggings => leggings.id == set.leggings).name

        destination.appendChild(clone);
    });
}