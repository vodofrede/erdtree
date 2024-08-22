function ArmorResultRow(props: {
    name: string;
    id: string;
    armorId?: string;
    stats: string[];
    addIgnoredItem: Function;
}) {
    let ignoreButton;
    let name;
    if (props.name == "Total") {
        name = <b>{props.name}</b>;
        ignoreButton = null;
    } else {
        name = (
            <a
                href={
                    "https://eldenring.wiki.fextralife.com/" +
                    props.name.replaceAll(" ", "+")
                }
                target="_blank"
                rel="noopener noreferrer"
            >
                {props.name}
            </a>
        );
        ignoreButton = (
            <button
                onClick={() => props.addIgnoredItem(props.armorId)}
                style={{
                    marginLeft: "5px",
                    backgroundColor: "transparent",
                    border: "none",
                }}
            >
                {" "}
                ❌
            </button>
        );
    }
    return (
        <tr id={props.id}>
            <td>
                {name}
                {ignoreButton}
            </td>
            <td>{props.stats[0]}</td>
            <td>{props.stats[1]}</td>
            <td>{props.stats[2]}</td>
            <td>{props.stats[3]}</td>
            <td>{props.stats[4]}</td>
        </tr>
    );
}

export default ArmorResultRow;
