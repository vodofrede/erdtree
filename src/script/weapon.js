let WEAPONS;
let INFUSIONS;
let CORRECTIONS;

let order = "max";
let ascending = true;

async function init() {
    WEAPONS = await fetch("/data/weapons.json").then(response => response.json());
    INFUSIONS = await fetch("/data/infusions.json").then(response => response.json());
    CORRECTIONS = await fetch("/data/damage.json").then(response => response.json());
    update();
}

function update() {
    // get parameters
    let requireStats = document.getElementById("requirements").checked;
    let oneHandable = document.getElementById("2h-sometimes").checked;
    let twoHanding = document.getElementById("2h-always").checked || oneHandable;
    let allowedInfusions = [...document.getElementsByName("infusion")]
        .filter(elem => elem.checked)
        .map(elem => elem.value);
    let categories = [...document.getElementsByName("category")].filter(el => el.checked).map(el => el.id);
    let onlyBuffable = document.getElementById("buffable").checked;

    // get upgrade level
    let upgraded = document.getElementById("max-upgrade").checked;

    // get current stats
    let stats = [...document.getElementsByName("stat")].map(el => parseInt(el.value));
    if (twoHanding) {
        stats[0] = Math.floor(stats[0] * 1.5);
    }

    let infIndex = Object.values(INFUSIONS).findIndex(inf => inf.id == order);

    // update result table header to only include allowed infusions
    [...document.getElementsByName("damage-result")].forEach(ty => {
        ty.hidden = !allowedInfusions.includes(ty.id);
    });

    // clear table
    let destination = document.getElementById("weapons");
    destination.innerHTML = "";

    // fill table
    let template = document.getElementById("weapon");
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
                return ascending ? m2 - m1 : m1 - m2;
            } else {
                return ascending ? ar2[infIndex] - ar1[infIndex] : ar1[infIndex] - ar2[infIndex];
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
                tr.children[i + 2].innerHTML = ar || "-";
            });

            destination.appendChild(clone);
        });
}

function setAll(name, state) {
    [...document.getElementsByName(name), ...document.getElementsByClassName(name)].forEach(el => (el.checked = state));
    update();
}

function changeSort(newSort) {
    ascending = order == newSort ? !ascending : true;
    order = newSort;
    update();
}

function damage(weapon, infusion, upgraded, stats) {
    let weaponInfusion = weapon.infusions[infusion.id];
    let upgradeLevel = upgraded ? (weapon.unique ? 10 : 25) : 0;

    let base = infusion.damage.map(
        (amount, ty) => weaponInfusion.damage[ty] * (amount + infusion.upgrade[ty] * upgradeLevel),
    );

    let scaling = stats.some((stat, i) => stat < weapon.requirements[i])
        ? base.map(dmg => dmg * -0.4)
        : base.map((baseAmount, i) => {
              let statCorrection = corrections(
                  CORRECTIONS[weaponInfusion.corrections[i]],
                  stats,
                  weaponInfusion.masks[i],
              );
              let statScaling = weaponInfusion.scaling.map(itemScaling => {
                  return (
                      itemScaling * infusion.scaling[i] +
                      itemScaling * infusion.scaling[i] * infusion.growth[i] * upgradeLevel
                  );
              });
              return statScaling
                  .map((scaling, statIndex) => (baseAmount * scaling * statCorrection[statIndex]) / 100.0)
                  .reduce((sum, n) => sum + n);
          });

    return Math.floor(base.reduce((sum, n) => sum + n) + scaling.reduce((sum, n) => sum + n));
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
