const HELMETS = fetch("/data/helmets.json")
    .then(response => response.json())
    .catch(error => console.log(error));
const CHESTPIECES = fetch("/data/chestpieces.json")
    .then(response => response.json())
    .catch(error => console.log(error));
const GAUNTLETS = fetch("/data/gauntlets.json")
    .then(response => response.json())
    .catch(error => console.log(error));
const LEGGINGS = fetch("/data/leggings.json")
    .then(response => response.json())
    .catch(error => console.log(error));

var helmets;
var chestpieces;
var gauntlets;
var leggings;

async function init() {
    // populate filter selects
    populateSelect("locked-option", "select-helmet", Object.values(await HELMETS));
    populateSelect("locked-option", "select-chestpiece", Object.values(await CHESTPIECES));
    populateSelect("locked-option", "select-gauntlets", Object.values(await GAUNTLETS));
    populateSelect("locked-option", "select-leggings", Object.values(await LEGGINGS));

    update(true);
}

async function update() {
    // remove any previous results
    Array.from(document.getElementsByClassName("sort-result")).forEach(elem => elem.parentNode.removeChild(elem));

    // clamp equip load values to reasonable values
    // [...document.getElementsByName("equip-load")].forEach(el => el.value = Math.max(el.value, 0.0));

    // update budget
    let budget = equipLoadBudget();
    document.getElementById("equip-load-budget").value = budget.toFixed(1);
    let sortBy = [...document.getElementsByName("sorting-order")].find(elem => elem.checked).id;

    // get locked items
    let lockedItems = await Promise.all([HELMETS, CHESTPIECES, GAUNTLETS, LEGGINGS])
        .then(allItems => {
            return [...document.getElementsByName("locked-items")]
                .map((select, i) => Object.values(allItems[i])[select.selectedIndex])
                .filter(item => !item.id.startsWith("no-"));
        });

    // pre-sort and eliminate some equipment
    helmets = eliminate(Object.values(await HELMETS), sortBy, lockedItems);
    chestpieces = eliminate(Object.values(await CHESTPIECES), sortBy, lockedItems);
    gauntlets = eliminate(Object.values(await GAUNTLETS), sortBy, lockedItems);
    leggings = eliminate(Object.values(await LEGGINGS), sortBy, lockedItems);
    let selection = permutations(budget, lockedItems);

    // find best sets to display
    let best = knapSack(selection, sortBy);

    // show best sets under budget
    populateResults("sort-result", "sort-results", best);
}

function reset() {
    [...document.getElementsByName("locked-items")].forEach(select => select.selectedIndex = 0);
    update();
}

function eliminate(list, sortBy, lockedItems) {
    if (lockedItems.some(item => list.includes(item))) {
        return [list.find(item => lockedItems.includes(item))];
    }

    let sorted = [...list];
    sorted.sort((a, b) => a.weight - b.weight);

    let approved = []
    sorted.forEach(item => {
        if (!approved.some(other => fitness(item, sortBy) <= fitness(other, sortBy))) {
            approved.push(item)
        }
    });

    return approved;
}

function permutations(budget, lockedItems) {
    return helmets.flatMap(h => {
        return chestpieces.flatMap(c => {
            return gauntlets.flatMap(g => {
                return leggings
                    .filter(l => isAllowedSet([h, c, g, l], lockedItems))
                    .filter(l => budget > setWeight([h, c, g, l]))
                    .map(l => [h, c, g, l]);
            })
        })
    });
}

function knapSack(selection, sortBy) {
    return selection.reduce((best, set) => {
        best.push(set);
        best.sort((a, b) => setFitness(b, sortBy) - setFitness(a, sortBy));
        best.pop();
        return best;
    }, selection.slice(0, 3)).sort((a, b) => setFitness(b, sortBy) - setFitness(a, sortBy));
}

function fitness(item, sortBy) {
    switch (sortBy) {
        case "sort-average":
            return item.average ??= (item.defenses.reduce((total, n) => total + n, 0) ?? 0);
        case "sort-physical":
            return item.physical ??= (item.defenses.slice(0, 4).reduce((total, n) => total + n, 0) ?? 0);
        case "sort-elemental":
            return item.elemental ??= (item.defenses.slice(4, 8).reduce((total, n) => total + n, 0) ?? 0);
        case "sort-resistances":
            return item.resistances ??= (item.resistances.reduce((total, n) => total + n, 0) ?? 0);
        case "sort-poise":
            return item.poise ?? 0;
    }
}

const setWeight = (set) => set.weight ??= set.reduce((total, item) => total + item.weight, 0);
const setFitness = (set, sortBy) => set.fitness ??= set.reduce((total, item) => total + fitness(item, sortBy), 0.0);
const isAllowedSet = (set, lockedItems) => lockedItems.every(item => set.includes(item));

function equipLoadBudget() {
    let rollModifier = parseFloat([...document.getElementsByName("roll-type")].find(elem => elem.checked).value);

    let max = document.getElementById("max-equip-load").value || 0;
    let current = document.getElementById("current-equip-load").value || 0;

    return parseFloat(Math.max((max - current) * rollModifier, 0.0));
}

// site rendering functions
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
    let template = document.getElementById(templateId);
    let destination = document.getElementById(destinationId);

    (await sets).forEach(set => {
        let clone = template.content.cloneNode(true);

        let li = clone.children[0];
        let table = li.children[0];
        let tbody = table.children[1];
        let rows = tbody.children;

        rows[1].children[0].innerText = set[0].name;
        rows[2].children[0].innerText = set[1].name;
        rows[3].children[0].innerText = set[2].name;
        rows[4].children[0].innerText = set[3].name;

        rows[1].children[1].innerHTML = itemStatsToString(set[0]);
        rows[2].children[1].innerHTML = itemStatsToString(set[1]);
        rows[3].children[1].innerHTML = itemStatsToString(set[2]);
        rows[4].children[1].innerHTML = itemStatsToString(set[3]);

        rows[0].children[1].innerHTML = setStatsToString(set);

        destination.appendChild(clone);
    });
}

function itemStatsToString(item) {
    let weight = item.weight.toFixed(1) + " wgt., ";
    let poise = item.poise + " poise, ";
    let physical = item.defenses.slice(0, 4).reduce((total, defense) => total + defense, 0.0).toFixed(1) + " phys. ";
    let elemental = item.defenses.slice(4, 8).reduce((total, defense) => total + defense, 0.0).toFixed(1) + " elem. ";
    // let physical = item.defenses.slice(0, 4).reduce((total, defense, i) => total + defense.toFixed(1) + " " + DEFENSE_NAMES[i] + ", ", 0.0);
    // let elemental = item.defenses.slice(4, 8).reduce((total, defense, i) => total + defense.toFixed(1) + " " + DEFENSE_NAMES[i + 4] + ", ", "");
    let resistances = item.resistances.reduce((total, res, i) => total + res + " " + ["immunity", "robustness", "focus", "vitality"][i] + ", ", "");

    return weight + poise + physical + elemental + "<br>" + resistances;
}

function setStatsToString(set) {
    let imaginary = {
        weight: set[0].weight + set[1].weight + set[2].weight + set[3].weight,
        poise: set[0].poise + set[1].poise + set[2].poise + set[3].poise,
        defenses: set[0].defenses.map((stat, i) => stat + set[1].defenses[i] + set[2].defenses[i] + set[3].defenses[i]),
        resistances: set[0].resistances.map((stat, i) => stat + set[1].resistances[i] + set[2].resistances[i] + set[3].resistances[i])
    }

    return itemStatsToString(imaginary);
}