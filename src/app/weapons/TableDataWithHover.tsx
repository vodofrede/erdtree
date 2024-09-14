import "@/app/globals.css";
import { useState } from "react";
import { DAMAGE_TYPE_NAMES } from "../util/constants";
import DamageTypeMap from "../util/interfaces/damageTypeMap";

const DAMAGE_TYPE_ID_TO_NAME: { [key: string]: string } = {
    physical: DAMAGE_TYPE_NAMES[0],
    magic: DAMAGE_TYPE_NAMES[1],
    fire: DAMAGE_TYPE_NAMES[2],
    lightning: DAMAGE_TYPE_NAMES[3],
    holy: DAMAGE_TYPE_NAMES[4],
    blood: DAMAGE_TYPE_NAMES[5],
    poison: DAMAGE_TYPE_NAMES[6],
    frost: DAMAGE_TYPE_NAMES[7],
    "scarlet-rot": DAMAGE_TYPE_NAMES[8],
    madness: DAMAGE_TYPE_NAMES[9],
    sleep: DAMAGE_TYPE_NAMES[10],
};

export function TableDataWithHover(props: {
    attackRating: number;
    max: number;
    data: {
        baseDmg: DamageTypeMap<number>;
        scalingDmg: DamageTypeMap<number>;
    };
    style?: React.CSSProperties;
}) {
    const [hoveredCell, setHoveredCell] = useState<string>("");
    const [cardPosition, setCardPosition] = useState({
        top: 0,
        left: 0,
    });
    const cardWidth = 200;

    const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoveredCell(props.attackRating.toString());
        setCardPosition({
            top: rect.top + window.scrollY, // to account for any scrolling
            left: rect.left - cardWidth - 10, // slightly offset from the cell
        });
    };

    const handleMouseLeave = () => {
        setHoveredCell(""); // hide the card
    };

    const renderData = (dmgType: string) => {
        switch (dmgType) {
            case "blood":
            case "poison":
            case "frost":
            case "scarlet-rot":
            case "madness":
            case "sleep":
                return (
                    <td colSpan={2}>
                        {Math.floor(
                            props.data.baseDmg[dmgType]! +
                                props.data.scalingDmg[dmgType]!
                        )}
                    </td>
                );
            default:
                return (
                    <>
                        <td>{props.data.baseDmg[dmgType]?.toFixed(1)}</td>
                        <td>+{props.data.scalingDmg[dmgType]?.toFixed(1)}</td>
                    </>
                );
        }
    };

    return (
        <td
            onMouseEnter={(e) => handleMouseEnter(e)}
            onMouseLeave={handleMouseLeave}
            style={props.style}
        >
            {props.attackRating != 0
                ? props.attackRating != undefined
                    ? props.attackRating?.toString()
                    : "-"
                : "-"}

            {hoveredCell && props.attackRating != 0 && (
                <div
                    style={{
                        position: "absolute",
                        top: `${cardPosition.top}px`,
                        left: `${cardPosition.left}px`,
                        padding: "10px",
                        backgroundColor: "var(--primary)",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        zIndex: 1000,
                        width: `${cardWidth}px`,
                    }}
                >
                    <h4>Breakdown</h4>
                    <table>
                        <tbody>
                            {Object.keys(props.data.baseDmg).map(
                                (dmgType: string, i: number) => (
                                    <tr
                                        key={i}
                                        style={{ fontWeight: "normal" }}
                                    >
                                        <td>
                                            {DAMAGE_TYPE_ID_TO_NAME[dmgType]}
                                        </td>
                                        {renderData(dmgType)}
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </td>
    );
}
