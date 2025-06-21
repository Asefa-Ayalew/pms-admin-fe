import { FC } from "react";

const EmptyIcon: FC<{ size?: number; color?: string }> = ({
  size = 48,
  color = "gray",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="8" y1="15" x2="16" y2="15" />
    <line x1="9" y1="11" x2="9.01" y2="11" />
    <line x1="15" y1="11" x2="15.01" y2="11" />
  </svg>
);

export default EmptyIcon;
