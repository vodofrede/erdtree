"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { DAMAGE_TYPE_NAMES } from "../util/constants";
import DamageTypeMap from "../util/interfaces/damageTypeMap";
import { InfusionMap } from "../util/interfaces/infusionMap";
import StatMap from "../util/interfaces/statMap";
import WeaponInfusion from "../util/interfaces/weaponInfusion";
import { Correction } from "../util/types/correction";
import { Infusion } from "../util/types/infusion";
import { Weapon } from "../util/types/weapon";
import { WeaponResultRow } from "./WeaponResultRow";

// GLOBAL CONSTANTS
const WEAPONS: Weapon[] = Object.values(require("../data/weapons.json"));
const INFUSIONS: Infusion[] = Object.values(require("../data/infusions.json"));
const CORRECTIONS: Correction[] = Object.values(require("../data/damage.json"));
const INFUSION_NAMES: string[] = INFUSIONS.map((inf) => inf.name);
const CATEGORY_NAMES: string[][] = [
    [
        "Daggers",
        "Straight Swords",
        "Greatswords",
        "Colossal Swords",
        "Thrusting Swords",
        "Heavy Thrusting Swords",
        "Curved Swords",
        "Curved Greatswords",
        "Katanas",
        "Twinblades",
        "Hammers",
        "Great Hammers",
        "Flails",
        "Axes",
        "Greataxes",
        "Spears",
        "Great Spears",
        "Halberds",
        "Scythes",
        "Whips",
        "Fists",
        "Claws",
        "Colossal Weapons",
        "Torches",
        "Thrusting Shield",
        "Hand-to-Hand Arts",
        "Throwing Blades",
        "Backhand Blades",
        "Perfume Bottles",
        "Beast Claws",
        "Light Greatsword",
        "Great Katana",
    ],
    ["Light Bows", "Bows", "Greatbows", "Crossbows", "Ballistae"],
    ["Small Shields", "Medium Shields", "Greatshields"],
    ["Glintstone Staves", "Sacred Seals"],
];
const DAMAGE_TYPE_MODE_ANY: string = "any";
const DAMAGE_TYPE_MODE_All: string = "all";
const DAMAGE_TYPE_MODE_EXACTLY: string = "exactly";

// INTERFACES
interface WeaponTypeMap<T> {
    [key: string]: T;
    dagger: T;
    "straight-sword": T;
    greatsword: T;
    "colossal-sword": T;
    "thrusting-sword": T;
    "heavy-thrusting-sword": T;
    "curved-sword": T;
    "curved-greatsword": T;
    katana: T;
    twinblade: T;
    hammer: T;
    "great-hammer": T;
    flail: T;
    axe: T;
    greataxe: T;
    spear: T;
    "great-spear": T;
    halberd: T;
    scythe: T;
    whip: T;
    fist: T;
    claw: T;
    "colossal-weapon": T;
    torch: T;
    "thrusting-shield": T;
    "hand-to-hand-art": T;
    "throwing-blade": T;
    "backhand-blade": T;
    "perfume-bottle": T;
    "beast-claw": T;
    "light-greatsword": T;
    "great-katana": T;
    "light-bow": T;
    bow: T;
    greatbow: T;
    crossbow: T;
    ballista: T;
    "small-shield": T;
    "medium-shield": T;
    greatshield: T;
    "glintstone-staff": T;
    "sacred-seal": T;
}
interface WeaponResult {
    weaponName: string;
    attackRatings: InfusionMap<number>;
    max: number;
    arBreakdown: InfusionMap<{
        baseDmg: DamageTypeMap<number>;
        scalingDmg: DamageTypeMap<number>;
    }>;
}
interface SortBy {
    dmgType: string;
    desc: boolean;
}

