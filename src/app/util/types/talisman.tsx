import { Stat } from "../interfaces/stat";
import { Equippable } from "./equippable";

interface Multipliers {
    [key: string]: number;
}

export type Talisman = Equippable & {
    weight: string;
    stats: Stat;
    multipliers: Multipliers;
};
