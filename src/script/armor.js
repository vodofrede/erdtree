const HELMETS = fetch("/data/helmets.json")
    .then(response => response.json())
    .then(data => data.helmets)
    .catch(error => console.log(error));
const CHESTPIECES = fetch("/data/chestpieces.json")
    .then(response => response.json())
    .then(data => data.chestpieces)
    .catch(error => console.log(error));
const GAUNTLETS = fetch("/data/gauntlets.json")
    .then(response => response.json())
    .then(data => data.gauntlets)
    .catch(error => console.log(error));
const LEGGINGS = fetch("/data/leggings.json")
    .then(response => response.json())
    .then(data => data.leggings)
    .catch(error => console.log(error));

let sortedHelmets;
let sortedChestplates;
let sortedGauntlets;
let sortedLeggings;

// const SortingMethod = {
//     AVERAGE,
//     POISE,
//     PHYSICAL,
//     ELEMENTAL,
//     IMMUNITIES,
// };

async function init() {
    // populate filter selects
    populateSelect("locked-option", "select-helmet", await HELMETS);
    populateSelect("locked-option", "select-chestpiece", await CHESTPIECES);
    populateSelect("locked-option", "select-gauntlets", await GAUNTLETS);
    populateSelect("locked-option", "select-leggings", await LEGGINGS);

    // precompute and sort list of armor pieces

}

async function update() {
    // let sorted = sortedCombinations();
}

function updateSortingMethod() {
    update();
}

function fitness(item, order) {
    // return fitness of item based on given order
    // switch (order) {
    //     case SortingMethod.AVERAGE:
    //         return item.defenses.reduce((total, value) => total + value, 0) / item.defenses.length;
    //     case SortingMethod.PHYSICAL:
    //         break;
    //     case SortingMethod.ELEMENTAL:
    //         break;
    //     case SortingMethod.IMMUNITIES:
    //         break;
    //     default:
    //         console.log("error pls fix");
    // }
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

function clearEquipment() {
    [...document.getElementsByName("locked-equipment")].forEach(select => select.selectedIndex = 0);
}