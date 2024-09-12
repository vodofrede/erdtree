import DamageTypeMap from "./damageTypeMap";
import StatMap from "./statMap";

export default interface WeaponInfusion {
    id: string;
    damage: DamageTypeMap<number>;
    scaling: StatMap;
    aux: { id: string; effect: [number, number] };
    masks: DamageTypeMap<StatMap>;
    corrections: DamageTypeMap<string>;
    buffable: boolean;
}
