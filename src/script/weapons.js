let WEAPONS;
let INFUSIONS;
let CORRECTIONS;

async function init() {
    WEAPONS = await fetch("/data/weapons.json").then((response) => response.json());
    INFUSIONS = await fetch("/data/infusions.json").then((response) => response.json());
    CORRECTIONS = await fetch("/data/damage.json").then((response) => response.json());
    update();
}

function update() {
    // get information from document
    let allowedInfusions = [
        "standard",
        ...[...document.getElementsByName("infusion")].filter((elem) => elem.checked).map((elem) => elem.id),
    ];

    let upgraded = document.getElementById("max-upgrade").checked;
    let requireStats = document.getElementById("requirements").checked;
    let damageTypes = [...document.getElementsByName("damage-type")].map((el) => el.checked);

    let stats = [...document.getElementsByName("stat")].map((el) => parseInt(el.value));
    let twoHanding = document.getElementById("2handing").checked;
    if (twoHanding) {
        stats[0] = Math.floor(stats[0] * 1.5);
    }

    let filtered = filterWeapons(stats, requireStats, allowedInfusions, damageTypes);
    let sorted = sortWeapons(filtered, "standard", upgraded, stats);

    // show sorted list
    let destination = document.getElementById("weapons");
    let template = document.getElementById("weaponTemplate");
    sorted.forEach((weapon) => {
        let clone = template.content.cloneNode(true);

        let tr = clone.children[0];
        tr.children[0].innerHTML = weapon.name;
        tr.children[1].innerHTML = weapon.damage;

        destination.appendChild(clone);
    });
    console.log(sorted);
}

function filterWeapons(stats, requireStats, allowedInfusions, damageTypes) {
    let weapons = Object.values(WEAPONS).filter((weapon) => {
        return allowedInfusions.some((inf) => Object.values(weapon.infusions).includes(inf));
    });
    if (requireStats) {
        weapons = weapons.filter((weapon) => weapon.requirements.every((stat, i) => stat <= stats[i]));
    }

    return weapons;
}

function sortWeapons(weapons, infusionId, upgraded, stats) {
    return weapons.sort((a, b) => damage(b, infusionId, upgraded, stats) - damage(a, infusionId, upgraded, stats));
}

function damage(weapon, infusionId, upgraded, stats) {
    if (weapon.damage != undefined) {
        return weapon.damage;
    }

    let weaponInfusion = weapon.infusions[infusionId];
    let infusion = INFUSIONS[infusionId];
    let upgradeLevel = upgraded ? (weapon.unique ? 10 : 25) : 0;
    let bases = infusion.damage.map(
        (amount, ty) => weaponInfusion.damage[ty] * (amount + infusion.upgrade[ty] * upgradeLevel)
    );

    let extras;
    if (stats.some((stat, i) => stat <= weapon.requirements[i])) {
        extras = bases.map((dmg) => dmg * -0.4);
    } else {
        extras = bases.map((amount, ty) => {
            let calc = CORRECTIONS[weaponInfusion.corrections[ty]];
            let correction = typeCorrections(calc, stats, weaponInfusion.masks[ty]);
            let scalings = weaponInfusion.scaling.map((itemScaling) => {
                return (
                    itemScaling * infusion.scaling[ty] +
                    itemScaling * infusion.scaling[ty] * infusion.growth[ty] * upgradeLevel
                );
            });
            let extras = scalings.map((statScaling, statIndex) => {
                return (amount * statScaling * correction[statIndex]) / 100.0;
            });
            return extras.reduce((sum, n) => sum + n);
        });
    }

    let damage = Math.floor(bases.reduce((sum, n) => sum + n) + extras.reduce((sum, n) => sum + n));
    weapon.damage = damage;

    return damage;
}

function typeCorrections(calc, stats, masks) {
    return stats.map((stat, ty) => {
        let mask = masks[ty];
        if (mask == 0) {
            return 0.0;
        }

        let capIndex = calc.softcaps[ty].findIndex((cap) => cap >= stat) - 1;
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
