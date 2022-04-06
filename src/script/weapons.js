let WEAPONS;
let INFUSIONS;
let CORRECTIONS;

let sort = "max";
let ascending = true;

async function init() {
    WEAPONS = await fetch("/data/weapons.json").then(response => response.json());
    INFUSIONS = await fetch("/data/infusions.json").then(response => response.json());
    CORRECTIONS = await fetch("/data/damage.json").then(response => response.json());
    update();
}

function update() {
    // get all parameters
    let categories = [...document.getElementsByName("category")].filter(el => el.checked).map(el => el.id);
    let upgraded = document.getElementById("max-upgrade").checked;
    let requireStats = document.getElementById("requirements").checked;
    let infIndex = Object.values(INFUSIONS).findIndex(inf => inf.id == sort);
    let allowedInfusions = [...document.getElementsByName("infusion")]
        .filter(elem => elem.checked)
        .map(elem => elem.value);
    let stats = [...document.getElementsByName("stat")].map(el => parseInt(el.value));
    let twoHanding = document.getElementById("2handing").checked;
    if (twoHanding) {
        stats[0] = Math.floor(stats[0] * 1.5);
    }

    // fill table
    let destination = document.getElementById("weapons");
    destination.innerHTML = ""; // clear table
    let template = document.getElementById("weapon");
    Object.values(WEAPONS)
        .filter(weapon => {
            return (
                (weapon.requirements.every((stat, i) => stat <= stats[i]) || !requireStats) &&
                categories.includes(weapon.category) &&
                allowedInfusions.some(id => weapon.infusions[id] != undefined)
            );
        })
        .map(weapon => {
            let attackRatings = Object.values(INFUSIONS)
                .filter(inf => allowedInfusions.includes(inf.id))
                .map(inf => {
                    return weapon.infusions[inf.id] != null ? damage(weapon, inf.id, upgraded, stats) : 0;
                });
            let max = Math.max(0, ...attackRatings);

            return [weapon, attackRatings, max];
        })
        .sort(([_w1, ar1, m1], [_w2, ar2, m2]) => {
            if (infIndex == -1) {
                // sort by max
                return ascending ? m2 - m1 : m1 - m2;
            } else {
                return ascending ? ar2[infIndex] - ar1[infIndex] : ar1[infIndex] - ar2[infIndex];
            }
        })
        .forEach(([weapon, attackRatings, max]) => {
            let clone = template.content.cloneNode(true);
            let tr = clone.children[0];

            tr.children[0].children[0].innerHTML = weapon.name;
            tr.children[0].children[0].href =
                weapon.id != "unarmed"
                    ? "https://eldenring.wiki.fextralife.com/" + weapon.name.replaceAll(" ", "+")
                    : "https://cdn.discordapp.com/attachments/410786957426163725/961366807460057158/unknown.png";

            tr.children[1].innerHTML = max || "-";
            attackRatings.forEach((ar, i) => {
                tr.children[i + 2].innerHTML = attackRatings[i] || "-";
            });

            destination.appendChild(clone);
        });

    // update result table header to only include allowed infusions
    [...document.getElementsByName("damage-result")].forEach(ty => {
        ty.hidden = !allowedInfusions.includes(ty.id);
    });
}

function filterWeapons(stats, requireStats, allowedInfusions, damageTypes) {
    let weapons = Object.values(WEAPONS).filter(weapon => {
        return allowedInfusions.some(inf => Object.values(weapon.infusions).includes(inf));
    });
    if (requireStats) {
        weapons = weapons.filter(weapon => weapon.requirements.every((stat, i) => stat <= stats[i]));
    }

    return weapons;
}

function sortWeapons(weapons, infusionId, upgraded, stats) {
    return weapons.sort((a, b) => damage(b, infusionId, upgraded, stats) - damage(a, infusionId, upgraded, stats));
}

function damage(weapon, infusionId, upgraded, stats) {
    let weaponInfusion = weapon.infusions[infusionId];
    let infusion = INFUSIONS[infusionId];
    let upgradeLevel = upgraded ? (weapon.unique ? 10 : 25) : 0;

    let base = infusion.damage.map(
        (amount, ty) => weaponInfusion.damage[ty] * (amount + infusion.upgrade[ty] * upgradeLevel),
    );

    let scaling = stats.some((stat, i) => stat < weapon.requirements[i])
        ? base.map(dmg => dmg * -0.4)
        : base.map((amount, ty) => {
              let statCorrection = corrections(
                  CORRECTIONS[weaponInfusion.corrections[ty]],
                  stats,
                  weaponInfusion.masks[ty],
              );
              let statScaling = weaponInfusion.scaling.map(itemScaling => {
                  return (
                      itemScaling * infusion.scaling[ty] +
                      itemScaling * infusion.scaling[ty] * infusion.growth[ty] * upgradeLevel
                  );
              });
              let scaling = statScaling.map((statScaling, statIndex) => {
                  return (amount * statScaling * statCorrection[statIndex]) / 100.0;
              });
              return scaling.reduce((sum, n) => sum + n);
          });

    return Math.floor(base.reduce((sum, n) => sum + n) + scaling.reduce((sum, n) => sum + n));
}

function corrections(calc, stats, masks) {
    return stats.map((stat, ty) => {
        if (masks[ty] == 0) {
            return 0.0;
        }

        let capIndex = calc.softcaps[ty].findIndex(cap => cap >= stat) - 1;
        let cap = calc.softcaps[ty][capIndex];
        let capDelta = (calc.softcaps[ty][capIndex + 1] || cap) - cap;
        let growth = calc.growth[ty][capIndex];
        let growthDelta = (calc.growth[ty][capIndex + 1] || growth) - growth;
        let adjust = calc.adjustments[ty][capIndex];

        if (Math.sign(adjust) != -1) {
            return growth + growthDelta * ((stat - cap) / capDelta) ** adjust;
        } else {
            return growth + growthDelta * (1 - (1 - (stat - cap) / capDelta) ** Math.abs(adjust));
        }
    });
}

function setAll(name, state) {
    [...document.getElementsByName(name), ...document.getElementsByClassName(name)].forEach(el => (el.checked = state));
    update();
}

function changeSort(newSort) {
    if (sort == newSort) {
        ascending = !ascending;
    } else {
        ascending = true;
    }
    sort = newSort;
    update();
}
