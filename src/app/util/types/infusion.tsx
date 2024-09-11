import DamageTypeMap from "../interfaces/damageTypeMap";
import StatMap from "../interfaces/statMap";

export type Infusion = {
    id: string;
    name: string;
    damage: DamageTypeMap<number>;
    upgrade: DamageTypeMap<number>;
    scaling: StatMap;
    growth: StatMap;
};
