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
                    attackRating={props.attackRatings[infId]!}
                    max={props.max}
                    data={props.arBreakdown[infId]!}
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
