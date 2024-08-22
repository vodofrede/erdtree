import ArmorResultRow from "./ArmorResultRow";

function ArmorResultSet(props: {
    id: string;
    armorIds: string[];
    armorNames: string[];
    itemStats: string[][];
    setStats: string[];
    addIgnoredItem: Function[];
}) {
    return (
        <>
            <thead>
                <tr>
                    <th>Armor</th>
                    <th>Weight</th>
                    <th>Poise</th>
                    <th>Standard Absorptions</th>
                    <th>Elemental Absorptions</th>
                    <th>Resistances</th>
                </tr>
            </thead>
            <tbody id={props.id}>
                <ArmorResultRow
                    name="Total"
                    id={props.id + "_total"}
                    stats={props.setStats}
                    addIgnoredItem={() => null}
                />
                <ArmorResultRow
                    name={props.armorNames[0]}
                    id={props.id + "_" + props.armorIds[0]}
                    armorId={props.armorIds[0]}
                    stats={props.itemStats[0]}
                    addIgnoredItem={props.addIgnoredItem[0]}
                />
                <ArmorResultRow
                    name={props.armorNames[1]}
                    id={props.id + "_" + props.armorIds[1]}
                    armorId={props.armorIds[1]}
                    stats={props.itemStats[1]}
                    addIgnoredItem={props.addIgnoredItem[1]}
                />
                <ArmorResultRow
                    name={props.armorNames[2]}
                    id={props.id + "_" + props.armorIds[2]}
                    armorId={props.armorIds[2]}
                    stats={props.itemStats[2]}
                    addIgnoredItem={props.addIgnoredItem[2]}
                />
                <ArmorResultRow
                    name={props.armorNames[3]}
                    id={props.id + "_" + props.armorIds[3]}
                    armorId={props.armorIds[3]}
                    stats={props.itemStats[3]}
                    addIgnoredItem={props.addIgnoredItem[3]}
                />
            </tbody>
        </>
    );
}

export default ArmorResultSet;