export default function Weapons() {
    // STATES
    const [results, setResults] = useState<WeaponResult[]>([]);
    const [stats, setStats] = useState<StatMap>({
        STR: 10,
        DEX: 10,
        INT: 10,
        FTH: 10,
        ARC: 10,
    });
    const [reinforced, setReinforced] = useState(true);
    const [requireStats, setRequireStats] = useState(true);
    const [buffable, setBuffable] = useState(false);
    const [splitDamage, setSplitDamage] = useState(true);
    const [statusEffects, setStatusEffects] = useState<boolean>(false);
    const [twoHanded, setTwoHanded] = useState({
        damage: false,
        requirements: false,
    });
    const [infusions, setInfusions] = useState<InfusionMap<boolean>>({
        standard: true,
        heavy: true,
        keen: true,
        quality: true,
        fire: true,
        "flame-art": true,
        lightning: true,
        sacred: true,
        magic: true,
        cold: true,
        poison: true,
        blood: true,
        occult: true,
    });
    const [damageTypeMode, setDamageTypeMode] =
        useState<string>(DAMAGE_TYPE_MODE_ANY);
    const [damageTypesInclude, setDamageTypesInclude] = useState<boolean>(true);
    const [damageTypes, setDamageTypes] = useState<DamageTypeMap<boolean>>({
        physical: true,
        magic: true,
        fire: true,
        lightning: true,
        holy: true,
        blood: true,
        poison: true,
        frost: true,
        "scarlet-rot": true,
        madness: true,
        sleep: true,
    });
    const [sortBy, setSortBy] = useState<SortBy>({
        dmgType: "max",
        desc: true,
    });
    const [categories, setCategories] = useState<WeaponTypeMap<boolean>>({
        dagger: true,
        "straight-sword": true,
        greatsword: true,
        "colossal-sword": true,
        "thrusting-sword": true,
        "heavy-thrusting-sword": true,
        "curved-sword": true,
        "curved-greatsword": true,
        katana: true,
        twinblade: true,
        hammer: true,
        "great-hammer": true,
        flail: true,
        axe: true,
        greataxe: true,
        spear: true,
        "great-spear": true,
        halberd: true,
        scythe: true,
        whip: true,
        fist: true,
        claw: true,
        "colossal-weapon": true,
        torch: true,
        "thrusting-shield": true,
        "hand-to-hand-art": true,
        "throwing-blade": true,
        "backhand-blade": true,
        "perfume-bottle": true,
        "beast-claw": true,
        "light-greatsword": true,
        "great-katana": true,
        "light-bow": false,
        bow: false,
        greatbow: false,
        crossbow: false,
        ballista: false,
        "small-shield": false,
        "medium-shield": false,
        greatshield: false,
        "glintstone-staff": false,
        "sacred-seal": false,
    });

    // HELPER FUNCTIONS
    const isSplitDamage = (dmg: DamageTypeMap<number>): boolean => {
        let temp: DamageTypeMap<number> = {
            physical: dmg.physical,
            magic: dmg.magic,
            fire: dmg.fire,
            lightning: dmg.lightning,
            holy: dmg.holy,
        };
        return (
            Object.values(temp).reduce(
                (dmgTypes: number, dmg: number | undefined) => {
                    return dmg! > 0 ? dmgTypes + 1 : dmgTypes;
                },
                0
            )! > 1
        );
    };

    const anyDamageTypes = (dmg: DamageTypeMap<number>): boolean => {
        let result: boolean = Object.entries(dmg).some(
            ([key, value]) => damageTypes[key] && value
        );
        return damageTypesInclude ? result : !result;
    };

    const allDamageTypes = (dmg: DamageTypeMap<number>): boolean => {
        let result: boolean = true;
        if (!(Object.values(damageTypes) as boolean[]).includes(true)) {
            result = false;
        } else {
            result = Object.entries(dmg).every(([key, value]) =>
                damageTypes[key] ? value! > 0 : true
            ) as boolean;
        }
        return damageTypesInclude ? result : !result;
    };

    const exactlyDamageTypes = (dmg: DamageTypeMap<number>): boolean => {
        let result: boolean = Object.entries(damageTypes).every(
            ([key, value]) =>
                value ? dmg[key]! > 0 : dmg[key]! == 0 || dmg[key]! == undefined
        ) as boolean;
        return damageTypesInclude ? result : !result;
    };

    // STATE UPDATE FUNCTIONS
    function updateStats(id: string, value: number) {
        setStats({
            ...stats,
            [id]: value < 0 ? 0 : value > 99 ? 99 : value,
        });
    }

    function updateCategories(id: string, state: boolean): void {
        setCategories({
            ...categories,
            [id]: state,
        });
    }

    function updateInfusions(id: string, state: boolean): void {
        setInfusions({
            ...infusions,
            [id]: state,
        });
    }

    function updateDamageTypes(id: string, state: boolean): void {
        setDamageTypes({
            ...damageTypes,
            [id]: state,
        });
    }

    function setAllInfusions(state: boolean): void {
        setInfusions({
            standard: state,
            heavy: state,
            keen: state,
            quality: state,
            fire: state,
            "flame-art": state,
            lightning: state,
            sacred: state,
            magic: state,
            cold: state,
            poison: state,
            blood: state,
            occult: state,
        });
    }

    function setAllDamageTypes(state: boolean): void {
        setDamageTypes({
            physical: state,
            magic: state,
            fire: state,
            lightning: state,
            holy: state,
            blood: state,
            poison: state,
            frost: state,
            "scarlet-rot": state,
            madness: state,
            sleep: state,
        });
    }

    function setAllCategories(state: boolean): void {
        setCategories({
            dagger: state,
            "straight-sword": state,
            greatsword: state,
            "colossal-sword": state,
            "thrusting-sword": state,
            "heavy-thrusting-sword": state,
            "curved-sword": state,
            "curved-greatsword": state,
            katana: state,
            twinblade: state,
            hammer: state,
            "great-hammer": state,
            flail: state,
            axe: state,
            greataxe: state,
            spear: state,
            "great-spear": state,
            halberd: state,
            scythe: state,
            whip: state,
            fist: state,
            claw: state,
            "colossal-weapon": state,
            torch: state,
            "thrusting-shield": state,
            "hand-to-hand-art": state,
            "throwing-blade": state,
            "backhand-blade": state,
            "perfume-bottle": state,
            "beast-claw": state,
            "light-greatsword": state,
            "great-katana": state,
            "light-bow": state,
            bow: state,
            greatbow: state,
            crossbow: state,
            ballista: state,
            "small-shield": state,
            "medium-shield": state,
            greatshield: state,
            "glintstone-staff": state,
            "sacred-seal": state,
        });
    }

    function setAllWeaponCategories(state: boolean): void {
        setCategories({
            ...categories,
            dagger: state,
            "straight-sword": state,
            greatsword: state,
            "colossal-sword": state,
            "thrusting-sword": state,
            "heavy-thrusting-sword": state,
            "curved-sword": state,
            "curved-greatsword": state,
            katana: state,
            twinblade: state,
            hammer: state,
            "great-hammer": state,
            flail: state,
            axe: state,
            greataxe: state,
            spear: state,
            "great-spear": state,
            halberd: state,
            scythe: state,
            whip: state,
            fist: state,
            claw: state,
            "colossal-weapon": state,
            torch: state,
            "thrusting-shield": state,
            "hand-to-hand-art": state,
            "throwing-blade": state,
            "backhand-blade": state,
            "perfume-bottle": state,
            "beast-claw": state,
            "light-greatsword": state,
            "great-katana": state,
        });
    }

    // FUNCTIONS
    function corrections(
        calc: Correction,
        stats: StatMap,
        masks: StatMap
    ): StatMap {
        let result: StatMap = {
            STR: 0,
            DEX: 0,
            INT: 0,
            FTH: 0,
            ARC: 0,
        };
        Object.entries(stats).forEach(
            ([statId, statVal]: [string, number | undefined]) => {
                if (masks[statId]) {
                    let capIndex = calc.softcaps.findIndex(
                        (cap: number) => cap >= statVal!
                    );
                    capIndex == -1
                        ? (capIndex = calc.softcaps.length - 2)
                        : (capIndex = capIndex - 1);
                    let cap = calc.softcaps[capIndex];
                    let capDelta = (calc.softcaps[capIndex + 1] ?? cap) - cap;
                    let growth = calc.growth[capIndex];
                    let growthDelta =
                        (calc.growth[capIndex + 1] ?? growth) - growth;
                    let adjust = calc.adjustments[capIndex];

                    result[statId] =
                        Math.sign(adjust) != -1
                            ? growth +
                              growthDelta *
                                  ((statVal! - cap) / capDelta) ** adjust
                            : growth +
                              growthDelta *
                                  (1 -
                                      (1 - (statVal! - cap) / capDelta) **
                                          Math.abs(adjust));
                }
            }
        );

        return result;
    }

    function damage(
        weapon: Weapon,
        infusion: Infusion,
        upgraded: boolean,
        stats: StatMap
    ): WeaponResult {
        // initialize result
        let result: WeaponResult = {
            attackRatings: {},
            max: 0,
            arBreakdown: {},
            weaponName: "",
        };

        // initialize weapon infusion
        let weaponInfusion: WeaponInfusion =
            weapon.infusions[
                Object.keys(weapon.infusions).find(
                    (infId) => infId == infusion.id
                )!
            ]!;
        weaponInfusion.masks = {
            ...weaponInfusion.masks,
            blood: {
                STR: 0,
                DEX: 0,
                INT: 0,
                FTH: 0,
                ARC: 1,
            },
            poison: {
                STR: 0,
                DEX: 0,
                INT: 0,
                FTH: 0,
                ARC: 1,
            },
            sleep: {
                STR: 0,
                DEX: 0,
                INT: 0,
                FTH: 0,
                ARC: 1,
            },
            madness: {
                STR: 0,
                DEX: 0,
                INT: 0,
                FTH: 0,
                ARC: 1,
            },
            frost: {
                STR: 0,
                DEX: 0,
                INT: 0,
                FTH: 0,
                ARC: 0,
            },
            "scarlet-rot": {
                STR: 0,
                DEX: 0,
                INT: 0,
                FTH: 0,
                ARC: 0,
            },
        };

        // initialize upgrade level
        let upgLevel: number = upgraded ? (weapon.unique ? 10 : 25) : 0;

        // initialize base damage
        let baseDmg: DamageTypeMap<number> = {
            physical: 0,
            magic: 0,
            fire: 0,
            lightning: 0,
            holy: 0,
        };
        // populate base damage
        Object.entries(infusion.damage).forEach(
            ([dmgTypeId, dmg]: [string, number | undefined]) => {
                baseDmg[dmgTypeId] =
                    weaponInfusion.damage[dmgTypeId]! *
                    (dmg! +
                        infusion.upgrade[dmgTypeId]! *
                            upgLevel *
                            (weapon.unique ? 2.5 : 1.0));
            }
        );
        // include aux damage if it is present
        if (weaponInfusion.aux) {
            Object.entries(weaponInfusion.aux).forEach(
                ([dmgTypeId, dmg]: [string, [number, number]]) => {
                    baseDmg[dmgTypeId] = upgraded ? dmg[1] : dmg[0];
                }
            );
        }

        // if weapon is split damage, set base damage to 0
        if (isSplitDamage(baseDmg) && !splitDamage) {
            baseDmg = {
                physical: 0,
                magic: 0,
                fire: 0,
                lightning: 0,
                holy: 0,
            };
        }
        let matchesDamageTypes =
            damageTypeMode == DAMAGE_TYPE_MODE_ANY
                ? anyDamageTypes(baseDmg)
                : damageTypeMode == DAMAGE_TYPE_MODE_All
                ? allDamageTypes(baseDmg)
                : exactlyDamageTypes(baseDmg);

        // if weapon does not match damage types, set base damage to 0
        if (!matchesDamageTypes) {
            baseDmg = {
                physical: 0,
                magic: 0,
                fire: 0,
                lightning: 0,
                holy: 0,
            };
        }

        let scalingDmg: DamageTypeMap<number> = {
            physical: 0,
            magic: 0,
            fire: 0,
            lightning: 0,
            holy: 0,
        };
        Object.keys(stats).some(
            (statId: string, i: number) =>
                stats[statId]! < weapon.requirements[i]!
        )
            ? Object.entries(baseDmg).forEach(
                  ([dmgTypeId, dmg]) => (scalingDmg[dmgTypeId] = dmg! * -0.4)
              )
            : Object.entries(baseDmg).forEach(([dmgTypeId, dmg]) => {
                  let calcCorrect: StatMap = corrections(
                      CORRECTIONS.find(
                          (c) => c.id == weaponInfusion.corrections[dmgTypeId]
                      )!,
                      stats,
                      weaponInfusion.masks[dmgTypeId]!
                  );
                  let statScaling: StatMap = {
                      STR: 0,
                      DEX: 0,
                      INT: 0,
                      FTH: 0,
                      ARC: 0,
                  };
                  Object.entries(weaponInfusion.scaling).forEach(
                      ([statId, scaling]: [string, number | undefined]) =>
                          (statScaling[statId] =
                              infusion.scaling[statId]! *
                              (scaling! +
                                  scaling! *
                                      infusion.growth[statId]! *
                                      upgLevel *
                                      (weapon.unique ? 4.0 : 1.0)))
                  );
                  scalingDmg[dmgTypeId] = Object.entries(statScaling)
                      .map(
                          ([statId, scaling]: [string, number | undefined]) => {
                              return (
                                  (dmg! * scaling! * calcCorrect[statId]!) /
                                  100.0
                              );
                          }
                      )
                      .reduce((sum: number, n: number) => sum + n);
              });

        result = {
            weaponName: "",
            arBreakdown: {
                [infusion.id]: {
                    baseDmg: baseDmg,
                    scalingDmg: scalingDmg,
                },
            },
            max: 0,
            attackRatings: {
                [infusion.id]: Math.floor(
                    (Object.entries(baseDmg) as [string, number][]).reduce(
                        (sum: [string, number], n: [string, number]) =>
                            statusEffects ||
                            (n[0] != "blood" &&
                                n[0] != "poison" &&
                                n[0] != "frost" &&
                                n[0] != "scarlet-rot" &&
                                n[0] != "madness" &&
                                n[0] != "sleep")
                                ? ["", sum[1] + n[1]]
                                : sum
                    )[1] +
                        (
                            Object.entries(scalingDmg) as [string, number][]
                        ).reduce((sum: [string, number], n: [string, number]) =>
                            statusEffects ||
                            (n[0] != "blood" &&
                                n[0] != "poison" &&
                                n[0] != "frost" &&
                                n[0] != "scarlet-rot" &&
                                n[0] != "madness" &&
                                n[0] != "sleep")
                                ? ["", sum[1] + n[1]]
                                : sum
                        )[1]
                ),
            },
        };

        return result;
    }

    function resetAll(): void {
        setStats({
            STR: 10,
            DEX: 10,
            INT: 10,
            FTH: 10,
            ARC: 10,
        });
        setReinforced(true);
        setRequireStats(true);
        setBuffable(false);
        setSplitDamage(true);
        setTwoHanded({
            requirements: false,
            damage: false,
        });
        setAllInfusions(true);
        setDamageTypeMode(DAMAGE_TYPE_MODE_ANY);
        setAllDamageTypes(true);
        setDamageTypesInclude(true);
    }

    function createCategoryCheckbox(
        categoryId: string,
        i: number
    ): JSX.Element {
        return (
            <div key={categoryId}>
                <span>
                    <input
                        type="checkbox"
                        id={categoryId}
                        name="category"
                        className={
                            i < CATEGORY_NAMES[0].length
                                ? "weapon"
                                : i <
                                  CATEGORY_NAMES[0].length +
                                      CATEGORY_NAMES[1].length
                                ? "ranged"
                                : i <
                                  CATEGORY_NAMES[0].length +
                                      CATEGORY_NAMES[1].length +
                                      CATEGORY_NAMES[2].length
                                ? "shield"
                                : "catalyst"
                        }
                        onChange={(event) =>
                            updateCategories(categoryId, event.target.checked)
                        }
                        checked={categories[categoryId]}
                    />
                    <label htmlFor={categoryId}>
                        {i < CATEGORY_NAMES[0].length
                            ? CATEGORY_NAMES[0][i]
                            : i <
                              CATEGORY_NAMES[0].length +
                                  CATEGORY_NAMES[1].length
                            ? CATEGORY_NAMES[1][i - CATEGORY_NAMES[0].length]
                            : i <
                              CATEGORY_NAMES[0].length +
                                  CATEGORY_NAMES[1].length +
                                  CATEGORY_NAMES[2].length
                            ? CATEGORY_NAMES[2][
                                  i -
                                      CATEGORY_NAMES[0].length -
                                      CATEGORY_NAMES[1].length
                              ]
                            : CATEGORY_NAMES[3][
                                  i -
                                      CATEGORY_NAMES[0].length -
                                      CATEGORY_NAMES[1].length -
                                      CATEGORY_NAMES[2].length
                              ]}
                    </label>
                </span>
            </div>
        );
    }

    // EFFECTS
    useEffect(() => {
        let filtered = WEAPONS.filter((weapon) => {
            // filter out weapons that don't fit the current parameters
            return (
                // check all stats except for STR
                ((Object.keys(weapon.requirements).every((statName: string) =>
                    statName == "STR"
                        ? true
                        : stats[statName]! >= weapon.requirements[statName]!
                ) &&
                    // and if the weapon is using two handed damage
                    (twoHanded.damage
                        ? // and if the weapon is using two handed requirements
                          twoHanded.requirements
                            ? // then use the two handing formula for STR
                              stats["STR"] * 1.5 >= weapon.requirements["STR"]
                            : // else use the one handable formula for STR
                              Math.ceil(stats["STR"] / 1.5) >=
                              weapon.requirements["STR"]
                        : // else use the one handed formula for STR
                          stats["STR"] >= weapon.requirements["STR"])) ||
                    // or ignore stats if not required
                    !requireStats) &&
                // and if the weapon's category is allowed
                categories[weapon.category] &&
                // and if the weapon's infusion is allowed
                Object.keys(weapon.infusions).some(
                    (infId) => infusions[infId]
                ) &&
                // and if the weapon is buffable or buffable is not required
                (!buffable ||
                    Object.keys(weapon.infusions).some(
                        (infId) => weapon.infusions[infId]!.buffable
                    )) &&
                // and if the weapon is split damage (prefer for check to be done with Heavy infusion to catch cases where the Standard infusion is split but the physical infusions are not)
                (isSplitDamage(
                    weapon.infusions.heavy?.damage ??
                        weapon.infusions.standard!.damage
                )
                    ? // then defer to whether split damage is allowed
                      splitDamage
                    : true) &&
                // and if the weapon has only Standard infusion and contains selected damage type
                (weapon.infusions.heavy ??
                    (damageTypeMode == DAMAGE_TYPE_MODE_ANY
                        ? anyDamageTypes(weapon.infusions.standard!.damage)
                        : damageTypeMode == DAMAGE_TYPE_MODE_All
                        ? allDamageTypes(weapon.infusions.standard!.damage)
                        : exactlyDamageTypes(
                              weapon.infusions.standard!.damage
                          )))
            );
        }).map((weapon) => {
            // calculate attack ratings for every allowed infusion as well as the maximum damage of any infusion
            let result: WeaponResult = {
                weaponName: weapon.name,
                attackRatings: {},
                max: 0,
                arBreakdown: {},
            };
            Object.values(INFUSIONS)
                .filter((inf) => infusions[inf.id])
                .forEach((inf) => {
                    let temp: WeaponResult = {
                        weaponName: weapon.name,
                        attackRatings: {
                            [inf.id]: 0,
                        },
                        max: 0,
                        arBreakdown: {
                            [inf.id]: {
                                baseDmg: {
                                    physical: 0,
                                    magic: 0,
                                    fire: 0,
                                    lightning: 0,
                                    holy: 0,
                                },
                                scalingDmg: {
                                    physical: 0,
                                    magic: 0,
                                    fire: 0,
                                    lightning: 0,
                                    holy: 0,
                                },
                            },
                        },
                    };

                    if (
                        (Object.keys(weapon.infusions).find(
                            (infId) => infId == inf.id
                        ) != null &&
                            !buffable) ||
                        weapon.infusions[
                            Object.keys(weapon.infusions).find(
                                (infId) => infId == inf.id
                            )!
                        ]?.buffable
                    ) {
                        temp = damage(
                            weapon,
                            INFUSIONS.find((i) => i.id == inf.id)!,
                            reinforced,
                            twoHanded.damage
                                ? {
                                      ...stats,
                                      STR: stats["STR"] * 1.5,
                                  }
                                : stats
                        );
                    }
                    result = {
                        ...result,
                        arBreakdown: {
                            ...result.arBreakdown,
                            ...temp.arBreakdown,
                        },
                        attackRatings: {
                            ...result.attackRatings,
                            [inf.id]:
                                Object.keys(weapon.infusions).find(
                                    (infId) => infId == inf.id
                                ) != null
                                    ? !buffable ||
                                      weapon.infusions[
                                          Object.keys(weapon.infusions).find(
                                              (infId) => infId == inf.id
                                          )!
                                      ]?.buffable
                                        ? temp.attackRatings[inf.id]
                                        : 0
                                    : 0,
                        },
                    };
                });

            result.max = Math.max(
                0,
                ...(Object.values(result.attackRatings) as number[])
            );

            return result;
        });
        filtered.forEach((weapon) => {
            if (weapon.max == 0) {
                filtered = filtered.filter((w) => w != weapon);
            }
        });
        setResults(filtered);
    }, [
        stats,
        reinforced,
        requireStats,
        buffable,
        twoHanded,
        infusions,
        categories,
        sortBy,
        splitDamage,
        damageTypesInclude,
        damageTypeMode,
        damageTypes,
        statusEffects,
    ]);

    // RENDER
    return (
        <div>
            <header>
                <h1>Weapon Finder</h1>
            </header>
            <main>
                <div className="app">
                    {/* <!-- parameters --> */}
                    <article style={{ flexBasis: "15%" }}>
                        <div>
                            <b>Parameters</b>
                            <button
                                onClick={resetAll}
                                style={{ marginBottom: "0px" }}
                            >
                                Reset All
                            </button>
                        </div>
                        <hr />
                        {Object.keys(stats).map(
                            (statId: string, ty: number) => (
                                <div key={statId}>
                                    <label htmlFor="str">{statId}</label>
                                    <input
                                        id={statId.toLowerCase()}
                                        type="number"
                                        name="stat"
                                        value={stats[statId]}
                                        min={0}
                                        max={99}
                                        onChange={(event) => {
                                            updateStats(
                                                statId,
                                                +event.target.value
                                            );
                                        }}
                                    />
                                </div>
                            )
                        )}
                        <hr />
                        <div>
                            <span>
                                <input
                                    type="radio"
                                    id="max-upgrade"
                                    name="upgrade-level"
                                    onChange={() => {
                                        setReinforced(true);
                                    }}
                                    checked={reinforced}
                                />
                                <label htmlFor="max-upgrade">
                                    Reinforced (+10 or +25)
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="radio"
                                    id="min-upgrade"
                                    name="upgrade-level"
                                    onChange={() => {
                                        setReinforced(false);
                                    }}
                                    checked={!reinforced}
                                />
                                <label htmlFor="min-upgrade">
                                    Not Reinforced (+0)
                                </label>
                            </span>
                        </div>
                        <hr />
                        <div>
                            <span>
                                <input
                                    id="requirements"
                                    type="checkbox"
                                    onChange={(event) => {
                                        setRequireStats(event.target.checked);
                                    }}
                                    checked={requireStats}
                                />
                                <label htmlFor="requirements">
                                    Requirements Met
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="buffable"
                                    onChange={(event) => {
                                        setBuffable(event.target.checked);
                                    }}
                                    checked={buffable}
                                />
                                <label htmlFor="buffable">Buffable Only</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="split-damage"
                                    onChange={(event) => {
                                        setSplitDamage(event.target.checked);
                                    }}
                                    checked={splitDamage}
                                />
                                <label htmlFor="split-damage">
                                    Split Damage
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="checkbox"
                                    id="status-effects"
                                    onChange={(event) => {
                                        setStatusEffects(event.target.checked);
                                    }}
                                    checked={statusEffects}
                                />
                                <label htmlFor="status-effects">
                                    Consider Status Effects
                                </label>
                            </span>
                        </div>
                        <hr />
                        <b>Handedness</b>
                        <div>
                            <span>
                                <input
                                    type="radio"
                                    id="2h-never"
                                    name="handedness"
                                    onChange={(event) => {
                                        setTwoHanded({
                                            damage: !event.target.checked,
                                            requirements: !event.target.checked,
                                        });
                                    }}
                                    checked={
                                        !twoHanded.damage &&
                                        !twoHanded.requirements
                                    }
                                />
                                <label htmlFor="2h-never">One-handing</label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="radio"
                                    id="2h-sometimes"
                                    name="handedness"
                                    onChange={(event) => {
                                        setTwoHanded({
                                            damage: event.target.checked,
                                            requirements: !event.target.checked,
                                        });
                                    }}
                                    checked={
                                        twoHanded.damage &&
                                        !twoHanded.requirements
                                    }
                                />
                                <label htmlFor="2h-sometimes">
                                    Usable 1H or 2H
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    id="2h-always"
                                    type="radio"
                                    name="handedness"
                                    onChange={(event) => {
                                        setTwoHanded({
                                            damage: event.target.checked,
                                            requirements: event.target.checked,
                                        });
                                    }}
                                    checked={
                                        twoHanded.damage &&
                                        twoHanded.requirements
                                    }
                                />
                                <label htmlFor="2h-always">Two-handing</label>
                            </span>
                        </div>
                        <hr />
                        <div>
                            <b>Infusions</b>
                            <span>
                                <button onClick={() => setAllInfusions(true)}>
                                    Any
                                </button>
                                <button onClick={() => setAllInfusions(false)}>
                                    None
                                </button>
                            </span>
                        </div>
                        {Object.keys(infusions).map((key: string, i) => (
                            <div key={key}>
                                <span>
                                    <input
                                        id={key + "-infusion"}
                                        value={key}
                                        type="checkbox"
                                        name="infusion"
                                        onChange={(event) => {
                                            updateInfusions(
                                                key,
                                                event.target.checked
                                            );
                                        }}
                                        checked={infusions[key]}
                                    />
                                    <label htmlFor={key}>
                                        {INFUSION_NAMES[i]}
                                    </label>
                                </span>
                            </div>
                        ))}
                        <hr />
                        <div>
                            <b>Damage Types</b>
                            <span>
                                <button
                                    onClick={() => {
                                        setAllDamageTypes(true);
                                    }}
                                >
                                    Any
                                </button>
                                <button
                                    onClick={() => setAllDamageTypes(false)}
                                >
                                    None
                                </button>
                            </span>
                        </div>
                        <div>
                            <span style={{ width: "100%" }}>
                                <button
                                    style={{ width: "100%" }}
                                    onClick={() =>
                                        setDamageTypesInclude(
                                            !damageTypesInclude
                                        )
                                    }
                                >
                                    {damageTypesInclude
                                        ? "ONLY INCLUDE results that contain..."
                                        : "EXCLUDE results that contain..."}
                                </button>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="radio"
                                    id="damage-type-any"
                                    name="damage-type-mode"
                                    onChange={() => {
                                        setDamageTypeMode(DAMAGE_TYPE_MODE_ANY);
                                    }}
                                    checked={
                                        damageTypeMode === DAMAGE_TYPE_MODE_ANY
                                    }
                                />
                                <label htmlFor="damage-type-any">
                                    ANY of the following
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="radio"
                                    id="damage-type-all"
                                    name="damage-type-mode"
                                    onChange={() => {
                                        setDamageTypeMode(DAMAGE_TYPE_MODE_All);
                                    }}
                                    checked={
                                        damageTypeMode === DAMAGE_TYPE_MODE_All
                                    }
                                />
                                <label htmlFor="damage-type-all">
                                    ALL of the following
                                </label>
                            </span>
                        </div>
                        <div>
                            <span>
                                <input
                                    type="radio"
                                    id="damage-type-exactly"
                                    name="damage-type-mode"
                                    onChange={() => {
                                        setDamageTypeMode(
                                            DAMAGE_TYPE_MODE_EXACTLY
                                        );
                                    }}
                                    checked={
                                        damageTypeMode ===
                                        DAMAGE_TYPE_MODE_EXACTLY
                                    }
                                />
                                <label htmlFor="damage-type-exactly">
                                    EXACTLY the following
                                </label>
                            </span>
                        </div>
                        {Object.keys(damageTypes).map((key: string, i) => (
                            <div key={key}>
                                <span>
                                    <input
                                        id={key + "-damage-type"}
                                        value={key}
                                        type="checkbox"
                                        name="damage-type"
                                        onChange={(event) => {
                                            updateDamageTypes(
                                                key,
                                                event.target.checked
                                            );
                                        }}
                                        checked={damageTypes[key]}
                                    />
                                    <label htmlFor={key}>
                                        {DAMAGE_TYPE_NAMES[i]}
                                    </label>
                                </span>
                            </div>
                        ))}
                    </article>
                    {/* <!-- results --> */}
                    <article style={{ flexBasis: "55%" }}>
                        <b>Damage</b>
                        <div style={{ overflow: "auto" }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ minWidth: "2rem" }}>
                                            <b style={{ userSelect: "none" }}>
                                                Weapon
                                            </b>
                                        </th>
                                        <th>
                                            <b
                                                onClick={() => {
                                                    sortBy.dmgType == "max"
                                                        ? setSortBy({
                                                              ...sortBy,
                                                              desc: !sortBy.desc,
                                                          })
                                                        : setSortBy({
                                                              dmgType: "max",
                                                              desc: true,
                                                          });
                                                }}
                                                onMouseOver={(event) =>
                                                    (event.currentTarget.style.cursor =
                                                        "pointer")
                                                }
                                                style={{ userSelect: "none" }}
                                            >
                                                {" "}
                                                Max{" "}
                                            </b>
                                        </th>
                                        <th id="standard">
                                            <Image
                                                src="/icons/standard.jpg"
                                                style={{ maxWidth: "20px" }}
                                                width={20}
                                                height={20}
                                                title="Standard"
                                                alt="Standard"
                                                onClick={() => {
                                                    sortBy.dmgType == "standard"
                                                        ? setSortBy({
                                                              ...sortBy,
                                                              desc: !sortBy.desc,
                                                          })
                                                        : setSortBy({
                                                              dmgType:
                                                                  "standard",
                                                              desc: true,
                                                          });
                                                }}
                                            />
                                        </th>
                                        <th id="heavy">
                                            <Image
                                                src="/icons/heavy.jpg"
                                                style={{ maxWidth: "20px" }}
                                                width={20}
                                                height={20}
                                                title="Heavy"
                                                alt="Heavy"
                                                onClick={() => {
                                                    sortBy.dmgType == "heavy"
                                                        ? setSortBy({
                                                              ...sortBy,
                                                              desc: !sortBy.desc,
                                                          })
                                                        : setSortBy({
                                                              dmgType: "heavy",
                                                              desc: true,
                                                          });
                                                }}
                                            />
                                        </th>
                                        <th id="keen">
                                            <Image
                                                src="/icons/keen.jpg"
                                                style={{ maxWidth: "20px" }}
                                                width={20}
                                                height={20}
                                                title="Keen"
                                                alt="Keen"
                                                onClick={() => {
                                                    sortBy.dmgType == "keen"
                                                        ? setSortBy({
                                                              ...sortBy,
                                                              desc: !sortBy.desc,
                                                          })
                                                        : setSortBy({
                                                              dmgType: "keen",
                                                              desc: true,
                                                          });
                                                }}
                                            />
                                        </th>
                                        <th id="quality">
                                            <Image
                                                src="/icons/quality.jpg"
                                                style={{ maxWidth: "20px" }}
                                                width={20}
                                                height={20}
                                                title="Quality"
                                                alt="Quality"
                                                onClick={() => {
                                                    sortBy.dmgType == "quality"
                                                        ? setSortBy({
                                                              ...sortBy,
                                                              desc: !sortBy.desc,
                                                          })
                                                        : setSortBy({
                                                              dmgType:
                                                                  "quality",
                                                              desc: true,
                                                          });
                                                }}
                                            />
                                        </th>
                                        <th id="fire">
                                            <Image
                                                src="/icons/fire.jpg"
                                                style={{ maxWidth: "20px" }}
                                                width={20}
                                                height={20}
                                                title="Fire"
                                                alt="Fire"
                                                onClick={() => {
                                                    sortBy.dmgType == "fire"
                                                        ? setSortBy({
                                                              ...sortBy,
                                                              desc: !sortBy.desc,
                                                          })
                                                        : setSortBy({
                                                              dmgType: "fire",
                                                              desc: true,
                                                          });
                                                }}
                                            />
                                        </th>
                                        <th id="flame-art">
                                            <Image
                                                src="/icons/flame-art.jpg"
                                                style={{ maxWidth: "20px" }}
                                                width={20}
                                                height={20}
                                                title="Flame Art"
                                                alt="Flame Art"
                                                onClick={() => {
                                                    sortBy.dmgType ==
                                                    "flame-art"
                                                        ? setSortBy({
                                                              ...sortBy,
                                                              desc: !sortBy.desc,
                                                          })
                                                        : setSortBy({
                                                              dmgType:
                                                                  "flame-art",
                                                              desc: true,
                                                          });
                                                }}
                                            />
                                        </th>
                                        <th id="lightning">
                                            <Image
                                                src="/icons/lightning.jpg"
                                                style={{ maxWidth: "20px" }}
                                                width={20}
                                                height={20}
                                                title="Lightning"
                                                alt="Lightning"
                                                onClick={() => {
                                                    sortBy.dmgType ==
                                                    "lightning"
                                                        ? setSortBy({
                                                              ...sortBy,
                                                              desc: !sortBy.desc,
                                                          })
                                                        : setSortBy({
                                                              dmgType:
                                                                  "lightning",
                                                              desc: true,
                                                          });
                                                }}
                                            />
                                        </th>
                                        <th id="sacred">
                                            <Image
                                                src="/icons/sacred.jpg"
                                                style={{ maxWidth: "20px" }}
                                                width={20}
                                                height={20}
                                                title="Sacred"
                                                alt="Sacred"
                                                onClick={() => {
                                                    sortBy.dmgType == "sacred"
                                                        ? setSortBy({
                                                              ...sortBy,
                                                              desc: !sortBy.desc,
                                                          })
                                                        : setSortBy({
                                                              dmgType: "sacred",
                                                              desc: true,
                                                          });
                                                }}
                                            />
                                        </th>
                                        <th id="magic">
                                            <Image
                                                src="/icons/magic.jpg"
                                                style={{ maxWidth: "20px" }}
                                                width={20}
                                                height={20}
                                                title="Magic"
                                                alt="Magic"
                                                onClick={() => {
                                                    sortBy.dmgType == "magic"
                                                        ? setSortBy({
                                                              ...sortBy,
                                                              desc: !sortBy.desc,
                                                          })
                                                        : setSortBy({
                                                              dmgType: "magic",
                                                              desc: true,
                                                          });
                                                }}
                                            />
                                        </th>
                                        <th id="cold">
                                            <Image
                                                src="/icons/cold.jpg"
                                                style={{ maxWidth: "20px" }}
                                                width={20}
                                                height={20}
                                                title="Cold"
                                                alt="Cold"
                                                onClick={() => {
                                                    sortBy.dmgType == "cold"
                                                        ? setSortBy({
                                                              ...sortBy,
                                                              desc: !sortBy.desc,
                                                          })
                                                        : setSortBy({
                                                              dmgType: "cold",
                                                              desc: true,
                                                          });
                                                }}
                                            />
                                        </th>
                                        <th id="poison">
                                            <Image
                                                src="/icons/poison.jpg"
                                                style={{ maxWidth: "20px" }}
                                                width={20}
                                                height={20}
                                                title="Poison"
                                                alt="Poison"
                                                onClick={() => {
                                                    sortBy.dmgType == "poison"
                                                        ? setSortBy({
                                                              ...sortBy,
                                                              desc: !sortBy.desc,
                                                          })
                                                        : setSortBy({
                                                              dmgType: "poison",
                                                              desc: true,
                                                          });
                                                }}
                                            />
                                        </th>
                                        <th id="blood">
                                            <Image
                                                src="/icons/blood.jpg"
                                                style={{ maxWidth: "20px" }}
                                                width={20}
                                                height={20}
                                                title="Blood"
                                                alt="Blood"
                                                onClick={() => {
                                                    sortBy.dmgType == "blood"
                                                        ? setSortBy({
                                                              ...sortBy,
                                                              desc: !sortBy.desc,
                                                          })
                                                        : setSortBy({
                                                              dmgType: "blood",
                                                              desc: true,
                                                          });
                                                }}
                                            />
                                        </th>
                                        <th id="occult">
                                            <Image
                                                src="/icons/occult.jpg"
                                                style={{ maxWidth: "20px" }}
                                                width={20}
                                                height={20}
                                                title="Occult"
                                                alt="Occult"
                                                onClick={() => {
                                                    sortBy.dmgType == "occult"
                                                        ? setSortBy({
                                                              ...sortBy,
                                                              desc: !sortBy.desc,
                                                          })
                                                        : setSortBy({
                                                              dmgType: "occult",
                                                              desc: true,
                                                          });
                                                }}
                                            />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody id="weapons">
                                    {results
                                        .sort((a, b) => {
                                            // sort based on current sort order
                                            if (sortBy.dmgType == "max") {
                                                // sort by max
                                                return sortBy.desc
                                                    ? b.max - a.max
                                                    : a.max - b.max;
                                            } else {
                                                return sortBy.desc
                                                    ? b.attackRatings[
                                                          sortBy.dmgType
                                                      ]! -
                                                          a.attackRatings[
                                                              sortBy.dmgType
                                                          ]!
                                                    : a.attackRatings[
                                                          sortBy.dmgType
                                                      ]! -
                                                          b.attackRatings[
                                                              sortBy.dmgType
                                                          ]!;
                                            }
                                        })
                                        .map((weaponResult) => (
                                            <WeaponResultRow
                                                key={weaponResult.weaponName.replaceAll(
                                                    " ",
                                                    "-"
                                                )}
                                                weaponName={
                                                    weaponResult.weaponName
                                                }
                                                attackRatings={
                                                    weaponResult.attackRatings
                                                }
                                                max={weaponResult.max}
                                                arBreakdown={
                                                    weaponResult.arBreakdown
                                                }
                                            />
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </article>
                    {/* <!-- categories --> */}
                    <article style={{ flexBasis: "15%" }}>
                        <div>
                            <b>Categories</b>
                            <span>
                                <button onClick={() => setAllCategories(true)}>
                                    Any
                                </button>
                                <button onClick={() => setAllCategories(false)}>
                                    None
                                </button>
                            </span>
                        </div>
                        <hr />
                        <div>
                            <b>Weapons</b>
                            <span>
                                <button
                                    onClick={() => setAllWeaponCategories(true)}
                                >
                                    Any
                                </button>
                                <button
                                    onClick={() =>
                                        setAllWeaponCategories(false)
                                    }
                                >
                                    None
                                </button>
                            </span>
                        </div>
                        {Object.keys(categories).map(
                            (categoryId: string, i: number) =>
                                i == CATEGORY_NAMES[0].length
                                    ? [
                                          <hr key={"hr_" + categoryId} />,
                                          <div key={"div_" + categoryId}>
                                              <b>Ranged</b>
                                          </div>,
                                          createCategoryCheckbox(categoryId, i),
                                      ].map((c: JSX.Element) => c)
                                    : i ==
                                      CATEGORY_NAMES[0].length +
                                          CATEGORY_NAMES[1].length
                                    ? [
                                          <hr key={"hr_" + categoryId} />,
                                          <div key={"div_" + categoryId}>
                                              <b>Shields</b>
                                          </div>,
                                          createCategoryCheckbox(categoryId, i),
                                      ].map((c: JSX.Element) => c)
                                    : i ==
                                      CATEGORY_NAMES[0].length +
                                          CATEGORY_NAMES[1].length +
                                          CATEGORY_NAMES[2].length
                                    ? [
                                          <hr key={"hr_" + categoryId} />,
                                          <div key={"div_" + categoryId}>
                                              <b>Catalysts</b>
                                          </div>,
                                          createCategoryCheckbox(categoryId, i),
                                      ].map((c: JSX.Element) => c)
                                    : createCategoryCheckbox(categoryId, i)
                        )}
                    </article>
                </div>
                <div>
                    <h2 style={{ textAlign: "center" }}>Notes</h2>
                    <p>
                        Click the headers in the table to sort the table based
                        that column.
                    </p>
                    <p>You can choose between three modes of handedness:</p>
                    <ol>
                        <li>
                            One-handed: Calculates damage and requirements based
                            on one-handed use
                        </li>
                        <li>
                            Usable one-handed: Calculates damage based on
                            two-handed use, but accounts for weapon being usable
                            one-handed as well
                        </li>
                        <li>Two-handed: Self-explanatory</li>
                    </ol>
                    <br />
                    <p>You can choose between six modes of damage types:</p>
                    <ul>
                        <li>
                            INCLUDE:
                            <ul>
                                <li>
                                    ANY: Will display an attack rating as long
                                    as it includes any one of the selected
                                    damage types.
                                </li>
                                <li>
                                    ALL: Will display an attack rating as long
                                    as it includes all of the selected damage
                                    types.
                                </li>
                                <li>
                                    EXACTLY: Will display an attack rating only
                                    if it consists of exactly the combination of
                                    damage types selected.
                                </li>
                            </ul>
                        </li>
                        <li>
                            EXCLUDE:
                            <ul>
                                <li>
                                    ANY: Will not display an attack rating as
                                    long as it includes any one of the selected
                                    damage types.
                                </li>
                                <li>
                                    ALL: Will not display an attack rating as
                                    long as it includes all of the selected
                                    damage types.
                                </li>
                                <li>
                                    EXACTLY: Will not display an attack rating
                                    only if it consists of exactly the
                                    combination of damage types selected.
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <p>
                        This calculator currently doesn&apos;t take auxiliary
                        damage procs (cold, bleed, scarlet rot and poison) into
                        account. Therefore, it won&apos;t be very useful for
                        finding weapons to use in a bleed build.
                    </p>
                    <p>
                        Catalysts (sacred seals and glintstone staffs) will show
                        their <em>attack rating</em>, not their{" "}
                        <em>spell scaling</em>.
                    </p>
                    <p>
                        The same holds true for shields, which are also sorted
                        based on <em>attack rating</em>
                    </p>
                </div>
            </main>
        </div>
    );
}
