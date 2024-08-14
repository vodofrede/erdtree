import { ChangeEventHandler } from "react";
import { Armor } from "../util/types/armor";

function InputSelect(props: {
    id: string;
    label: string;
    name: string;
    onChange: ChangeEventHandler<HTMLSelectElement>;
    options: Armor[];
}) {
    return (
        <div>
            <label htmlFor={props.id}>{props.label}</label>
            <select
                itemType="text"
                id={props.id}
                name={props.name}
                onChange={props.onChange}
            >
                <option value="none">None</option>
                {props.options.map((item: Armor) => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default InputSelect;
