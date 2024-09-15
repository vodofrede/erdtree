import DamageTypeMap from "../util/interfaces/damageTypeMap";
import { InfusionMap } from "../util/interfaces/infusionMap";
import { TableDataWithHover } from "./TableDataWithHover";

const INFUSION_IDS: string[] = [
    "standard",
    "heavy",
    "keen",
    "quality",
    "fire",
    "flame-art",
    "lightning",
    "sacred",
    "magic",
    "cold",
    "poison",
    "blood",
    "occult",
];

const DEFAULT_INFUSION_MAP: InfusionMap<number> = {
    standard: 0,
    heavy: 0,
    keen: 0,
    quality: 0,
    fire: 0,
    "flame-art": 0,
    lightning: 0,
    sacred: 0,
    magic: 0,
    cold: 0,
    poison: 0,
    blood: 0,
    occult: 0,
};

export function WeaponResultRow(props: {
    weaponName: string;
    attackRatings: InfusionMap<number>;
    max: number;
    arBreakdown: InfusionMap<{
        baseDmg: DamageTypeMap<number>;
        scalingDmg: DamageTypeMap<number>;
    }>;
}) {
    return (
        <tr>
            <td>
                <a
                    target="_blank"
                    href={
                        "https://eldenring.wiki.fextralife.com/" +
                        props.weaponName.replaceAll(" ", "+")
                    }
                >
                    {props.weaponName}
                </a>
            </td>
            <td>{props.max.toString()}</td>
            {INFUSION_IDS.map((infId) => (
                <TableDataWithHover
                    key={infId}
                    attackRating={props.attackRatings[infId]! ?? 0}
                    max={props.max ?? 0}
                    data={props.arBreakdown[infId]! ?? DEFAULT_INFUSION_MAP}
                    style={
                        props.attackRatings[infId] == props.max &&
                        props.attackRatings[infId] != undefined
                            ? { fontWeight: 900 }
                            : {}
                    }
                />
            ))}
        </tr>
    );
}
