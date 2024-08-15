import { Stat } from "../interfaces/stat";

export type Equippable = {
    id: string;
    name: string;
    stats?: Stat;
    total?: number;
};
