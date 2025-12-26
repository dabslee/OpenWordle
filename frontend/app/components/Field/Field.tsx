"use client";
import React, {useState, useEffect} from 'react'
import "./Field.css"
import Text from '../Text';

interface Props {
    variant?: "fill" | "outline"
    label?: string;
    placeholder?: string;
    value?: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    state?: "default" | "error";
}

const Field: React.FC<Props> = ({ 
    variant = "fill",
    label,
    placeholder,
    value = "",
    onChange,
    onFocus,
    onBlur,
    state,
}) => {
    const [inputValue, setInputValue] = useState<string>(value);
    const [focused, setFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue); // update internal state
        onChange(newValue);      // call parent callback
    };
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const isFloating = focused || inputValue.length > 0;

  return (
    <div style={{width: "100%"}}>
        <div className={`field-container ${variant === "fill" ? "filled" : "outlined"}`} style={{position: "relative", height: "72px"}}>
            <input
                className={"field-input text-body-b1"}
                value={inputValue}
                onChange={handleChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
            <div
                className={`field-placeholder ${
                isFloating ? "is-floating" : "is-centered"
                }`}
            >
                {placeholder}
            </div>
        </div>
    </div>
  )
}

export default Field