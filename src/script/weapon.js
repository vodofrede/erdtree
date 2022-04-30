let WEAPONS;
let INFUSIONS;
let CORRECTIONS;

let dmgSortOrder = "max";
let dmgSortAscending = true;

async function init() {
    WEAPONS = await fetch("/data/weapons.json").then(response => response.json());
    INFUSIONS = await fetch("/data/infusions.json").then(response => response.json());
    CORRECTIONS = await fetch("/data/damage.json").then(response => response.json());
    update();
}

function update() {
    // clamp input stats
    let stats = [...document.getElementsByName("stat")].map(el => {
        return (el.value = Math.min(Math.max(parseInt(el.value), 0), 99));
    });

    // get parameters
    let requireStats = document.getElementById("requirements").checked;
    let oneHandable = document.getElementById("2h-sometimes").checked;
    let twoHanding = document.getElementById("2h-always").checked || oneHandable;
    let allowedInfusions = [...document.getElementsByName("infusion")]
        .filter(elem => elem.checked)
        .map(elem => elem.value);
    let categories = [...document.getElementsByName("category")].filter(el => el.checked).map(el => el.id);
    let onlyBuffable = document.getElementById("buffable").checked;
    if (twoHanding) {
        stats[0] = Math.floor(stats[0] * 1.5);
    }
    let upgraded = document.getElementById("max-upgrade").checked;

    // update result table header to only include allowed infusions
    [...document.getElementsByName("damage-result")].forEach(ty => {
        ty.hidden = !allowedInfusions.includes(ty.id);
    });

    // clear table
    let destination = document.getElementById("weapons");
    destination.innerHTML = "";

    // fill damage table
    let template = document.getElementById("weapon");
    let infIndex = Object.values(INFUSIONS).findIndex(inf => inf.id == dmgSortOrder);
    Object.values(WEAPONS)
        .filter(weapon => {
            // filter out weapons that don't fit the current parameters
            return (
                (weapon.requirements.every((stat, i) => stat <= stats[i]) || !requireStats) &&
                (weapon.requirements[0] <= Math.ceil(stats[0] / 1.5) || !oneHandable) &&
                categories.includes(weapon.category) &&
                allowedInfusions.some(id => weapon.infusions[id] != undefined) &&
                (!onlyBuffable || Object.values(weapon.infusions).some(inf => inf.buffable))
            );
        })
        .map(weapon => {
            // calculate attack ratings for every allowed infusion as well as the maximum damage of any infusion
            let attackRatings = Object.values(INFUSIONS)
                .filter(inf => allowedInfusions.includes(inf.id))
                .map(inf => {
                    return weapon.infusions[inf.id] != null
                        ? !onlyBuffable || weapon.infusions[inf.id].buffable
                            ? damage(weapon, INFUSIONS[inf.id], upgraded, stats)
                            : 0
                        : 0;
                });
            let max = Math.max(0, ...attackRatings);

            return [weapon, attackRatings, max];
        })
        .sort(([_w1, ar1, m1], [_w2, ar2, m2]) => {
            // sort based on current sort order
            if (infIndex == -1) {
                // sort by max
                return dmgSortAscending ? m2 - m1 : m1 - m2;
            } else {
                return dmgSortAscending ? ar2[infIndex] - ar1[infIndex] : ar1[infIndex] - ar2[infIndex];
            }
        })
        .forEach(([weapon, attackRatings, max]) => {
            // clone and append table row to results with correct values
            let clone = template.content.cloneNode(true);
            let tr = clone.children[0];

            tr.children[0].children[0].innerHTML = weapon.name;
            // add a link to the fextralife wiki
            tr.children[0].children[0].href =
                weapon.id != "unarmed"
                    ? "https://eldenring.wiki.fextralife.com/" + weapon.name.replaceAll(" ", "+")
                    : "https://cdn.discordapp.com/attachments/410786957426163725/961366807460057158/unknown.png";

            tr.children[1].innerHTML = max || "-";
            attackRatings.forEach((ar, i) => {
                let elem = tr.children[i + 2];
                elem.innerHTML = ar || "-";
                if (ar == max) {
                    elem.style.fontWeight = "900";
                }
            });

            destination.appendChild(clone);
        });
}

