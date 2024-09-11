import DamageTypeMap from "../interfaces/damageTypeMap";

export type Correction = {
    id: string;
    softcaps: DamageTypeMap<number[]>;
    growth: DamageTypeMap<number[]>;
    adjustments: DamageTypeMap<number[]>;
};
