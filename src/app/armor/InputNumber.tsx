function InputNumber(props: {
    id: string;
    label: string;
    className: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
    value: number;
    name: string | undefined;
    disabled?: boolean;
}) {
    return (
        <div>
            <label htmlFor={props.id}>{props?.label}</label>
            <input
                style={{ maxWidth: "50px" }}
                className={props?.className}
                id={props.id}
                type="number"
                onChange={props?.onChange}
                min="0"
                step="0.1"
                value={props.value}
                name={props?.name}
                lang="en"
                disabled={props.disabled}
            />
        </div>
    );
}

export default InputNumber;
