import React, { useState } from "react";
import styles from "./Input.module.css";

interface InputProps {
  type?: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error,
}) => {
  const [inputType, setInputType] = useState(type);

  const togglePasswordVisibility = () => {
    setInputType(
      inputType === "password" ? "text" : "password"
    );
  };

  return (
    <div className={styles.formGroup}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && (
            <span className={styles.required}>*</span>
          )}
        </label>
      )}
      <div className={styles.inputContainer}>
        <input
          type={inputType}
          className={`${styles.input} ${error ? styles.error : ""}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
        {type === "password" && (
          <button
            type="button"
            className={styles.togglePassword}
            onClick={togglePasswordVisibility}
          >
            {inputType === "password" ? "👁️" : "👁️‍🗨️"}
          </button>
        )}
      </div>
      {error && (
        <span className={styles.errorText}>{error}</span>
      )}
    </div>
  );
};
