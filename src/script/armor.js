let HELMETS;
let CHESTPIECES;
let GAUNTLETS;
let LEGGINGS;
let EQUIPMENT;
let ignored = [];

const populate = (select, items) =>
    items.forEach((item) => select.options.add(new Option(item.name, item.id)));
const selected = (select) => select.options[select.selectedIndex];

async function init() {
    [HELMETS, CHESTPIECES, GAUNTLETS, LEGGINGS] = await Promise.all([
        fetch("/data/helmets.json").then((response) =>
            Object.values(response.json())
        ),
        fetch("/data/chestpieces.json").then((response) =>
            Object.values(response.json())
        ),
        fetch("/data/gauntlets.json").then((response) =>
            Object.values(response.json())
        ),
        fetch("/data/leggings.json").then((response) =>
            Object.values(response.json())
        ),
    ]);
    EQUIPMENT = [HELMETS, CHESTPIECES, GAUNTLETS, LEGGINGS];

    // populate filter selects
    populate(document.getElementById("locked-helmet"), HELMETS);
    populate(document.getElementById("locked-chestpiece"), CHESTPIECES);
    populate(document.getElementById("locked-gauntlets"), GAUNTLETS);
    populate(document.getElementById("locked-leggings"), LEGGINGS);

    update();
}

function update() {
    // remove any previous results
    document.getElementById("results").innerHTML = "";

    // get budget & sort order
    let budget = equipLoadBudget();
    document.getElementById("equip-load-budget").value = budget.toFixed(1);
    let sortBy = [...document.getElementsByName("sorting-order")].find(
        (elem) => elem.checked
    ).id;

    // get locked items
    let lockedItems = [...document.getElementsByName("locked-items")].map(
        (select, i) => EQUIPMENT[i][select.selectedIndex - 1]
    );

    // pre-sort and eliminate some equipment
    let helmets = dominated(HELMETS, sortBy, lockedItems);
    let chestpieces = dominated(CHESTPIECES, sortBy, lockedItems);
    let gauntlets = dominated(GAUNTLETS, sortBy, lockedItems);
    let leggings = dominated(LEGGINGS, sortBy, lockedItems);

    let selection = permutations(
        [helmets, chestpieces, gauntlets, leggings],
        budget,
        lockedItems
    );

    // find best sets to display
    let best = knapSack(selection, sortBy);

    // show best sets under budget
    let template = document.getElementById("result");
    let destination = document.getElementById("results");
    best.forEach((set) => {
        let clone = template.content.cloneNode(true);
        let tbody = clone.children[1];
        let rows = tbody.children;

        [...rows].slice(1).forEach((row, i) => {
            let link = document.createElement("a");
            link.href =
                "https://eldenring.wiki.fextralife.com/" +
                set[i].name.replaceAll(" ", "+");
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            let ignoreButton = document.createElement("button");
            ignoreButton.onclick = () => {
                ignored.push(set[i].id);
                update();
            };
            ignoreButton.innerHTML = " ❌";
            ignoreButton.style =
                "margin-left: 5px; background-color: transparent; border: none";
            link.innerHTML = set[i].name;
            row.children[0].appendChild(link);
            row.children[0].appendChild(ignoreButton);
            let stats = itemStatsToString(set[i]);
            row.children[1].innerHTML = stats[0];
            row.children[2].innerHTML = stats[1];
        });
        let stats = setStatsToString(set);
        rows[0].children[1].innerHTML = stats[0];
        rows[0].children[2].innerHTML = stats[1];

        destination.appendChild(clone);
    });

    // display error message if sets is empty
    if (best.length == 0) {
        let error = document.createElement("b");
        error.innerHTML = "No sets found under budget";
        destination.appendChild(error);
    }

    // clear ignored items
    let ignoredList = document.getElementById("ignored-items");
    while (ignoredList.firstChild) {
        ignoredList.removeChild(ignoredList.firstChild);
    }

    // add ignored items to ignored list
    ignored.forEach((item) => {
        let li = document.createElement("li");
        let undoIgnoreButton = document.createElement("button");
        undoIgnoreButton.onclick = () => {
            ignored = ignored.filter((i) => i != item);
            update();
        };
        undoIgnoreButton.innerHTML = " 🗑";
        undoIgnoreButton.style = "background-color: green;";
        li.innerHTML = EQUIPMENT.find((set) => set[item]?.name)[item].name;
        li.appendChild(undoIgnoreButton);
        ignoredList.appendChild(li);
    });
}

function resetAll() {
    [...document.getElementsByName("locked-items")].forEach(
        (select) => (select.selectedIndex = 0)
    );
    update();
}

function dominated(itemList, sortBy, lockedItems) {
    if (lockedItems.some((item) => itemList.includes(item))) {
        return [itemList.find((item) => lockedItems.includes(item))];
    }

    // remove ignored items from itemList
    itemList = itemList.filter((item) => !ignored.includes(item.id));

    let sorted = [...itemList];
    sorted.sort((a, b) => a.weight - b.weight);

    let approved = [];
    sorted.forEach((item) => {
        if (
            !approved.some(
                (other) => fitness(item, sortBy) <= fitness(other, sortBy)
            )
        ) {
            approved.push(item);
        }
    });

    return approved;
}

