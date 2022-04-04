const CLASSES = fetch("/data/classes.json")
    .then((response) => response.json())
    .catch((error) => console.log(error));
const TALISMANS = fetch("/data/talismans.json")
    .then((response) => response.json())
    .catch((error) => console.log(error));
const HELMETS = fetch("/data/helmets.json")
    .then((response) => response.json())
    .catch((error) => console.log(error));

const STAT_SHORT_NAMES = ["vig.", "mnd.", "end.", "str.", "dex.", "int.", "fth.", "arc."];

async function init() {
    // populate helmet select
    let helmets = Object.values(await HELMETS);
    helmets = helmets.filter((helmet) => helmet.stats != null);
    let destination = document.getElementById("helmet");
    helmets.forEach((helmet) => {
        destination.options.add(new Option(helmet.name, helmet.id));
    });

    // populate talisman list
    let talismans = Object.values(await TALISMANS);
    talismans = talismans.filter((talisman) => talisman.stats != null && !talisman.id.includes("scar"));

    let template = document.getElementById("talisman");
    destination = document.getElementById("talismans");
    talismans.forEach((item) => {
        let clone = template.content.cloneNode(true);
        let li = clone.children[0];

        let input = li.children[0].children[0];
        let label = li.children[0].children[1];
        let aside = li.children[1];

        input.id = item.id;
        input.value = item.id;
        label.htmlFor = item.id;
        label.innerHTML = item.name;
        aside.innerHTML = statsDescription(item.stats);

        destination.appendChild(clone);
    });

    update();
}

async function update() {
    // get inputted stats, clamp value to 0..99
    let total = [...document.getElementsByName("total")].map((elem) => {
        elem.value = Math.min(Math.max(elem.value, 0), 99) || null;
        return parseInt(elem.value) || 0;
    });

    // get added stats from items
    let items = itemStats(Object.values(await TALISMANS).concat(Object.values(await HELMETS)));

    // calculate best class
    let sorted = sortClasses(
        Object.values(await CLASSES),
        total.map((stat, i) => stat - items[i])
    );
    let best = sorted[0];

    // update document
    document.getElementsByName("initial").forEach((elem, i) => (elem.value = best.stats[i]));
    document.getElementsByName("final").forEach((elem, i) => {
        elem.value = Math.max(total[i] - items[i], best.stats[i]);
    });
    document.getElementsByName("virtual").forEach((elem, i) => {
        elem.value = Math.max(total[i], best.stats[i] + items[i]);
    });

    document.getElementById("initial-level").value = best.stats.reduce((sum, n) => sum + n) - 79;
    document.getElementById("final-level").value = best.total;
    document.getElementById("virtual-level").value = best.total + items.reduce((sum, n) => sum + n);

    // update best classes
    document.getElementById("best").value = best.name;
    let destination = document.getElementById("classes");
    destination.innerHTML = "";
    let template = document.getElementById("class");
    sorted.forEach((c) => {
        let clone = template.content.cloneNode(true);
        let li = clone.children[0];
        let span = li.children[0];
        let aside = li.children[1];

        span.innerHTML = c.name;
        aside.innerHTML = "lvl. " + c.total;

        destination.appendChild(clone);
    });

    // update talismans
    let talismans = [...document.getElementsByName("talisman")];

    if (talismans.filter((checkbox) => checkbox.checked).length >= 4) {
        talismans.forEach((checkbox) => (checkbox.disabled = !checkbox.checked));
    } else {
        talismans.forEach((checkbox) => (checkbox.disabled = false));
    }
}

function sortClasses(classes, desiredStats) {
    let deltas = classes.map((c) => {
        c.total = c.level + statDelta(c.stats, desiredStats);
        return c;
    });
    deltas.sort((a, b) => a.total - b.total);
    return deltas;
}

function statDelta(classStats, desiredStats) {
    return classStats.map((e, i) => (e < desiredStats[i] ? desiredStats[i] - e : 0)).reduce((total, n) => total + n);
}

function itemStats(relevantItems) {
    let helmet = document.getElementById("helmet").options[document.getElementById("helmet").selectedIndex].value;
    let talismans = [...document.getElementsByName("talisman")].filter((t) => t.checked).map((t) => t.value);

    ids = [helmet, ...talismans];
    let relevant = relevantItems.filter((item) => ids.includes(item.id));

    return relevant.reduce((total, item) => total.map((stat, i) => (stat += item.stats[i])), [0, 0, 0, 0, 0, 0, 0, 0]);
}

function reset() {
    document.getElementsByName("total").forEach((elem) => (elem.value = null));
    document.getElementById("helmet").selectedIndex = 0;
    [...document.getElementsByName("talisman")].forEach((elem) => (elem.checked = false));

    update();
}

function statsDescription(stats) {
    return stats.reduce((total, stat, i) => {
        return stat ? total + " +" + stat + STAT_SHORT_NAMES[i] : total;
    }, "");
}

function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
}
