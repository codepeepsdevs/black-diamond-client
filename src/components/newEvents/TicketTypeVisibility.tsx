import { TicketTypeVisibility } from "@/constants/types";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";

const VisibilityStates: Record<TicketTypeVisibility, string> = {
  VISIBLE: "Visible",
  HIDDEN: "Hidden",
  HIDDEN_WHEN_NOT_ON_SALE: "Hidden when not on sale",
  CUSTOM_SCHEDULE: "Custom schedule",
} as const;
export function SelectVisibilityDropDown({
  selected,
  setSelected,
}: {
  selected: TicketTypeVisibility;
  setSelected: (value: TicketTypeVisibility) => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative ml-auto">
      {/* ACTION BUTTON */}
      <button
        type="button"
        className="w-full text-input-color bg-input-bg p-4 border border-input-border text-left"
        onClick={() => setDropdownOpen((state) => !state)}
      >
        {VisibilityStates[selected]}
      </button>
      {/* ACTION BUTTON */}
      <div
        className={cn(
          "bg-[#151515] flex-col inline-flex divide-y divide-[#151515] min-w-56 absolute z-[1] top-8 mt-2 right-0 overflow-hidden",
          dropdownOpen ? "h-max" : "h-0"
        )}
      >
        {Object.entries(VisibilityStates)?.map(([key, value]) => {
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setSelected(key as TicketTypeVisibility);
                setDropdownOpen(false);
              }}
              className="px-6 py-3 hover:bg-[#2c2b2b] capitalize flex items-center gap-x-2"
            >
              <FaCheck
                className={cn(
                  "text-[#34C759] invisible",
                  key === selected && "visible"
                )}
              />
              <span>{value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
