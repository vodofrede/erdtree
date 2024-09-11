import { InfusionMap } from "../interfaces/infusionMap";
import StatMap from "../interfaces/statMap";
import WeaponInfusion from "../interfaces/weaponInfusion";
import { Equippable } from "./equippable";

export type Weapon = Equippable & {
    requirements: StatMap;
    category: string;
    unique: boolean;
    infusions: InfusionMap<WeaponInfusion>;
};
