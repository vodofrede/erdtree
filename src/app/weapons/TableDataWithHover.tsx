import "@/app/globals.css";
import { useState } from "react";
import DamageTypeMap from "../util/interfaces/damageTypeMap";

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
    const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });

    const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoveredCell(props.attackRating.toString());
        setCardPosition({
            top: rect.top + window.scrollY, // to account for any scrolling
            left: rect.right + 10, // slightly offset from the cell
        });
    };

    const handleMouseLeave = () => {
        setHoveredCell(""); // hide the card
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
                                        <td>{dmgType}</td>
                                        <td>
                                            {props.data.baseDmg[
                                                dmgType
                                            ]?.toFixed(1)}
                                        </td>
                                        <td>
                                            +
                                            {props.data.scalingDmg[
                                                dmgType
                                            ]?.toFixed(1)}
                                        </td>
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
