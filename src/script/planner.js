const HELMETS = fetch("/data/armor/helmets.json")
    .then(response => response.json())
    .catch(error => console.log(error));
const CHESTPIECES = fetch("/data/armor/chestpieces.json")
    .then(response => response.json())
    .catch(error => console.log(error));
const GAUNTLETS = fetch("/data/armor/gauntlets.json")
    .then(response => response.json())
    .catch(error => console.log(error));
const LEGGINGS = fetch("/data/armor/leggings.json")
    .then(response => response.json())
    .catch(error => console.log(error));
const WEAPONS = fetch("/data/weapons.json")
    .then(response => response.json())
    .catch(error => console.log(error));
const TALISMANS = fetch("/data/talismans.json")
    .then(response => response.json())
    .catch(error => console.log(error));

const CLASSES = fetch("/data/classes.json")
    .then(response => response.json())
    .catch(error => console.log(error));

let startingClass;

async function init() {
    await populate();
    await update();
}

async function update() {
    // get current chosen starting class
    let classSelect = document.getElementById("class");
    let currentClass = await (CLASSES.then(classes => {
        return classes.find(c => c.id == classSelect.options[classSelect.selectedIndex].id);
    }));

    // get virtual stats
    let items = await itemStats();
    console.log(items);

    // update statistics screen
    let prevClass = startingClass ?? currentClass;
    [...document.getElementsByName("stat")].forEach((stat, i) => {
        stat.value = ((stat.value == "" || (stat.value - parseInt(items[i])) == prevClass.stats[i]) ? currentClass.stats[i] + parseInt(items[i]) : parseInt(stat.value) + parseInt(items[i]));
    });
    document.getElementById("level").value = [...document.getElementsByName("stat")]
        .reduce((total, stat) => total + parseInt(stat.value), 0) - 79;
    startingClass = currentClass;
}

function reset(area) {
    switch (area) {
        case "equipment":
            let types = ["helmets", "chestpieces", "gauntlets", "leggings", "weapons", "talismans"];
            types.forEach(ty => {
                let selects = [...document.getElementsByName(ty)];
                selects.forEach(select => {
                    select.selectedIndex = 0;
                })
            })
            break;
        case "statistics":
            document.getElementById("class").selectedIndex = 0;
            [...document.getElementsByName("stat")].forEach(stat => stat.value = 10);
            break;
        default:
            break;
    }
    update();
}

async function itemStats() {
    let helmet = document.getElementById("helmet");
    let talismans = document.getElementsByName("talismans");
    let ids = [helmet, ...talismans]
        .map(elem => elem.options[elem.selectedIndex].value)
        .filter(id => !id.startsWith("no-"));
    let relevant = [await HELMETS, await TALISMANS].flat().filter(item => ids.includes(item.id));

    return relevant.reduce((total, item) => total.map((stat, i) => stat += item.stats[i]), [0, 0, 0, 0, 0, 0, 0, 0]);
}

async function populate() {
    Promise.all([HELMETS, CHESTPIECES, GAUNTLETS, LEGGINGS, WEAPONS, TALISMANS]).then(itemTypes => {
        itemTypes.forEach((itemType, i) => {
            let ty = ["helmets", "chestpieces", "gauntlets", "leggings", "weapons", "talismans"][i];
            let selects = [...document.getElementsByName(ty)];
            selects.forEach(select => {
                itemType.forEach(item => {
                    select.options.add(new Option(item.name, item.id));
                })
            })
        });
    });
}