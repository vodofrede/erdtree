let HELMETS;
let CHESTPIECES;
let GAUNTLETS;
let LEGGINGS;
let EQUIPMENT;

const populate = (select, items) => items.forEach(item => select.options.add(new Option(item.name, item.id)));
const selected = select => select.options[select.selectedIndex];

async function init() {
    HELMETS = await fetch("/data/helmets.json").then(response => response.json());
    CHESTPIECES = await fetch("/data/chestpieces.json").then(response => response.json());
    GAUNTLETS = await fetch("/data/gauntlets.json").then(response => response.json());
    LEGGINGS = await fetch("/data/leggings.json").then(response => response.json());
    EQUIPMENT = [HELMETS, CHESTPIECES, GAUNTLETS, LEGGINGS];

    // populate filter selects
    populate(document.getElementById("locked-helmet"), Object.values(HELMETS));
    populate(document.getElementById("locked-chestpiece"), Object.values(CHESTPIECES));
    populate(document.getElementById("locked-gauntlets"), Object.values(GAUNTLETS));
    populate(document.getElementById("locked-leggings"), Object.values(LEGGINGS));

    update();
}

function update() {
    // remove any previous results
    document.getElementById("results").innerHTML = "";

    // get budget & sort order
    let budget = equipLoadBudget();
    document.getElementById("equip-load-budget").value = budget.toFixed(1);
    let sortBy = [...document.getElementsByName("sorting-order")].find(elem => elem.checked).id;

    // get locked items
    let lockedItems = [...document.getElementsByName("locked-items")].map(
        (select, i) => Object.values(EQUIPMENT[i])[select.selectedIndex - 1],
    );
    // .filter(item => !item);
    console.log(lockedItems);

    // pre-sort and eliminate some equipment
    let helmets = dominated(Object.values(HELMETS), sortBy, lockedItems);
    let chestpieces = dominated(Object.values(CHESTPIECES), sortBy, lockedItems);
    let gauntlets = dominated(Object.values(GAUNTLETS), sortBy, lockedItems);
    let leggings = dominated(Object.values(LEGGINGS), sortBy, lockedItems);

    let selection = permutations([helmets, chestpieces, gauntlets, leggings], budget, lockedItems);

    // find best sets to display
    let best = knapSack(selection, sortBy);

    // show best sets under budget
    let template = document.getElementById("result");
    let destination = document.getElementById("results");
    best.forEach(set => {
        let clone = template.content.cloneNode(true);
        let tbody = clone.children[1];
        let rows = tbody.children;

        [...rows].slice(1).forEach((row, i) => {
            let link = document.createElement("a");
            link.href = "https://eldenring.wiki.fextralife.com/" + set[i].name.replaceAll(" ", "+");
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.innerText = set[i].name;
            row.children[0].appendChild(link);
            row.children[1].innerHTML = itemStatsToString(set[i]);
        });
        rows[0].children[1].innerHTML = setStatsToString(set);

        destination.appendChild(clone);
    });

    // display error message if sets is empty
    if (best.length == 0) {
        let error = document.createElement("b");
        error.innerHTML = "No sets found under budget";
        destination.appendChild(error);
    }
}

function resetAll() {
    [...document.getElementsByName("locked-items")].forEach(select => (select.selectedIndex = 0));
    update();
}

function dominated(itemList, sortBy, lockedItems) {
    if (lockedItems.some(item => itemList.includes(item))) {
        return [itemList.find(item => lockedItems.includes(item))];
    }

    let sorted = [...itemList];
    sorted.sort((a, b) => a.weight - b.weight);

    let approved = [];
    sorted.forEach(item => {
        if (!approved.some(other => fitness(item, sortBy) <= fitness(other, sortBy))) {
            approved.push(item);
        }
    });

    return approved;
}

function permutations([helmets, chestpieces, gauntlets, leggings], budget, lockedItems) {
    return helmets.flatMap(h => {
        return chestpieces.flatMap(c => {
            return gauntlets.flatMap(g => {
                return leggings
                    .filter(l => isAllowedSet([h, c, g, l], lockedItems))
                    .filter(l => budget >= setWeight([h, c, g, l]))
                    .map(l => [h, c, g, l]);
            });
        });
    });
}

function knapSack(selection, sortBy) {
    return selection
        .reduce((best, set) => {
            best.push(set);
            best.sort((a, b) => setFitness(b, sortBy) - setFitness(a, sortBy));
            best.pop();
            return best;
        }, selection.slice(0, 3))
        .sort((a, b) => setFitness(b, sortBy) - setFitness(a, sortBy));
}

function fitness(item, sortBy) {
    switch (sortBy) {
        case "sort-average":
            return item.defenses.reduce((total, n) => total + n, 0) ?? 0;
        case "sort-physical":
            return item.defenses.slice(0, 4).reduce((total, n) => total + n, 0) ?? 0;
        case "sort-elemental":
            return item.defenses.slice(4, 8).reduce((total, n) => total + n, 0) ?? 0;
        case "sort-resistances":
            return item.resistances.reduce((total, n) => total + n, 0) ?? 0;
        case "sort-poise":
            return item.poise ?? 0;
    }
}

const setWeight = set => (set.weight ??= set.reduce((total, item) => total + item.weight, 0));
const setFitness = (set, sortBy) => (set.fitness ??= set.reduce((total, item) => total + fitness(item, sortBy), 0.0));
const isAllowedSet = (set, lockedItems) => lockedItems.every(item => item == undefined || set.includes(item));

function equipLoadBudget() {
    let rollModifier = parseFloat([...document.getElementsByName("roll-type")].find(elem => elem.checked).value);

    let max = document.getElementById("max-equip-load").value || 0;
    let current = document.getElementById("current-equip-load").value || 0;

    return parseFloat(Math.max((max - current) * rollModifier, 0.0));
}

function itemStatsToString(item) {
    let weight = item.weight.toFixed(1) + " wgt., ";
    let poise = item.poise + " poise, ";
    let physical =
        item.defenses
            .slice(0, 4)
            .reduce((total, defense) => total + defense, 0.0)
            .toFixed(1) + " phys. ";
    let elemental =
        item.defenses
            .slice(4, 8)
            .reduce((total, defense) => total + defense, 0.0)
            .toFixed(1) + " elem. ";
    // let physical = item.defenses.slice(0, 4).reduce((total, defense, i) => total + defense.toFixed(1) + " " + DEFENSE_NAMES[i] + ", ", 0.0);
    // let elemental = item.defenses.slice(4, 8).reduce((total, defense, i) => total + defense.toFixed(1) + " " + DEFENSE_NAMES[i + 4] + ", ", "");
    let resistances = item.resistances.slice(0, 4).reduce(
        (total, res, i) => total + res + " " + ["immunity", "robustness", "focus", "vitality"][i] + ", ",
        "",
    );

    return weight + poise + physical + elemental + "<br>" + resistances;
}

function setStatsToString(set) {
    let imaginary = {
        weight: set[0].weight + set[1].weight + set[2].weight + set[3].weight,
        poise: set[0].poise + set[1].poise + set[2].poise + set[3].poise,
        defenses: set[0].defenses.map((stat, i) => stat + set[1].defenses[i] + set[2].defenses[i] + set[3].defenses[i]),
        resistances: set[0].resistances.map(
            (stat, i) => stat + set[1].resistances[i] + set[2].resistances[i] + set[3].resistances[i],
        ),
    };

    return itemStatsToString(imaginary);
}