function permutations(
    [helmets, chestpieces, gauntlets, leggings],
    budget,
    lockedItems
) {
    return helmets.flatMap((h) => {
        return chestpieces.flatMap((c) => {
            return gauntlets.flatMap((g) => {
                return leggings
                    .filter((l) => isAllowedSet([h, c, g, l], lockedItems))
                    .filter((l) => budget >= setWeight([h, c, g, l]))
                    .map((l) => [h, c, g, l]);
            });
        });
    });
}

function knapSack(selection, sortBy) {
    return selection.reduce((best, set) => {
        const index = best.findIndex(
            (element) => setFitness(element, sortBy) < setFitness(set, sortBy)
        );
        if (index !== -1) {
            best.splice(index, 0, set);
            best.pop();
        }
        return best;
    }, selection.slice(0, 5));
}

function fitness(item, sortBy) {
    switch (sortBy) {
        case "sort-average":
            return item.defenses.reduce((total, n) => total + n, 0) ?? 0;
        case "sort-standard":
            return (
                item.defenses.slice(0, 4).reduce((total, n) => total + n, 0) ??
                0
            );
        case "sort-physical":
            return item.defenses[0] ?? 0;
        case "sort-strike":
            return item.defenses[1] ?? 0;
        case "sort-slash":
            return item.defenses[2] ?? 0;
        case "sort-thrust":
            return item.defenses[3] ?? 0;
        case "sort-elemental":
            return (
                item.defenses.slice(4, 8).reduce((total, n) => total + n, 0) ??
                0
            );
        case "sort-magic":
            return item.defenses[4] ?? 0;
        case "sort-fire":
            return item.defenses[5] ?? 0;
        case "sort-lightning":
            return item.defenses[6] ?? 0;
        case "sort-holy":
            return item.defenses[7] ?? 0;
        case "sort-resistances":
            return item.resistances.reduce((total, n) => total + n, 0) ?? 0;
        case "sort-scarlet-rot":
            return item.resistances[0] ?? 0;
        case "sort-posion":
            return item.resistances[1] ?? 0;
        case "sort-blood-loss":
            return item.resistances[2] ?? 0;
        case "sort-freeze":
            return item.resistances[3] ?? 0;
        case "sort-sleep":
            return item.resistances[4] ?? 0;
        case "sort-madness":
            return item.resistances[5] ?? 0;
        case "sort-death":
            return item.resistances[6] ?? 0;
        case "sort-poise":
            return item.poise ?? 0;
    }
}

const setWeight = (set) =>
    (set.weight ??= set.reduce((total, item) => total + item.weight, 0));
const setFitness = (set, sortBy) => {
    if (!set.fitness) {
        set.fitness = set.reduce((total, item) => {
            if (!item.fitness) {
                item.fitness = fitness(item, sortBy);
            }
            return total + item.fitness;
        }, 0.0);
    }
    return set.fitness;
};
const isAllowedSet = (set, lockedItems) => [
    lockedItems.every((item) => item == undefined || set.includes(item)),
    ignored.every((item) => item == undefined || set.includes(item)),
];

function equipLoadBudget() {
    let rollModifier = parseFloat(
        [...document.getElementsByName("roll-type")].find(
            (elem) => elem.checked
        ).value
    );

    let max = document.getElementById("max-equip-load").value || 0;
    let current = document.getElementById("current-equip-load").value || 0;

    return parseFloat(Math.max(max * rollModifier - current, 0.0));
}

function itemStatsToString(item) {
    let weight = item.weight.toFixed(1) + " Weight, ";
    let poise = item.poise + " Poise, ";
    let standard =
        item.defenses
            .slice(0, 4)
            .reduce((total, defense) => total + defense, 0.0)
            .toFixed(1) + " Standard, ";
    let physical = item.defenses[0].toFixed(1) + " Physical, ";
    let strike = item.defenses[1].toFixed(1) + " Strike, ";
    let slash = item.defenses[2].toFixed(1) + " Slash, ";
    let thrust = item.defenses[3].toFixed(1) + " Thrust, ";
    let elemental =
        item.defenses
            .slice(4, 8)
            .reduce((total, defense) => total + defense, 0.0)
            .toFixed(1) + " Elemental, ";
    let magic = item.defenses[4].toFixed(1) + " Magic, ";
    let fire = item.defenses[5].toFixed(1) + " Fire, ";
    let lightning = item.defenses[6].toFixed(1) + " Lightning, ";
    let holy = item.defenses[7].toFixed(1) + " Holy, ";
    let resistances = item.resistances.reduce(
        (total, res, i) =>
            total +
            res +
            " " +
            [
                "Scarlet Rot",
                "Poison",
                "Blood Loss",
                "Frostbite",
                "Sleep",
                "Madness",
                "Death",
            ][i] +
            ", ",
        ""
    );

    return [
        weight +
            poise +
            standard +
            physical +
            strike +
            slash +
            thrust +
            "<br>" +
            elemental +
            magic +
            fire +
            lightning +
            holy,
        resistances,
    ];
}

function setStatsToString(set) {
    let imaginary = {
        weight: set[0].weight + set[1].weight + set[2].weight + set[3].weight,
        poise: set[0].poise + set[1].poise + set[2].poise + set[3].poise,
        defenses: set[0].defenses.map(
            (stat, i) =>
                stat +
                set[1].defenses[i] +
                set[2].defenses[i] +
                set[3].defenses[i]
        ),
        resistances: set[0].resistances.map(
            (stat, i) =>
                stat +
                set[1].resistances[i] +
                set[2].resistances[i] +
                set[3].resistances[i]
        ),
    };

    return itemStatsToString(imaginary);
}
