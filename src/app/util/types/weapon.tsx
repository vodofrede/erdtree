import { Stat } from "../interfaces/stat";

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

export type Weapon = {
    id: string;
    name: string;
    requirements: Stat;
    category: string;
    unique: boolean;
    infusions: WeaponInfusion;
};
