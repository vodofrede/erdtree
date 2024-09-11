import StatMap from "../interfaces/statMap";
import WeaponInfusion from "../interfaces/weaponInfusion";
import { Equippable } from "./equippable";

interface Infusions {
    [key: string]: WeaponInfusion;
    standard: WeaponInfusion;
    heavy: WeaponInfusion;
    keen: WeaponInfusion;
    quality: WeaponInfusion;
    fire: WeaponInfusion;
    "flame-art": WeaponInfusion;
    lightning: WeaponInfusion;
    sacred: WeaponInfusion;
    magic: WeaponInfusion;
    cold: WeaponInfusion;
    poison: WeaponInfusion;
    blood: WeaponInfusion;
    occult: WeaponInfusion;
}

export type Weapon = Equippable & {
    requirements: StatMap;
    category: string;
    unique: boolean;
    infusions: Infusions;
};
