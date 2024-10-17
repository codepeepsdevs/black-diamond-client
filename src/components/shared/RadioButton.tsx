import React from "react";

function RadioButtonGroup({ children }: { children: React.ReactNode }) {}

function RadioButton<T>({
  value,
  selected = false,
  onSelect,
}: {
  value: T;
  selected?: boolean;
  onSelect?: (v: T) => void;
}) {
  return (
    <>
      {/* RADIO BUTTON */}
      <button
        onClick={() => onSelect && onSelect(value)}
        type="button"
        className="size-6 grid place-items-center"
      >
        <div
          data-selected={selected}
          className="size-[10px] rounded-full data-[selected=true]:bg-[#757575] outline outline-[1.5px] outline-[#757575] outline-offset-4"
        ></div>
      </button>
      {/* END RADIO BUTTON */}
    </>
  );
}

export default RadioButton;
