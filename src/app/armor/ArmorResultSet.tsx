import { Set } from "../util/types/set";
import ArmorResultRow from "./ArmorResultRow";

function ArmorResultSet(props: {
    id: string;
    armorIds: string[];
    armorNames: string[];
    itemStats: string[][];
    setStats: string[];
    best: Set[];
    addIgnoredItem: Function[];
}) {
    return (
        <>
            <thead>
                <tr>
                    <th>Armor</th>
                    <th>Absorption</th>
                    <th>Resistances</th>
                </tr>
            </thead>
            <tbody id={props.id}>
                <ArmorResultRow
                    name="Total"
                    absorption="Absorption"
                    resistances="Resistances"
                    id={props.id + "_total"}
                    stats={props.setStats}
                    best={props.best}
                    addIgnoredItem={() => null}
                />
                <ArmorResultRow
                    name={props.armorNames[0]}
                    absorption="Absorption"
                    resistances="Resistances"
                    id={props.id + "_" + props.armorIds[0]}
                    armorId={props.armorIds[0]}
                    stats={props.itemStats[0]}
                    best={props.best}
                    addIgnoredItem={props.addIgnoredItem[0]}
                />
                <ArmorResultRow
                    name={props.armorNames[1]}
                    absorption="Absorption"
                    resistances="Resistances"
                    id={props.id + "_" + props.armorIds[1]}
                    armorId={props.armorIds[1]}
                    stats={props.itemStats[1]}
                    best={props.best}
                    addIgnoredItem={props.addIgnoredItem[1]}
                />
                <ArmorResultRow
                    name={props.armorNames[2]}
                    absorption="Absorption"
                    resistances="Resistances"
                    id={props.id + "_" + props.armorIds[2]}
                    armorId={props.armorIds[2]}
                    stats={props.itemStats[2]}
                    best={props.best}
                    addIgnoredItem={props.addIgnoredItem[2]}
                />
                <ArmorResultRow
                    name={props.armorNames[3]}
                    absorption="Absorption"
                    resistances="Resistances"
                    id={props.id + "_" + props.armorIds[3]}
                    armorId={props.armorIds[3]}
                    stats={props.itemStats[3]}
                    best={props.best}
                    addIgnoredItem={props.addIgnoredItem[3]}
                />
            </tbody>
        </>
    );
}

export default ArmorResultSet;
