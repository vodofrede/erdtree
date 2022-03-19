const CLASSES = fetch("/data/classes.json")
    .then(response => response.json())
    .then(data => data.classes)
    .catch(error => console.log(error));

async function update() {
    // get inputted stats
    let desired = [...document.getElementsByName("desired-stat")].map(
        elem => {
            elem.value = Math.min(Math.max(elem.value, 0), 99) || null;
            return parseInt(elem.value) || 0;
        }
    )

    let virtual = virtualStats();

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
        elem.value = ((desired[i] > best.stats[i] ? desired[i] : best.stats[i]) + virtual[i]);
        // elem.style.color = IS_RADAGON[i] && virtual[i] ? "firebrick" : !IS_RADAGON[i] && virtual[i] ? "royalblue" : "unset";
    });
}

function statDelta(classStats, desiredStats) {
    return classStats
        .map((e, i) => { return e < desiredStats[i] ? desiredStats[i] - e : 0 })
        .reduce((total, n) => total + n);
}

function sortClasses(classes, desiredStats) {
    let deltas = classes.map(c => {
        c.total = c.level + statDelta(c.stats, desiredStats);
        return c;
    });
    deltas.sort((a, b) => { return a.total - b.total; });
    return deltas;
}

function virtualStats() {
    let [
        radagon, marika, dexterityTalisman, intelligenceTalisman, strengthTalisman, faithTalisman, millicent
    ] = [...document.getElementsByName("talisman")].map(elem => { return elem.checked });

    return [
        radagon ? 5 : 0,
        marika ? 5 : 0,
        radagon ? 5 : 0,
        (radagon ? 5 : 0) + (strengthTalisman ? 5 : 0),
        (radagon ? 5 : 0) + (dexterityTalisman ? 5 : 0) + (millicent ? 5 : 0),
        (marika ? 5 : 0) + (intelligenceTalisman ? 5 : 0),
        (marika ? 5 : 0) + (faithTalisman ? 5 : 0),
        marika ? 5 : 0,
    ]
}

function talisman() {
    console.log("talisman()");

    let talismans = [...document.getElementsByName("talisman")]

    if (talismans.filter(checkbox => { return checkbox.checked }).length >= 4) {
        talismans.forEach(checkbox => { checkbox.disabled = !checkbox.checked });
    } else {
        talismans.forEach(checkbox => { checkbox.disabled = false });
    }

    update();
}

function clearDesired() {
    document.getElementsByName("desired-stat").forEach(elem => { elem.value = null });
    document.getElementsByName("talisman").forEach(elem => { elem.checked = false });
    update();
}