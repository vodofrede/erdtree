import { Armor } from "../util/types/armor";
import { Set } from "../util/types/set";

let HELMETS: Armor[];
let CHESTPIECES: Armor[];
let GAUNTLETS: Armor[];
let LEGGINGS: Armor[];
let EQUIPMENT: Armor[][];
let ignored: string[] = [];

const populate = (select: HTMLSelectElement, items: any[]) =>
    items.forEach(
        (item: { name: string | undefined; id: string | undefined }) =>
            select.options.add(new Option(item.name, item.id))
    );
const selected = (select: {
    options: { [x: string]: any };
    selectedIndex: string | number;
}) => select.options[select.selectedIndex];

export async function init() {
    EQUIPMENT = (
        await Promise.all([
            fetch("/data/helmets").then((r) => r.json()),
            fetch("/data/chestpieces").then((r) => r.json()),
            fetch("/data/gauntlets").then((r) => r.json()),
            fetch("/data/leggings").then((r) => r.json()),
        ])
    ).map((json) => Object.values(json));
    [HELMETS, CHESTPIECES, GAUNTLETS, LEGGINGS] = EQUIPMENT;

    // populate filter selects
    let lockedHelmetSelect = document.getElementById(
        "locked-helmet"
    ) as HTMLSelectElement;
    let lockedChestpieceSelect = document.getElementById(
        "locked-chestpiece"
    ) as HTMLSelectElement;
    let lockedGauntletSelect = document.getElementById(
        "locked-gauntlets"
    ) as HTMLSelectElement;
    let lockedLeggingsSelect = document.getElementById(
        "locked-leggings"
    ) as HTMLSelectElement;
    if (lockedHelmetSelect) {
        populate(lockedHelmetSelect, HELMETS);
    }
    if (lockedChestpieceSelect) {
        populate(lockedChestpieceSelect, CHESTPIECES);
    }
    if (lockedGauntletSelect) {
        populate(lockedGauntletSelect, GAUNTLETS);
    }
    if (lockedLeggingsSelect) {
        populate(lockedLeggingsSelect, LEGGINGS);
    }
    update();
}

