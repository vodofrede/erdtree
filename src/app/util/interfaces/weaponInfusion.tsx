import DamageTypeMap from "./damageTypeMap";
import StatMap from "./statMap";

export default interface WeaponInfusion {
    id: string;
    damage: DamageTypeMap<number>;
    scaling: StatMap;
    aux: { [key: string]: [number, number] };
    masks: DamageTypeMap<StatMap>;
    corrections: DamageTypeMap<string>;
    buffable: boolean;
}
