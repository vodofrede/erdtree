import { Correction } from "../util/types/correction";
import { Infusion } from "../util/types/infusion";
import { Weapon } from "../util/types/weapon";

let WEAPONS: Weapon[];
let INFUSIONS: Infusion[];
let CORRECTIONS: Correction[];

let dmgSortOrder = "max";
let dmgSortAscending = true;

async function init() {
    WEAPONS = await fetch("/data/weapons.json").then((response) =>
        response.json()
    );
    INFUSIONS = await fetch("/data/infusions.json").then((response) =>
        response.json()
    );
    CORRECTIONS = await fetch("/data/damage.json").then((response) =>
        response.json()
    );
    update();
}

export function update() {
    // clamp input stats
    let stats: number[] = [
        ...(document.getElementsByName("stat") as NodeListOf<HTMLInputElement>),
    ].map((el: HTMLInputElement) => {
        return parseInt(
            (el.value = Math.min(
                Math.max(parseInt(el.value), 0),
                99
            ).toString())
        );
    });

    // get parameters
    let requireStats = (
        document.getElementById("requirements") as HTMLInputElement
    ).checked;
    let oneHandable = (
        document.getElementById("2h-sometimes") as HTMLInputElement
    )?.checked;
    let twoHanding =
        (document.getElementById("2h-always") as HTMLInputElement)?.checked ||
        oneHandable;
    let allowedInfusions = [
        ...(document.getElementsByName(
            "infusion"
        ) as NodeListOf<HTMLInputElement>),
    ]
        .filter((elem) => elem.checked)
        .map((elem) => elem.value);
    let categories = [
        ...(document.getElementsByName(
            "category"
        ) as NodeListOf<HTMLInputElement>),
    ]
        .filter((el) => el.checked)
        .map((el) => el.id);
    let onlyBuffable = (document.getElementById("buffable") as HTMLInputElement)
        ?.checked;
    if (twoHanding) {
        stats[0] = Math.floor(stats[0] * 1.5);
    }
    let upgraded = (document.getElementById("max-upgrade") as HTMLInputElement)
        ?.checked;

    // update result table header to only include allowed infusions
    [...document.getElementsByName("damage-result")].forEach((ty) => {
        ty.hidden = !allowedInfusions.includes(ty.id);
    });

    // clear table
    let destination = document.getElementById("weapons");
    if (destination) {
        destination.innerHTML = "";
    }

    // fill damage table
    let template = document.getElementById("weapon")! as HTMLTemplateElement;
    let infIndex = Object.values(INFUSIONS).findIndex(
        (inf) => inf.id == dmgSortOrder
    );
    Object.values(WEAPONS)
        .filter((weapon) => {
            // filter out weapons that don't fit the current parameters
            return (
                (weapon.requirements.every(
                    (stat: number, i: number) => stat <= stats[i]
                ) ||
                    !requireStats) &&
                (weapon.requirements[0] <= Math.ceil(stats[0] / 1.5) ||
                    !oneHandable) &&
                categories.includes(weapon.category) &&
                allowedInfusions.some(
                    (id) =>
                        weapon.infusions.find((inf) => inf.id == id) !=
                        undefined
                ) &&
                (!onlyBuffable ||
                    Object.values(weapon.infusions).some((inf) => inf.buffable))
            );
        })
        .map((weapon) => {
            // calculate attack ratings for every allowed infusion as well as the maximum damage of any infusion
            let attackRatings = Object.values(INFUSIONS)
                .filter((inf) => allowedInfusions.includes(inf.id))
                .map((inf) => {
                    return weapon.infusions.find((i) => i.id == inf.id) != null
                        ? !onlyBuffable ||
                          weapon.infusions.find((i) => i.id == inf.id)?.buffable
                            ? damage(
                                  weapon,
                                  INFUSIONS.find((i) => i.id == inf.id)!,
                                  upgraded,
                                  stats
                              )
                            : 0
                        : 0;
                });
            let max = Math.max(0, ...attackRatings);

            return [weapon, attackRatings, max];
        })
        .sort(([_w1, ar1, max1], [_w2, ar2, max2]) => {
            // sort based on current sort order
            if (infIndex == -1) {
                // sort by max
                return dmgSortAscending
                    ? (max2 as number) - (max1 as number)
                    : (max1 as number) - (max2 as number);
            } else {
                return dmgSortAscending
                    ? (ar2 as number[])[infIndex] - (ar1 as number[])[infIndex]
                    : (ar1 as number[])[infIndex] - (ar2 as number[])[infIndex];
            }
        })
        .forEach(([weapon, attackRatings, max]) => {
            // clone and append table row to results with correct values
            let clone = template.content.cloneNode(true) as HTMLTemplateElement;
            let tr = clone.children[0];

            tr.children[0].children[0].innerHTML = (weapon as Weapon).name;
            // add a link to the fextralife wiki
            (tr.children[0].children[0] as HTMLAnchorElement).href =
                (weapon as Weapon).id != "unarmed"
                    ? "https://eldenring.wiki.fextralife.com/" +
                      (weapon as Weapon).name.replaceAll(" ", "+")
                    : "https://cdn.discordapp.com/attachments/410786957426163725/961366807460057158/unknown.png";

            tr.children[1].innerHTML = (max as number).toString() || "-";
            (attackRatings as number[]).forEach((ar: number, i: number) => {
                let elem = tr.children[i + 2] as HTMLTableCellElement;
                elem.innerHTML = ar.toString() || "-";
                if (ar == max) {
                    elem.style.fontWeight = "900";
                }
            });

            destination?.appendChild(clone);
        });
}

