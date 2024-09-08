import { Defenses } from "./defenses";
import { Equippable } from "./equippable";
import { Resistances } from "./resistances";

export type Armor = Equippable & {
    defenses: Defenses;
    resistances: Resistances;
    poise: number;
    weight: number;
    fitness?: number;
};
