const HELMETS = fetch("/data/armor.json")
    .then(response => response.json())
    .then(data => data.helmets)
    .catch(error => console.log(error));
const CHESTPIECES = fetch("/data/armor.json")
    .then(response => response.json())
    .then(data => data.chestpieces)
    .catch(error => console.log(error));
const GAUNTLETS = fetch("/data/armor.json")
    .then(response => response.json())
    .then(data => data.gauntlets)
    .catch(error => console.log(error));
const LEGGINGS = fetch("/data/armor.json")
    .then(response => response.json())
    .then(data => data.leggings)
    .catch(error => console.log(error));

let sortedHelmets;
let sortedChestplates;
let sortedGauntlets;
let sortedLeggings;

const SortingMethod = {
    AVERAGE,
    PHYSICAL,
    ELEMENTAL,
    IMMUNITIES,
};

async function init() {
    // precompute and sort list of armor pieces
}

async function update() {
    let sorted = sortedCombinations();
}

function updateSortingMethod() {
    update();
}

function fitness(item, order) {
    // return fitness of item based on given order
    switch (order) {
        case SortingMethod.AVERAGE:
            return item.defenses.reduce((total, value) => total + value, 0) / item.defenses.length;
        case SortingMethod.PHYSICAL:
            break;
        case SortingMethod.ELEMENTAL:
            break;
        case SortingMethod.IMMUNITIES:
            break;
        default:
            console.log("error pls fix");
    }
}