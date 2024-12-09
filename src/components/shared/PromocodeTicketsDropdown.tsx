import { TicketType } from "@/constants/types";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { FaCheck } from "react-icons/fa6";

export function SelectTicketsDropDown({
  disabled,
  ticketTypes,
  selectedTicketTypeIds,
  setSelectedTicketTypeIds,
}: {
  disabled: boolean;
  ticketTypes: TicketType[];
  selectedTicketTypeIds: TicketType["id"][];
  setSelectedTicketTypeIds: (value: string[]) => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function handleSelectTicketTypeId(ticketTypeId: string) {
    // setSelectedTicketTypeIds((prevState) => {
    const ticketTypeIdExists = selectedTicketTypeIds.includes(ticketTypeId);
    if (ticketTypeIdExists) {
      setSelectedTicketTypeIds(
        selectedTicketTypeIds.filter((selectedId) => {
          if (ticketTypeId === selectedId) {
            return false;
          } else {
            return true;
          }
        })
      );
    } else {
      setSelectedTicketTypeIds([...selectedTicketTypeIds, ticketTypeId]);
    }
    // });
  }

  return (
    <div className="relative ml-auto">
      {/* ACTION BUTTON */}
      <button
        disabled={disabled}
        type="button"
        className="text-[#4267B2] disabled:text-[#BDBDBD]"
        onClick={() => setDropdownOpen((state) => !state)}
      >
        Select
      </button>
      {/* ACTION BUTTON */}
      <div
        className={cn(
          "bg-[#151515] flex-col inline-flex divide-y divide-[#151515] min-w-56 absolute z-[1] top-8 mt-2 right-0 overflow-hidden",
          dropdownOpen ? "h-max" : "h-0"
        )}
      >
        {ticketTypes?.map((ticketType) => {
          return (
            <button
              key={ticketType.id}
              onClick={() => {
                handleSelectTicketTypeId(ticketType.id);
              }}
              className="px-6 py-3 hover:bg-[#2c2b2b] capitalize flex items-center gap-x-2"
            >
              <FaCheck
                className={cn(
                  "text-[#34C759] invisible",
                  selectedTicketTypeIds.includes(ticketType.id) && "visible"
                )}
              />
              <span>{ticketType.name.toLowerCase()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
