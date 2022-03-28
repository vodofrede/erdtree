const WEAPONS = fetch("/data/weapons.json")
    .then(response => response.json())
    .catch(error => console.log(error));
const INFUSIONS = fetch("/data/infusions.json")
    .then(response => response.json())
    .catch(error => console.log(error));
const CORRECTIONS = fetch("/data/damage.json")
    .then(response => response.json())
    .catch(error => console.log(error));

let weapons;
let infusions;
let corrections;

const sum = (a, b) => a + b;

async function init() {
    weapons = await WEAPONS;
    infusions = await INFUSIONS;
    corrections = await CORRECTIONS;

    update();
}

async function update() {
    let infusionId = [...document.getElementsByName("infusion")].find(radio => radio.checked).id;
    let upgradeLevel = 25;

    let stats = [...document.getElementsByName("stat")].map(el => parseInt(el.value));

    let sorted = sortWeapons(infusionId, upgradeLevel, stats);
    console.log(sorted);

    console.log(sorted.find(item => item.id == "royal-greatsword"))
}

function sortWeapons(infusionId, upgradeLevel, stats) {
    return Object.values(weapons).sort((a, b) => damage(b, infusionId, upgradeLevel, stats) - damage(a, infusionId, upgradeLevel, stats));
}

function damage(weapon, infusionId, upgradeLevel, stats) {
    if (weapon.total != undefined && weapon.total != null) {
        return weapon.total;
    }

    let weaponInfusion = weapon.infusions[infusionId];
    let infusion = infusions[infusionId];

    let bases = infusion.damage.map((amount, ty) => weaponInfusion.damage[ty] * (amount + infusion.upgrade[ty] * upgradeLevel));

    let extras;
    if (stats.some((stat, i) => stat <= weapon.requirements[i])) {
        extras = bases.map(dmg => dmg * -0.4);
    } else {
        extras = bases.map((amount, ty) => {
            let calc = corrections[weaponInfusion.corrections[ty]];
            let correction = typeCorrections(calc, stats, weaponInfusion.masks[ty]);
            let scalings = weaponInfusion.scaling.map(itemScaling => {
                return (itemScaling * infusion.scaling[ty] + itemScaling * infusion.scaling[ty] * infusion.growth[ty] * upgradeLevel);
            })
            let extras = scalings.map((statScaling, statIndex) => {
                return amount * statScaling * correction[statIndex] / 100.0;
            })
            return extras.reduce(sum);
        });
    }

    let total = Math.floor(bases.reduce(sum) + extras.reduce(sum));

    weapon.bases = bases;
    weapon.extras = extras;
    weapon.total = total;

    return total;
}

function typeCorrections(calc, stats, masks) {
    return stats.map((stat, ty) => {
        let mask = masks[ty];
        if (mask == 0) {
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
            return growth + growthDelta * (1 - (1 - ((stat - cap) / capDelta)) ** Math.abs(adjust));
        }
    })
}