export function resetAll() {
    [
        ...(document.getElementsByName("stat") as NodeListOf<HTMLInputElement>),
    ].forEach((el) => (el.value = "10"));
    document.getElementById("max-upgrade")?.click();
    (document.getElementById("requirements") as HTMLInputElement).checked =
        true;
    (document.getElementById("buffable") as HTMLInputElement).checked = false;
    document.getElementById("2h-never")?.click();
    setAll("infusion", true);
    setAll("category", false);
    setAll("weapon", true);
}

export function setAll(name: string, state: boolean) {
    [
        ...(document.getElementsByName(name) as NodeListOf<HTMLInputElement>),
        ...(document.getElementsByClassName(
            name
        ) as HTMLCollectionOf<HTMLInputElement>),
    ].forEach((el) => (el.checked = state));
    update();
}

export function changeSort(newSort: string) {
    dmgSortAscending = dmgSortOrder == newSort ? !dmgSortAscending : true;
    dmgSortOrder = newSort;
    update();
}

function damage(
    weapon: Weapon,
    infusion: Infusion,
    upgraded: boolean,
    stats: number[]
) {
    let weaponInfusion = weapon.infusions.find((inf) => inf.id == infusion.id)!;
    let upgLevel = upgraded ? (weapon.unique ? 10 : 25) : 0;

    let baseDmg = infusion.damage.map(
        (dmg: number, ty: number) =>
            weaponInfusion.damage[ty] *
            (dmg +
                infusion.upgrade[ty] * upgLevel * (weapon.unique ? 2.5 : 1.0))
    );

    let scalingDmg = stats.some(
        (stat: number, i: number) => stat < weapon.requirements[i]
    )
        ? baseDmg.map((dmg: number) => dmg * -0.4)
        : baseDmg.map((dmg: number, ty: number) => {
              let calcCorrect = corrections(
                  CORRECTIONS.find(
                      (c) => c.id == weaponInfusion.corrections[ty]
                  )!,
                  stats,
                  weaponInfusion.masks[ty]
              );
              let statScaling = weaponInfusion.scaling.map(
                  (scaling: number) =>
                      infusion.scaling[ty] *
                      (scaling +
                          scaling *
                              infusion.growth[ty] *
                              upgLevel *
                              (weapon.unique ? 4.0 : 1.0))
              );
              return statScaling
                  .map(
                      (scaling: number, statIndex: number) =>
                          (dmg * scaling * calcCorrect[statIndex]) / 100.0
                  )
                  .reduce((sum: any, n: any) => sum + n);
          });

    return Math.floor(
        baseDmg.reduce((sum: any, n: any) => sum + n) +
            scalingDmg.reduce((sum: any, n: any) => sum + n)
    );
}

function auxiliary(
    weapon: Weapon,
    infusion: Infusion,
    upgraded: boolean,
    stats: number[]
) {
    const weaponInfusion = weapon.infusions.find(
        (inf) => inf.id == infusion.id
    )!;
    const upgLevel: number = upgraded ? (weapon.unique ? 10 : 25) : 0;

    let baseAux: [string, number][] = Object.entries(weaponInfusion.aux).map(
        ([type, [slope, intercept]]) => {
            if (typeof slope == "string") {
                slope = parseFloat(slope);
            }
            if (typeof intercept == "string") {
                intercept = parseInt(intercept);
            }
            return [type, Math.floor(slope * upgLevel + intercept)];
        }
    );

    let calcCorrect =
        corrections(CORRECTIONS["6"], stats, [0, 0, 0, 0, 1])[4] / 100.0;
    let statScaling =
        weaponInfusion.scaling[4] +
        weaponInfusion.scaling[4] *
            infusion.growth[4] *
            upgLevel *
            (weapon.unique ? 4.0 : 1.0);

    let extraAux =
        stats[4] >= weapon.requirements[4]
            ? baseAux.map(([_, aux]) => aux * calcCorrect * statScaling)
            : [0, 0, 0, 0, 0];

    return baseAux.map(([type, aux], i) => [type, aux + extraAux[i]]);
}

function corrections(calc: Correction, stats: number[], masks: number[]) {
    return stats.map((stat: number, ty: number) => {
        if (!masks[ty]) {
            return 0.0;
        }

        let capIndex =
            calc.softcaps[ty].findIndex((cap: number) => cap >= stat) - 1;
        let cap = calc.softcaps[ty][capIndex];
        let capDelta = (calc.softcaps[ty][capIndex + 1] || cap) - cap;
        let growth = calc.growth[ty][capIndex];
        let growthDelta = (calc.growth[ty][capIndex + 1] || growth) - growth;
        let adjust = calc.adjustments[ty][capIndex];

        return Math.sign(adjust) != -1
            ? growth + growthDelta * ((stat - cap) / capDelta) ** adjust
            : growth +
                  growthDelta *
                      (1 - (1 - (stat - cap) / capDelta) ** Math.abs(adjust));
    });
}
