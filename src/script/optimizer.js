const CLASSES = fetch("/data/classes.json")
    .then(response => response.json())
    .then(data => data.classes)
    .catch(error => console.log(error));

const TALISMANS = fetch("/data/talismans.json")
    .then(response => response.json())
    .then(data => data.talismans)
    .catch(error => console.log(error));

async function update() {
    // get inputted stats
    let desired = [...document.getElementsByName("desired-stat")].map(
        elem => {
            elem.value = Math.min(Math.max(elem.value, 0), 99) || null;
            return parseInt(elem.value) || 0;
        }
    )

    let items = itemStats(await TALISMANS);

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
    document.getElementById("virtual-level").value = best.total;

    document.getElementsByName("class-stat").forEach((elem, i) => elem.value = best.stats[i]);

    document.getElementsByName("virtual-stat").forEach((elem, i) => {
        elem.value = ((desired[i] > best.stats[i] ? desired[i] : best.stats[i]) + items[i]);
        // elem.style.color = IS_RADAGON[i] && virtual[i] ? "firebrick" : !IS_RADAGON[i] && virtual[i] ? "royalblue" : "unset";
    });
}

function statDelta(classStats, desiredStats) {
    return classStats
        .map((e, i) => e < desiredStats[i] ? desiredStats[i] - e : 0)
        .reduce((total, n) => total + n);
}

function sortClasses(classes, desiredStats) {
    let deltas = classes.map(c => {
        c.total = c.level + statDelta(c.stats, desiredStats);
        return c;
    });
    deltas.sort((a, b) => a.total - b.total);
    return deltas;
}

function itemStats(relevantItems) {
    let ids = [...document.getElementsByName("equipment")]
        .filter(elem => elem.checked)
        .map(elem => elem.id);
    let relevant = relevantItems.filter(item => ids.includes(item.id));

    return relevant.reduce((total, item) => total.map((stat, i) => stat += item.stats[i]), [0, 0, 0, 0, 0, 0, 0, 0]);
}

function talisman() {
    let talismans = [...document.getElementsByClassName("talisman")]

    if (talismans.filter(checkbox => checkbox.checked).length >= 4) {
        talismans.forEach(checkbox => checkbox.disabled = !checkbox.checked);
    } else {
        talismans.forEach(checkbox => checkbox.disabled = false);
    }

    update();
}

function clearAll() {
    document.getElementsByName("desired-stat").forEach(elem => { elem.value = null });
    [...document.getElementsByClassName("talisman")].forEach(elem => { elem.checked = false });
    update();
}