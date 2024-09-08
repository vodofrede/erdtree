import { Armor } from "./armor";

export type Set = Armor[] & {
    fitness?: number;
    weight?: number;
};
