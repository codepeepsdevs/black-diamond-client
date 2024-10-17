import React, { ComponentProps, forwardRef } from "react";

const Checkbox = forwardRef<HTMLInputElement, ComponentProps<"input">>(
  ({ className, required, ...props }, ref) => {
    return (
      <label className={`checkbox-container ${className}`}>
        <input type="checkbox" ref={ref} required={required} {...props} />
        <span className="checkmark"></span>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
