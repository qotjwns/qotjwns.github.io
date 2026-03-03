import { Link } from "react-router-dom";

export default function BackLink({
  to,
  label,
  variant = "pill",
  className = "",
}) {
  const variantClass = variant === "icon" ? "blog-back-icon" : "blog-back-empty";
  const classes = ["blog-back", variantClass, className].filter(Boolean).join(" ");

  if (variant === "icon") {
    return (
      <Link aria-label={label} className={classes} to={to}>
        <span aria-hidden="true">←</span>
        <span className="sr-only">{label}</span>
      </Link>
    );
  }

  return (
    <Link className={classes} to={to}>
      {label}
    </Link>
  );
}
