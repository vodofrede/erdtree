import StatMap from "../interfaces/statMap";
import { Equippable } from "./equippable";

interface Multipliers {
    [key: string]: number;
}

export type Talisman = Equippable & {
    weight: string;
    stats: StatMap;
    multipliers: Multipliers;
};
