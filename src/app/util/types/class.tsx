import StatMap from "../interfaces/statMap";

export type Class = {
    id: string;
    name: string;
    level: number;
    stats: StatMap;
    total?: number;
};
