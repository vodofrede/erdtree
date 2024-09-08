import { Stat } from "../interfaces/stat";
import { Equippable } from "./equippable";

interface WeaponInfusion {
    [key: string]: {
        id: string;
        damage: number[];
        scaling: number[];
        aux: { id: string; effect: [number, number] };
        masks: number[][];
        corrections: string[];
        buffable: boolean;
    };
}

export type Weapon = Equippable & {
    requirements: Stat;
    category: string;
    unique: boolean;
    infusions: WeaponInfusion;
};
