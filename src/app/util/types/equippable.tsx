import StatMap from "../interfaces/statMap";

export type Equippable = {
    id: string;
    name: string;
    stats?: StatMap;
    total?: number;
};
