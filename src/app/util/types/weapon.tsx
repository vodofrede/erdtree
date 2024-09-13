import { InfusionMap } from "../interfaces/infusionMap";
import StatMap from "../interfaces/statMap";
import WeaponInfusion from "../interfaces/weaponInfusion";
import { Equippable } from "./equippable";

interface Aux {
    [key: string]: { effect: [number, number] };
}

export type Weapon = Equippable & {
    requirements: StatMap;
    category: string;
    unique: boolean;
    infusions: InfusionMap<WeaponInfusion>;
    aux?: Aux;
};
