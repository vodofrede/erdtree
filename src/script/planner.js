let HELMETS;
let CHESTPIECES;
let GAUNTLETS;
let LEGGINGS;
let WEAPONS;
let TALISMANS;
let EQUIPMENT;
let CLASSES;
let INFUSIONS;

let startingClass = "wretch";
let popupActive = false;

let populate = (select, items) => items.forEach(item => select.options.add(new Option(item.name, item.id)));
let selected = select => select.options[select.selectedIndex];

async function init() {
    HELMETS = await fetch("/data/helmets.json").then(response => response.json());
    CHESTPIECES = await fetch("/data/chestpieces.json").then(response => response.json());
    GAUNTLETS = await fetch("/data/gauntlets.json").then(response => response.json());
    LEGGINGS = await fetch("/data/leggings.json").then(response => response.json());
    TALISMANS = await fetch("/data/talismans.json").then(response => response.json());
    WEAPONS = await fetch("/data/weapons.json").then(response => response.json());
    EQUIPMENT = { ...HELMETS, ...CHESTPIECES, ...GAUNTLETS, ...LEGGINGS, ...TALISMANS, ...WEAPONS };

    CLASSES = await fetch("/data/classes.json").then(response => response.json());
    INFUSIONS = await fetch("/data/infusions.json").then(response => response.json());

    // populate selects
    [...document.getElementsByName("weapon")].forEach(select => {
        populate(select, Object.values(WEAPONS));
    });
    populate(document.getElementById("helmet"), Object.values(HELMETS));
    populate(document.getElementById("chestpiece"), Object.values(CHESTPIECES));
    populate(document.getElementById("gauntlets"), Object.values(GAUNTLETS));
    populate(document.getElementById("leggings"), Object.values(LEGGINGS));
    [...document.getElementsByName("talisman")].forEach(select => {
        populate(select, Object.values(TALISMANS));
    });

    // override ctrl/cmd+s
    document.addEventListener("keydown", event => {
        if (!(event.isComposing || event.code === "229")) {
            if ((event.ctrlKey || event.metaKey) && event.key == "s") {
                event.preventDefault();
                exportBuild();
            }
        }
    });

    update();
}

function update() {
    // get current chosen starting class
    let classSelect = document.getElementById("class");
    let currentClass = CLASSES.find(c => c.id == classSelect.options[classSelect.selectedIndex].id);

    // item stats
    let itemStats = [...document.getElementsByName("armor"), ...document.getElementsByName("talisman")].reduce(
        (stats, select) => {
            let item = EQUIPMENT[select.options[select.selectedIndex].value];
            return stats.map((stat, i) => (item.stats != undefined ? stat + item.stats[i] : stat));
        },
        [0, 0, 0, 0, 0, 0, 0, 0],
    );

    if (currentClass != startingClass) {
        // reset stats if other class was chosen
        [...document.getElementsByName("final")].forEach((el, i) => {
            el.value = Math.min(currentClass.stats[i] + itemStats[i], 99);
        });
        startingClass = currentClass;
    } else {
        // clamp stat ranges
        [...document.getElementsByName("final")].forEach((el, i) => {
            el.value = Math.min(Math.max(currentClass.stats[i] + itemStats[i], el.value), 99);
        });
    }

    // show only available infusions for each weapon
    let weapons = [...document.getElementsByName("weapon")]
        .map(sl => sl.options[sl.selectedIndex].value)
        .map(id => WEAPONS[id]);
    let infusions = [...document.getElementsByName("infusion")];
    infusions
        .map((inf, i) => [weapons[i], inf])
        .forEach(([weapon, infusionSelect]) => {
            infusionSelect.length = 0;
            Object.keys(weapon.infusions).forEach(infusionId => {
                let infusion = INFUSIONS[infusionId];
                infusionSelect.options.add(new Option(infusion.name, infusion.id));
            });
        });

    // update infusion icons
    [...document.getElementsByName("infusion")].forEach(select => {});

    // calculate total level
    // document.getElementById("final-level").value = currentClass.level + additional.reduce((sum, n) => sum + n);
}

function importBuild(buildString) {}

function exportBuild() {
    let classSelect = document.getElementById("class");
    let itemStats = [...document.getElementsByName("armor"), ...document.getElementsByName("talisman")].reduce(
        (stats, select) => {
            let item = EQUIPMENT[selected(select).value];
            return stats.map((stat, i) => (item.stats != undefined ? stat + item.stats[i] : stat));
        },
        [0, 0, 0, 0, 0, 0, 0, 0],
    );
    console.log(itemStats);
    let build = {
        name: document.getElementById("name").value,
        class: classSelect.options[classSelect.selectedIndex].value,
        stats: [...document.getElementsByName("final")].map((stat, i) => stat.value - itemStats[i]),
        weapons: [...document.getElementsByName("weapon")].map(selected).map(w => w.value),
        infusions: [...document.getElementsByName("infusion")].map(selected).map(i => i.value),
        armor: [...document.getElementsByName("armor")].map(selected).map(a => a.value),
        talismans: [...document.getElementsByName("talisman")].map(selected).map(t => t.value),
    };

    let file = new Blob([JSON.stringify(build, null, 4)], { type: "text/plain" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "build-" + (build.name || build.class.toLowerCase()) + ".json";
    link.click();
}
