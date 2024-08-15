import { Stat } from "../util/interfaces/stat";
import { Armor } from "../util/types/armor";
import { Class } from "../util/types/class";
import { Equippable } from "../util/types/equippable";
import { Talisman } from "../util/types/talisman";

let CLASSES: Class[];
let TALISMANS: Talisman[];
let HELMETS: Armor[];
const COMMONERS_GARB: Armor = (
    Object.values(require("../data/chestpieces.json")) as Armor[]
).find((value: Armor) => value.id == "commoners-garb")!;
const THIOLLIERS_GARB: Armor = (
    Object.values(require("../data/chestpieces.json")) as Armor[]
).find((value: Armor) => value.id == "thiolliers-garb")!;

const STAT_SHORT_NAMES = [
    "VIG",
    "MND",
    "END",
    "STR",
    "DEX",
    "INT",
    "FTH",
    "ARC",
];

const selected = (select: HTMLSelectElement) =>
    select?.options[select.selectedIndex];

async function init(): Promise<void> {
    // fetch and await data sources
    CLASSES = await fetch("/data/classes.json").then((response) =>
        response.json()
    );
    TALISMANS = await fetch("/data/talismans.json").then((response) =>
        response.json()
    );
    HELMETS = await fetch("/data/helmets.json").then((response) =>
        response.json()
    );

    // populate helmet select
    let destination: HTMLSelectElement = document.getElementById(
        "helmet"
    ) as HTMLSelectElement;
    Object.values(HELMETS)
        .filter((helmet) => helmet.stats != null)
        .forEach((helmet) =>
            destination?.options.add(new Option(helmet.name, helmet.id))
        );

    // populate talisman list
    let template = document.getElementById("talisman") as HTMLTemplateElement;
    destination = document.getElementById("talismans") as HTMLSelectElement;

    Object.values(TALISMANS)
        .filter(
            (talisman) =>
                talisman.stats != null && !talisman.id.includes("scar")
        )
        .forEach((item) => {
            let clone = template?.content.cloneNode(true) as ParentNode;
            let li = clone.children[0];

            let input = li.children[0].children[0] as HTMLInputElement;
            let label = li.children[0].children[1] as HTMLLabelElement;
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

export function update(): void {
    // get inputted stats, clamp value to 0..99
    let total: Stat = {};
    [
        ...(document.getElementsByName(
            "total"
        ) as NodeListOf<HTMLInputElement>),
    ].forEach((elem, i) => {
        elem.value =
            Math.min(Math.max(parseInt(elem.value), 0), 99).toString() || "0";
        total[STAT_SHORT_NAMES[i]] = parseInt(elem.value) || 0;
    });

    // get added stats from items
    let items: Stat = itemStats([
        ...Object.values(TALISMANS),
        ...Object.values(HELMETS),
        COMMONERS_GARB,
        THIOLLIERS_GARB,
    ]);

    // calculate best class
    Object.keys(total).forEach(
        (statId: string) => (total[statId] -= items[statId])
    );
    let sorted: Equippable[] = sortClasses(Object.values(CLASSES), total);
    let best = sorted[0];

    // update document
    (
        document.getElementsByName("initial") as NodeListOf<HTMLInputElement>
    ).forEach((elem, i) => (elem.value = best.stats![i].toString()));
    (
        document.getElementsByName("final") as NodeListOf<HTMLInputElement>
    ).forEach((elem, i) => {
        elem.value = Math.max(total[i] - items[i], best.stats![i]).toString();
    });
    (
        document.getElementsByName("virtual") as NodeListOf<HTMLInputElement>
    ).forEach((elem, i) => {
        elem.value = Math.max(total[i], best.stats![i] + items[i]).toString();
    });

    (document.getElementById("initial-level") as HTMLInputElement).value = (
        Object.values(best.stats!).reduce((sum: any, n: any) => sum + n) - 79
    ).toString();
    (document.getElementById("final-level") as HTMLInputElement).value =
        best.total!.toString();
    (document.getElementById("virtual-level") as HTMLInputElement).value = (
        best.total! + Object.values(items).reduce((sum: any, n: any) => sum + n)
    ).toString();

    // update best classes
    (document.getElementById("best") as HTMLInputElement).value = best.name;
    let destination = document.getElementById("classes");
    destination!.innerHTML = "";
    let template: HTMLTemplateElement = document.getElementById(
        "class"
    ) as HTMLTemplateElement;
    sorted.forEach((c: Equippable) => {
        let clone = template!.content.cloneNode(true) as ParentNode;
        let li = clone.children[0];
        let span = li.children[0];
        let aside = li.children[1];

        span.innerHTML = c.name;
        aside.innerHTML = "lvl. " + c.total;

        destination!.appendChild(clone);
    });

    // update talismans
    let talismans = [
        ...(document.getElementsByName(
            "talisman"
        ) as NodeListOf<HTMLInputElement>),
    ];
    if (talismans.filter((checkbox) => checkbox.checked).length >= 4) {
        talismans.forEach(
            (checkbox) => (checkbox.disabled = !checkbox.checked)
        );
    } else {
        talismans.forEach((checkbox) => (checkbox.disabled = false));
    }
}

function delta(classStats: Stat, final: Stat) {
    return Object.keys(classStats)
        .map((statId: string) =>
            classStats[statId] < final[statId]
                ? final[statId] - classStats[statId]
                : 0
        )
        .reduce((total: number, n: number) => total + n);
}

function sortClasses(classes: Class[], desiredStats: Stat) {
    return classes
        .map((c: Class) => {
            c.total = c.level + delta(c.stats, desiredStats);
            return c;
        })
        .sort((a: Class, b: Class) => a.total! - b.total!);
}

function itemStats(relevantItems: Equippable[]): Stat {
    let helmet = selected(
        document.getElementById("helmet") as HTMLSelectElement
    ).value;
    let talismans = [
        ...(document.getElementsByName(
            "talisman"
        ) as NodeListOf<HTMLInputElement>),
    ]
        .filter((t) => t.checked)
        .map((t) => t.value);

    let ids = [helmet, ...talismans];
    return relevantItems
        .filter((item: Equippable) => ids.includes(item.id))
        .reduce(
            (total: Stat, item: Equippable) =>
                Object.keys(total).reduce((acc: Stat, statId: string) => {
                    acc[statId] += item.stats![statId];
                    return acc;
                }, total),
            { VIG: 0, END: 0, MND: 0, STR: 0, DEX: 0, INT: 0, FTH: 0, ARC: 0 }
        );
}

export function resetAll() {
    (
        document.getElementsByName("total") as NodeListOf<HTMLInputElement>
    ).forEach((elem) => (elem.value = ""));
    (document.getElementById("helmet") as HTMLSelectElement).selectedIndex = 0;
    [
        ...(document.getElementsByName(
            "talisman"
        ) as NodeListOf<HTMLInputElement>),
    ].forEach((elem) => (elem.checked = false));

    update();
}

function statsDescription(stats: Stat): string {
    return Object.values(stats).reduce(
        (total: string, stat: number, i: number) => {
            return stat ? total + " +" + stat + STAT_SHORT_NAMES[i] : total;
        },
        ""
    );
}
