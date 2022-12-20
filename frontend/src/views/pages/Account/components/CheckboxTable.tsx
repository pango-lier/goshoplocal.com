import React, { HTMLProps } from "react";
function CheckboxTable({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (ref?.current) {
      if (typeof indeterminate === "boolean") {
        ref.current.indeterminate = !rest.checked && indeterminate;
      }
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      style={{
        verticalAlign: "middle"
      }}
      className={className + " cursor-pointer" + " form-check-input"}
      {...rest}
    />
  );
}

export default CheckboxTable;
