import { Defenses } from "./defenses";
import { Resistances } from "./resistances";

export type Armor = {
    id: string;
    name: string;
    defenses: Defenses;
    resistances: Resistances;
    poise: number;
    weight: number;
    fitness?: number;
};
