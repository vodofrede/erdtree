function InputRadio(props: {
    id: string;
    onClick: React.ChangeEventHandler<HTMLInputElement>;
    name: string;
    value?: string | number | readonly string[];
    label: string;
    checked?: boolean;
}) {
    return (
        <div>
            <div>
                <input
                    type="radio"
                    id={props.id}
                    onChange={props.onClick}
                    name={props.name}
                    value={props.value}
                    checked={props.checked}
                />
                <label htmlFor={props.id}>{props.label}</label>
            </div>
        </div>
    );
}

export default InputRadio;