function resetAll() {
    [...document.getElementsByName("stat")].forEach(el => (el.value = 10));
    document.getElementById("max-upgrade").click();
    document.getElementById("requirements").checked = true;
    document.getElementById("buffable").checked = false;
    document.getElementById("2h-never").click();
    setAll("infusion", true);
    setAll("category", false);
    setAll("weapon", true);
}

function setAll(name, state) {
    [...document.getElementsByName(name), ...document.getElementsByClassName(name)].forEach(el => (el.checked = state));
    update();
}

function changeSort(newSort) {
    dmgSortAscending = dmgSortOrder == newSort ? !dmgSortAscending : true;
    dmgSortOrder = newSort;
    update();
}

function damage(weapon, infusion, upgraded, stats) {
    let weaponInfusion = weapon.infusions[infusion.id];
    let upgLevel = upgraded ? (weapon.unique ? 10 : 25) : 0;

    let baseDmg = infusion.damage.map(
        (dmg, ty) => weaponInfusion.damage[ty] * (dmg + infusion.upgrade[ty] * upgLevel * (weapon.unique ? 2.5 : 1.0)),
    );

    let scalingDmg = stats.some((stat, i) => stat < weapon.requirements[i])
        ? baseDmg.map(dmg => dmg * -0.4)
        : baseDmg.map((dmg, ty) => {
              let calcCorrect = corrections(
                  CORRECTIONS[weaponInfusion.corrections[ty]],
                  stats,
                  weaponInfusion.masks[ty],
              );
              let statScaling = weaponInfusion.scaling.map(
                  scaling =>
                      infusion.scaling[ty] *
                      (scaling + scaling * infusion.growth[ty] * upgLevel * (weapon.unique ? 4.0 : 1.0)),
              );
              return statScaling
                  .map((scaling, statIndex) => (dmg * scaling * calcCorrect[statIndex]) / 100.0)
                  .reduce((sum, n) => sum + n);
          });

    return Math.floor(baseDmg.reduce((sum, n) => sum + n) + scalingDmg.reduce((sum, n) => sum + n));
}

function auxiliary(weapon, infusion, upgraded, stats) {
    const weaponInfusion = weapon.infusions[infusion.id];
    const upgLevel = upgraded ? (weapon.unique ? 10 : 25) : 0;

    let baseAux = Object.entries(weaponInfusion.aux).map(([ty, [a, b]]) => [ty, Math.floor(a * upgLevel + b)]);

    let calcCorrect = corrections(CORRECTIONS["6"], stats, [0, 0, 0, 0, 1])[4] / 100.0;
    let statScaling =
        weaponInfusion.scaling[4] +
        weaponInfusion.scaling[4] * infusion.growth[4] * upgLevel * (weapon.unique ? 4.0 : 1.0);

    let extraAux = stats[4] >= weapon.requirements[4] ? baseAux.map(([_, aux]) => aux * calcCorrect * statScaling) : 0;

    return baseAux.map(([ty, aux], i) => [ty, aux + extraAux[i]]);
}

function corrections(calc, stats, masks) {
    return stats.map((stat, ty) => {
        if (!masks[ty]) {
            return 0.0;
        }

        let capIndex = calc.softcaps[ty].findIndex(cap => cap >= stat) - 1;
        let cap = calc.softcaps[ty][capIndex];
        let capDelta = (calc.softcaps[ty][capIndex + 1] || cap) - cap;
        let growth = calc.growth[ty][capIndex];
        let growthDelta = (calc.growth[ty][capIndex + 1] || growth) - growth;
        let adjust = calc.adjustments[ty][capIndex];

        return Math.sign(adjust) != -1
            ? growth + growthDelta * ((stat - cap) / capDelta) ** adjust
            : growth + growthDelta * (1 - (1 - (stat - cap) / capDelta) ** Math.abs(adjust));
    });
}
