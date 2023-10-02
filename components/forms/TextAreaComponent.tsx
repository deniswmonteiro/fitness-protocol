import React from "react";
import Form from "react-bootstrap/Form";
import styles from "./TextAreaComponent.module.css";

type ITextAreaComponent = React.ComponentProps<"input"> & {
    label?: string,
    rows: number,
    value: string,
    message: string | null,
    valid: boolean | null,
}

const TextAreaComponent = ({ label, id, rows, value, onChange, onBlur, message, valid }: ITextAreaComponent) => {
    return (
        <Form.Group className="mb-4">
            <Form.Label htmlFor={id} className={styles.label}>
                {label}
            </Form.Label>
            <Form.Control as="textarea" rows={rows}
                className={valid === null ? styles.input : `${valid ? styles.valid : styles.invalid}`}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                onBlur={onBlur} />

            <Form.Control.Feedback type={valid ? "valid" : "invalid"}
                style={{display: "block"}}>
                {message && message}
            </Form.Control.Feedback>
        </Form.Group>
    )
}

export default TextAreaComponent