const CLASSES = fetch("/data/classes.json")
    .then(response => response.json())
    .then(data => data.classes)
    .catch(error => console.log(error));
const TALISMANS = fetch("/data/talismans.json")
    .then(response => response.json())
    .then(data => data.talismans)
    .catch(error => console.log(error));
const HELMETS = fetch("/data/armor/helmets.json")
    .then(response => response.json())
    .then(data => data.helmets)
    .catch(error => console.log(error));

const STAT_SHORT_NAMES = [
    "vig.",
    "mnd.",
    "end.",
    "str.",
    "dex.",
    "int.",
    "fth.",
    "arc."
]

async function init() {
    // populate helmet list
    let helmets = await HELMETS;
    helmets = helmets.filter(helmet => helmet.stats != null && helmet.stats != undefined);

    let helmetTemplate = document.getElementById("helm");
    let helmetList = document.getElementById("helmets");
    helmets.forEach(helmet => {
        cloneTemplate(helmetTemplate, helmetList, helmet);
    });

    // populate talisman list
    let talismans = await TALISMANS;
    talismans = talismans.filter(talisman => talisman.stats != null && talisman.stats != undefined);

    let talismanTemplate = document.getElementById("talisman");
    let talismanList = document.getElementById("talismans");
    talismans.forEach(talisman => {
        cloneTemplate(talismanTemplate, talismanList, talisman);
    });

    update();
}

async function update() {
    // get inputted stats, clamp value to 0..99
    let desired = [...document.getElementsByName("desired-stat")].map(
        elem => {
            elem.value = Math.min(Math.max(elem.value, 0), 99) || null;
            return parseInt(elem.value) || 0;
        }
    )

    // get added stats from items
    let items = itemStats((await TALISMANS).concat(await HELMETS));

    desired = desired.map((stat, i) => stat - items[i]);

    // calculate best class
    let sorted = sortClasses(await CLASSES, desired);
    let best = sorted[0];

    // update document
    document.getElementsByName("option").forEach((elem, i) => {
        let [name, level] = elem.children;
        name.innerHTML = sorted[i].name;
        level.innerHTML = "lvl. " + sorted[i].total;
    })
    document.getElementById("best-class").value = best.name;

    document.getElementById("class-level").value = best.level;
    document.getElementById("total-level").value = best.total;
    document.getElementById("subtractive-level").value = best.total;
    document.getElementById("additive-level").value = [...document.getElementsByName("additive-stat")].reduce((total, elem, i) => {
        return total + (desired[i] > best.stats[i] ? desired[i] : best.stats[i]) + items[i];
    }, 0) - 79;

    document.getElementsByName("class-stat").forEach((elem, i) => elem.value = best.stats[i]);

    document.getElementsByName("subtractive-stat").forEach((elem, i) => {
        elem.value = ((desired[i] > best.stats[i] ? desired[i] : best.stats[i]));
    });

    document.getElementsByName("additive-stat").forEach((elem, i) => {
        elem.value = ((desired[i] > best.stats[i] ? desired[i] : best.stats[i]) + items[i]);
    });

    // update talismans
    let talismans = [...document.getElementsByClassName("talisman")]

    if (talismans.filter(checkbox => checkbox.checked).length >= 4) {
        talismans.forEach(checkbox => checkbox.disabled = !checkbox.checked);
    } else {
        talismans.forEach(checkbox => checkbox.disabled = false);
    }
}

function sortClasses(classes, desiredStats) {
    let deltas = classes.map(c => {
        c.total = c.level + statDelta(c.stats, desiredStats);
        return c;
    });
    deltas.sort((a, b) => a.total - b.total);
    return deltas;
}

function statDelta(classStats, desiredStats) {
    return classStats
        .map((e, i) => e < desiredStats[i] ? desiredStats[i] - e : 0)
        .reduce((total, n) => total + n);
}

function itemStats(relevantItems) {
    let ids = [...document.getElementsByName("equipment")]
        .filter(elem => elem.checked)
        .map(elem => elem.id);
    let relevant = relevantItems.filter(item => ids.includes(item.id));

    return relevant.reduce((total, item) => total.map((stat, i) => stat += item.stats[i]), [0, 0, 0, 0, 0, 0, 0, 0]);
}

function clearAll() {
    document.getElementsByName("desired-stat").forEach(elem => elem.value = null);
    [...document.getElementsByName("equipment")].forEach(elem => elem.checked = false);
    document.getElementById("helm-none").checked = true;

    update();
}

function statsDescription(stats) {
    return stats.reduce((total, stat, i) => {
        return stat ? (total + " +" + stat + " " + STAT_SHORT_NAMES[i]) : total;
    }, "");
}

function cloneTemplate(template, destination, item) {
    let clone = template.content.cloneNode(true);

    let li = clone.children[0]
    let div = li.children[0];
    let inputElement = div.children[0];
    let labelElement = div.children[1]

    inputElement.id = item.id;
    labelElement.for = item.id;
    labelElement.innerHTML = item.name;

    let aside = li.children[1];
    aside.innerHTML = statsDescription(item.stats);

    destination.appendChild(clone);
}