export function update() {
    // remove any previous results
    let resultsTable = document.getElementById("results") as HTMLTableElement;
    if (resultsTable) {
        resultsTable.innerHTML = "";
    }

    // get budget & sort order
    let budget = equipLoadBudget();
    let equipLoadBudgetInput = document.getElementById(
        "equip-load-budget"
    ) as HTMLInputElement;
    if (equipLoadBudgetInput) {
        equipLoadBudgetInput.value = budget?.toFixed(1);
    }
    let sortingOrderInputs = [
        ...(document.getElementsByName(
            "sorting-order"
        ) as NodeListOf<HTMLInputElement>),
    ].find((elem) => elem.checked);
    let sortBy;
    if (sortingOrderInputs) {
        sortBy = sortingOrderInputs.id;
    }

    // get locked items
    let lockedItems = [
        ...(document.getElementsByName(
            "locked-items"
        ) as NodeListOf<HTMLSelectElement>),
    ].map(
        (select: HTMLSelectElement, i: number) =>
            EQUIPMENT[i][select.selectedIndex - 1]
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
    let template = document.getElementById("result") as HTMLTemplateElement;
    let destination = document.getElementById("results");
    best.forEach((set: Set) => {
        let clone = template?.content.cloneNode(true) as DocumentFragment;
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
            ignoreButton.style.marginLeft = "5px";
            ignoreButton.style.backgroundColor = "transparent";
            ignoreButton.style.border = "none";
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

        destination?.appendChild(clone);
    });

    // display error message if sets is empty
    if (best.length == 0) {
        let error = document.createElement("b");
        error.innerHTML = "No sets found under budget";
        destination?.appendChild(error);
    }

    // clear ignored items
    let ignoredList = document.getElementById("ignored-items");
    while (ignoredList?.firstChild) {
        ignoredList.removeChild(ignoredList.firstChild);
    }

    // add ignored items to ignored list
    ignored.forEach((itemId) => {
        let li = document.createElement("li");
        let undoIgnoreButton = document.createElement("button");
        undoIgnoreButton.onclick = () => {
            ignored = ignored.filter((i) => i != itemId);
            update();
        };
        undoIgnoreButton.innerHTML = " 🗑";
        undoIgnoreButton.style.backgroundColor = "green";
        let set = EQUIPMENT.find((set: Armor[]) =>
            set.find((i: Armor) => i.id == itemId)
        );
        if (set) {
            let ignoredItem = set.find((i: Armor) => i.id == itemId);
            if (ignoredItem) {
                li.innerHTML = ignoredItem.name;
            }
        }
        li.appendChild(undoIgnoreButton);
        ignoredList?.appendChild(li);
    });
}

export function resetAll() {
    [
        ...(document.getElementsByName(
            "locked-items"
        ) as NodeListOf<HTMLSelectElement>),
    ].forEach((select) => (select.selectedIndex = 0));
    update();
}

function dominated(itemList: any[], sortBy: any, lockedItems: any[]) {
    if (lockedItems.some((item: any) => itemList.includes(item))) {
        return [itemList.find((item: any) => lockedItems.includes(item))];
    }

    // remove ignored items from itemList
    itemList = itemList.filter(
        (item: { id: any }) => !ignored.includes(item.id)
    );

    let sorted = [...itemList];
    sorted.sort((a, b) => a.weight - b.weight);

    let approved: any[] = [];
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
    [helmets, chestpieces, gauntlets, leggings]: [
        Armor[],
        Armor[],
        Armor[],
        Armor[]
    ],
    budget: number,
    lockedItems: Armor[]
) {
    return helmets.flatMap((h: Armor) => {
        return chestpieces.flatMap((c: Armor) => {
            return gauntlets.flatMap((g: Armor) => {
                return leggings
                    .filter((l: Armor) =>
                        isAllowedSet([h, c, g, l], lockedItems)
                    )
                    .filter((l: Armor) => budget >= setWeight([h, c, g, l]))
                    .map((l: Armor) => [h, c, g, l]);
            });
        });
    });
}

function knapSack(selection: any[], sortBy: any) {
    return selection.reduce((best: any[], set: any) => {
        const index = best.findIndex(
            (element: any) =>
                setFitness(element, sortBy) < setFitness(set, sortBy)
        );
        if (index !== -1) {
            best.splice(index, 0, set);
            best.pop();
        }
        return best;
    }, selection.slice(0, 5));
}

function fitness(item: Armor, sortBy: string): number {
    switch (sortBy) {
        case "sort-average":
            return (
                Object.values(item.defenses).reduce(
                    (total: any, n) => total + n,
                    0
                ) ?? 0
            );
        case "sort-standard":
            return (
                [
                    item.defenses.physical,
                    item.defenses.strike,
                    item.defenses.slash,
                    item.defenses.pierce,
                ].reduce((total, n) => total + n, 0) ?? 0
            );
        case "sort-physical":
            return item.defenses.physical ?? 0;
        case "sort-strike":
            return item.defenses.strike ?? 0;
        case "sort-slash":
            return item.defenses.slash ?? 0;
        case "sort-pierce":
            return item.defenses.pierce ?? 0;
        case "sort-elemental":
            return (
                [
                    item.defenses.magic,
                    item.defenses.fire,
                    item.defenses.lightning,
                    item.defenses.holy,
                ].reduce((total, n) => total + n, 0) ?? 0
            );
        case "sort-magic":
            return item.defenses.magic ?? 0;
        case "sort-fire":
            return item.defenses.fire ?? 0;
        case "sort-lightning":
            return item.defenses.lightning ?? 0;
        case "sort-holy":
            return item.defenses.holy ?? 0;
        case "sort-resistances":
            return (
                Object.values(item.resistances).reduce(
                    (total, n) => total + n,
                    0
                ) ?? 0
            );
        case "sort-scarlet-rot":
            return item.resistances.scarletRot ?? 0;
        case "sort-poison":
            return item.resistances.poison ?? 0;
        case "sort-hemorrhage":
            return item.resistances.hemorrhage ?? 0;
        case "sort-frostbite":
            return item.resistances.frostbite ?? 0;
        case "sort-sleep":
            return item.resistances.sleep ?? 0;
        case "sort-madness":
            return item.resistances.madness ?? 0;
        case "sort-death":
            return item.resistances.deathBlight ?? 0;
        case "sort-poise":
            return item.poise ?? 0;
        default:
            return -1;
    }
}

const setWeight = (set: Set) =>
    (set.weight ??= set.reduce(
        (total: number, item: Armor) => total + item.weight,
        0
    ));
const setFitness = (set: Set, sortBy: any) => {
    if (!set.fitness) {
        set.fitness = set.reduce((total: number, item: Armor) => {
            if (!item.fitness) {
                item.fitness = fitness(item, sortBy);
            }
            return total + item.fitness;
        }, 0.0);
    }
    return set.fitness;
};
const isAllowedSet = (set: string | any[], lockedItems: any[]) => [
    lockedItems.every(
        (item: undefined) => item == undefined || set.includes(item)
    ),
    ignored.every((item) => item == undefined || set.includes(item)),
];

function equipLoadBudget(): number {
    let selectedRollType = [
        ...(document.getElementsByName(
            "roll-type"
        ) as NodeListOf<HTMLInputElement>),
    ].find((elem) => elem.checked);
    let rollModifier;
    if (selectedRollType) {
        rollModifier = parseFloat(selectedRollType.value);
    } else {
        rollModifier = 0.0;
    }

    let maxEquipLoadInput = document.getElementById(
        "max-equip-load"
    ) as HTMLInputElement;
    let currentEquipLoadInput = document.getElementById(
        "current-equip-load"
    ) as HTMLInputElement;
    let max;
    let current;
    if (maxEquipLoadInput) {
        max = parseFloat(maxEquipLoadInput.value);
    } else {
        max = 0;
    }
    if (currentEquipLoadInput) {
        current = parseFloat(currentEquipLoadInput.value);
    } else {
        current = 0;
    }

    return Math.max(max * rollModifier - current, 0.0);
}

function itemStatsToString(item: Armor): string[] {
    let weight = item.weight.toFixed(1) + " Weight, ";
    let poise = item.poise + " Poise, ";
    let standard =
        [
            item.defenses.physical,
            item.defenses.strike,
            item.defenses.slash,
            item.defenses.pierce,
        ]
            .reduce((total, defense) => total + defense, 0.0)
            .toFixed(1) + " Standard, ";
    let physical = item.defenses.physical.toFixed(1) + " Physical, ";
    let strike = item.defenses.strike.toFixed(1) + " Strike, ";
    let slash = item.defenses.slash.toFixed(1) + " Slash, ";
    let pierce = item.defenses.pierce.toFixed(1) + " Pierce, ";
    let elemental =
        [
            item.defenses.magic,
            item.defenses.fire,
            item.defenses.lightning,
            item.defenses.holy,
        ]
            .reduce((total, defense) => total + defense, 0.0)
            .toFixed(1) + " Elemental, ";
    let magic = item.defenses.magic.toFixed(1) + " Magic, ";
    let fire = item.defenses.fire.toFixed(1) + " Fire, ";
    let lightning = item.defenses.lightning.toFixed(1) + " Lightning, ";
    let holy = item.defenses.holy.toFixed(1) + " Holy, ";
    let resistances = Object.values(item.resistances).reduce(
        (total: any, res: any, i: number) =>
            total +
            res +
            " " +
            [
                "Scarlet Rot",
                "Poison",
                "Hemorrhage",
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
            pierce +
            "<br>" +
            elemental +
            magic +
            fire +
            lightning +
            holy,
        resistances,
    ];
}

function setStatsToString(set: Set) {
    let imaginary: Armor = {
        id: "IMAGINARY",
        name: "IMAGINARY",
        weight: set[0].weight + set[1].weight + set[2].weight + set[3].weight,
        poise: set[0].poise + set[1].poise + set[2].poise + set[3].poise,
        defenses: {
            physical:
                set[0].defenses.physical +
                set[1].defenses.physical +
                set[2].defenses.physical +
                set[3].defenses.physical,
            strike:
                set[0].defenses.strike +
                set[1].defenses.strike +
                set[2].defenses.strike +
                set[3].defenses.strike,
            slash:
                set[0].defenses.slash +
                set[1].defenses.slash +
                set[2].defenses.slash +
                set[3].defenses.slash,
            pierce:
                set[0].defenses.pierce +
                set[1].defenses.pierce +
                set[2].defenses.pierce +
                set[3].defenses.pierce,
            magic:
                set[0].defenses.magic +
                set[1].defenses.magic +
                set[2].defenses.magic +
                set[3].defenses.magic,
            fire:
                set[0].defenses.fire +
                set[1].defenses.fire +
                set[2].defenses.fire +
                set[3].defenses.fire,
            lightning:
                set[0].defenses.lightning +
                set[1].defenses.lightning +
                set[2].defenses.lightning +
                set[3].defenses.lightning,
            holy:
                set[0].defenses.holy +
                set[1].defenses.holy +
                set[2].defenses.holy +
                set[3].defenses.holy,
        },
        resistances: {
            scarletRot:
                set[0].resistances.scarletRot +
                set[1].resistances.scarletRot +
                set[2].resistances.scarletRot +
                set[3].resistances.scarletRot,
            poison:
                set[0].resistances.poison +
                set[1].resistances.poison +
                set[2].resistances.poison +
                set[3].resistances.poison,
            hemorrhage:
                set[0].resistances.hemorrhage +
                set[1].resistances.hemorrhage +
                set[2].resistances.hemorrhage +
                set[3].resistances.hemorrhage,
            frostbite:
                set[0].resistances.frostbite +
                set[1].resistances.frostbite +
                set[2].resistances.frostbite +
                set[3].resistances.frostbite,
            sleep:
                set[0].resistances.sleep +
                set[1].resistances.sleep +
                set[2].resistances.sleep +
                set[3].resistances.sleep,
            madness:
                set[0].resistances.madness +
                set[1].resistances.madness +
                set[2].resistances.madness +
                set[3].resistances.madness,
            deathBlight:
                set[0].resistances.deathBlight +
                set[1].resistances.deathBlight +
                set[2].resistances.deathBlight +
                set[3].resistances.deathBlight,
        },
    };

    return itemStatsToString(imaginary);
}
