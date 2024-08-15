import { Stat } from "../interfaces/stat";

export type Class = {
    id: string;
    name: string;
    level: number;
    stats: Stat;
    total?: number;
};
