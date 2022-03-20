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

async function init() {

}

async function update() {
    let sorted = sortedCandidates();
}

function sortedCandidates() {
    // determine how to sort

    // get most likely candidates
    let candidates = findCandidates();

    // sort candidates

    return candidates;
}

function findCandidates() {
    return [];
}