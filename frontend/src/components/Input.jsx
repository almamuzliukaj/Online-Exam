import { forwardRef, useState } from "react";
import styles from "./Input.module.css";

/**
 * Labelled input with optional show/hide for password type.
 */
const Input = forwardRef(function Input(
  {
    label,
    id,
    type = "text",
    error,
    hint,
    className = "",
    ...rest
  },
  ref
) {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPwd ? "text" : "password") : type;

  return (
    <div className={[styles.field, className].filter(Boolean).join(" ")}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputWrap}>
        <input
          ref={ref}
          id={id}
          type={resolvedType}
          className={[styles.input, error ? styles.inputError : ""].filter(Boolean).join(" ")}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            aria-label={showPwd ? "Hide password" : "Show password"}
            tabIndex={-1}
            onClick={() => setShowPwd((v) => !v)}
          >
            {showPwd ? (
              /* eye-off */
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              /* eye */
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <span id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </span>
      )}
      {hint && !error && (
        <span className={styles.hint}>{hint}</span>
      )}
    </div>
  );
});

export default Input;
