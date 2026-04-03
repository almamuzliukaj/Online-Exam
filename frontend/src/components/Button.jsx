import styles from "./Button.module.css";

/**
 * @param {"primary"|"secondary"|"danger"} [variant="primary"]
 * @param {"button"|"submit"|"reset"} [type="button"]
 */
export default function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  fullWidth = false,
  onClick,
  className = "",
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        styles.btn,
        styles[variant],
        fullWidth ? styles.fullWidth : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}
