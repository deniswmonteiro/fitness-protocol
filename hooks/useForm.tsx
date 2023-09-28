import React from "react";

type IFieldAttrs = {
    regex?: RegExp,
    min?: number,
    message: string
}

type IField = {
    [key: string]: IFieldAttrs
}

type ITypes = {
    [key: string]: IField
}

type IUseForm = {
    type?: string,
    min?: number,
    initial?: string,
}

const types: ITypes = {
    name: {
        format: {
            regex: /^[a-zA-Zà-úÀ-Ú\s]{2,}$/,
            message: "Digite um Nome válido."
        },
        length: {
            min: 2,
            message: "Mínimo de 2 caracteres.",
        }
    },
    weight: {
        format: {
            regex: /^(([\d]{1,3})(\,([\d]{1,2}))?)$/,
            message: "Digite um Peso válido."
        }
    },
    height: {
        format: {
            regex: /^[0-9]+$/,
            message: "Digite uma Altura válida."
        }
    },
    email: {
        format: {
            regex: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: "Preencha um Email válido.",
        }
    },
    password: {
        format: {
            regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/,
            message: "A Senha deve possuir pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.",
        },
        length: {
            min: 6,
            message: "Mínimo de 6 caracteres.",
        }
    },
    exerciseWeight: {
        format: {
            regex: /^(([\d]{1,3})(\,([\d]{1,2}))?)$/,
            message: "Digite uma Carga válida."
        }
    },
};

const useForm = ({ type, min = 0, initial = "" }: IUseForm) => {
    const [value, setValue] = React.useState(initial);
    const [message, setMessage] = React.useState<string | null>(null);
    const [valid, setValid] = React.useState<boolean | null>(null);

    const validate = (value: string) => {
        if (!type) return true;
        
        if (value.trim().length === 0) {
            setMessage("Preencha o campo.");
            setValid(false);
            return false;
        }

        else if (Number(value) === 0 && !isNaN(Number(value))) {
            setMessage("Digite um valor diferente de zero.");
            setValid(false);
            return false;
        }

        else if (types[type] && ("length" in types[type]) && value.trim().length < min) {
            setMessage(types[type].length.message);
            setValid(false);
            return false;
        }

        else if (types[type] && ("format" in types[type]) && !types[type].format.regex?.test(value)) {
            setMessage(types[type].format.message);
            setValid(false);
            return false;
        }

        else {
            setMessage("Formato válido.");
            setValid(true);
            return true;
        }
    }

    const onChange = ({target}: {target: HTMLInputElement | HTMLSelectElement}) => {
        validate(target.value);
        setValue(target.value);
    }

    return {
        value,
        setValue,
        message,
        setMessage,
        valid,
        setValid,
        validate: () => validate(value),
        onBlur: () => validate(value),
        onChange,
    }
}

export default useForm