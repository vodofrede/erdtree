import { AttackRating } from "../util/interfaces/attackRating";

export function WeaponResultRow(props: {
    weaponName: string;
    attackRatings: AttackRating;
    max: number;
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
            <td>{props.max.toString() || "-"}</td>
            <td
                style={
                    props.attackRatings["standard"] == props.max &&
                    props.attackRatings["standard"] != undefined
                        ? { fontWeight: 900 }
                        : {}
                }
            >
                {props.attackRatings["standard"] != 0
                    ? props.attackRatings["standard"] != undefined
                        ? props.attackRatings["standard"]?.toString()
                        : "-"
                    : "-"}
            </td>
            <td
                style={
                    props.attackRatings["heavy"] == props.max &&
                    props.attackRatings["heavy"] != undefined
                        ? { fontWeight: 900 }
                        : {}
                }
            >
                {props.attackRatings["heavy"] != 0
                    ? props.attackRatings["heavy"] != undefined
                        ? props.attackRatings["heavy"]?.toString()
                        : "-"
                    : "-"}
            </td>
            <td
                style={
                    props.attackRatings["keen"] == props.max &&
                    props.attackRatings["keen"] != undefined
                        ? { fontWeight: 900 }
                        : {}
                }
            >
                {props.attackRatings["keen"] != 0
                    ? props.attackRatings["keen"] != undefined
                        ? props.attackRatings["keen"]?.toString()
                        : "-"
                    : "-"}
            </td>
            <td
                style={
                    props.attackRatings["quality"] == props.max &&
                    props.attackRatings["quality"] != undefined
                        ? { fontWeight: 900 }
                        : {}
                }
            >
                {props.attackRatings["quality"] != 0
                    ? props.attackRatings["quality"] != undefined
                        ? props.attackRatings["quality"]?.toString()
                        : "-"
                    : "-"}
            </td>
            <td
                style={
                    props.attackRatings["fire"] == props.max &&
                    props.attackRatings["fire"] != undefined
                        ? { fontWeight: 900 }
                        : {}
                }
            >
                {props.attackRatings["fire"] != 0
                    ? props.attackRatings["fire"] != undefined
                        ? props.attackRatings["fire"]?.toString()
                        : "-"
                    : "-"}
            </td>
            <td
                style={
                    props.attackRatings["flame-art"] == props.max &&
                    props.attackRatings["flame-art"] != undefined
                        ? { fontWeight: 900 }
                        : {}
                }
            >
                {props.attackRatings["flame-art"] != 0
                    ? props.attackRatings["flame-art"] != undefined
                        ? props.attackRatings["flame-art"]?.toString()
                        : "-"
                    : "-"}
            </td>
            <td
                style={
                    props.attackRatings["lightning"] == props.max &&
                    props.attackRatings["lightning"] != undefined
                        ? { fontWeight: 900 }
                        : {}
                }
            >
                {props.attackRatings["lightning"] != 0
                    ? props.attackRatings["lightning"] != undefined
                        ? props.attackRatings["lightning"]?.toString()
                        : "-"
                    : "-"}
            </td>
            <td
                style={
                    props.attackRatings["sacred"] == props.max &&
                    props.attackRatings["sacred"] != undefined
                        ? { fontWeight: 900 }
                        : {}
                }
            >
                {props.attackRatings["sacred"] != 0
                    ? props.attackRatings["sacred"] != undefined
                        ? props.attackRatings["sacred"]?.toString()
                        : "-"
                    : "-"}
            </td>
            <td
                style={
                    props.attackRatings["magic"] == props.max &&
                    props.attackRatings["magic"] != undefined
                        ? { fontWeight: 900 }
                        : {}
                }
            >
                {props.attackRatings["magic"] != 0
                    ? props.attackRatings["magic"] != undefined
                        ? props.attackRatings["magic"]?.toString()
                        : "-"
                    : "-"}
            </td>
            <td
                style={
                    props.attackRatings["cold"] == props.max &&
                    props.attackRatings["cold"] != undefined
                        ? { fontWeight: 900 }
                        : {}
                }
            >
                {props.attackRatings["cold"] != 0
                    ? props.attackRatings["cold"] != undefined
                        ? props.attackRatings["cold"]?.toString()
                        : "-"
                    : "-"}
            </td>
            <td
                style={
                    props.attackRatings["poison"] == props.max &&
                    props.attackRatings["poison"] != undefined
                        ? { fontWeight: 900 }
                        : {}
                }
            >
                {props.attackRatings["poison"] != 0
                    ? props.attackRatings["poison"] != undefined
                        ? props.attackRatings["poison"]?.toString()
                        : "-"
                    : "-"}
            </td>
            <td
                style={
                    props.attackRatings["blood"] == props.max &&
                    props.attackRatings["blood"] != undefined
                        ? { fontWeight: 900 }
                        : {}
                }
            >
                {props.attackRatings["blood"] != 0
                    ? props.attackRatings["blood"] != undefined
                        ? props.attackRatings["blood"]?.toString()
                        : "-"
                    : "-"}
            </td>
            <td
                style={
                    props.attackRatings["occult"] == props.max &&
                    props.attackRatings["occult"] != undefined
                        ? { fontWeight: 900 }
                        : {}
                }
            >
                {props.attackRatings["occult"] != 0
                    ? props.attackRatings["occult"] != undefined
                        ? props.attackRatings["occult"]?.toString()
                        : "-"
                    : "-"}
            </td>
        </tr>
    );
}
