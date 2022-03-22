const HELMETS = fetch("/data/armor/helmets.json")
    .then(response => response.json())
    .catch(error => console.log(error));
const CHESTPIECES = fetch("/data/armor/chestpieces.json")
    .then(response => response.json())
    .catch(error => console.log(error));
const GAUNTLETS = fetch("/data/armor/gauntlets.json")
    .then(response => response.json())
    .catch(error => console.log(error));
const LEGGINGS = fetch("/data/armor/leggings.json")
    .then(response => response.json())
    .catch(error => console.log(error));

// armor combination lists
const PHYSICAL = fetch("/data/armor/combinations/physical.json")
    .then(response => response.json())
    .catch(error => console.log(error));
const POISE = fetch("/data/armor/combinations/poise.json")
    .then(response => response.json())
    .catch(error => console.log(error));

const DEFENSE = [
    "phys.",
    "strike",
    "slash",
    "pierce",
    "magic",
    "fire",
    "light.",
    "holy",
];
const RESISTANCES = [
    "immunity",
    "robustness",
    "focus",
    "vitality",
]

async function init() {
    // populate filter selects
    populateSelect("locked-option", "select-helmet", await HELMETS);
    populateSelect("locked-option", "select-chestpiece", await CHESTPIECES);
    populateSelect("locked-option", "select-gauntlets", await GAUNTLETS);
    populateSelect("locked-option", "select-leggings", await LEGGINGS);

    update();
}

async function update() {
    // clamp equip load values to reasonable values
    [...document.getElementsByName("equip-load")].forEach(el => el.value = Math.max(el.value, 0.0));

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

    let max = document.getElementById("max-equip-load").value || 0;
    let current = document.getElementById("current-equip-load").value || 0;
    let budget = Math.max((max - current) * rollModifier, 0);

    return budget;

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

        let helmet = helmets.find(helmet => helmet.id == set.helmet);
        let chestpiece = chestpieces.find(chest => chest.id == set.chestpiece);
        let gauntlet = gauntlets.find(gauntlets => gauntlets.id == set.gauntlets);
        let legging = leggings.find(leggings => leggings.id == set.leggings);

        rows[0].children[0].innerText = helmet.name;
        rows[1].children[0].innerText = chestpiece.name;
        rows[2].children[0].innerText = gauntlet.name;
        rows[3].children[0].innerText = legging.name;

        rows[0].children[1].innerHTML = statString(helmet);
        rows[1].children[1].innerHTML = statString(chestpiece);
        rows[2].children[1].innerHTML = statString(gauntlet);
        rows[3].children[1].innerHTML = statString(legging);

        rows[4].children[1].innerHTML = totalStatsString(helmet, chestpiece, gauntlet, legging);

        destination.appendChild(clone);
    });
}

function statString(item) {
    let weight = item.weight.toFixed(1) + " wgt., ";
    let poise = item.poise + " poise, ";
    let physical = item.defenses.slice(0, 4).reduce((total, defense, i) => total + defense.toFixed(1) + " " + DEFENSE[i] + ", ", "");
    let elemental = item.defenses.slice(4, 8).reduce((total, defense, i) => total + defense.toFixed(1) + " " + DEFENSE[i + 4] + ", ", "");
    let resistances = item.resistances.reduce((total, res, i) => total + res + " " + RESISTANCES[i] + ", ", "");

    return weight + poise + physical + "<br>" + elemental + "<br>" + resistances;
}

function totalStatsString(helmet, chestpiece, gauntlets, leggings) {
    let imaginary = {
        weight: helmet.weight + chestpiece.weight + gauntlets.weight + leggings.weight,
        poise: helmet.poise + chestpiece.poise + gauntlets.poise + leggings.poise,
        defenses: helmet.defenses.map((stat, i) => stat + chestpiece.defenses[i] + gauntlets.defenses[i] + leggings.defenses[i]),
        resistances: helmet.resistances.map((stat, i) => stat + chestpiece.resistances[i] + gauntlets.resistances[i] + leggings.resistances[i])
    }

    return statString(imaginary);
}