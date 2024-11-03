import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import Checkbox from "../shared/Checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { FiMoreHorizontal } from "react-icons/fi";
import { Order } from "@/constants/types";
import { ExtendedOrder, useGetOrders } from "@/api/order/order.queries";
import { FaSort, FaSortDown } from "react-icons/fa6";
import * as dateFns from "date-fns";
import { cn } from "@/utils/cn";

const RecentOrdersTable = () => {
  const orderListQuery = useGetOrders();
  const orderListData = orderListQuery.data?.data;

  const columns: ColumnDef<ExtendedOrder>[] = React.useMemo(
    () => [
      {
        id: "id",
        header: ({ table }) => (
          <Checkbox
            // @ts-expect-error TODO: handle indeterminate state
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "date",
        header: () => (
          <div className="capitalize inline-flex items-center gap-x-2 cursor-pointer">
            <span>Date</span>
            <FaSort className="text-xs" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="capitalize">
            <div>
              {dateFns.format(new Date(row.original.createdAt), "dd/MM/yyyy")}
            </div>
            <div>
              {dateFns.format(new Date(row.original.createdAt), "hh:mm a")}
            </div>
          </div>
        ),
      },
      {
        id: "eventName",
        header: () => (
          <div className="capitalize inline-flex items-center gap-x-2 cursor-pointer">
            <span>Event Name</span>
            <FaSort className="text-xs" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.original.event.name}</div>
        ),
      },
      {
        id: "customerName",
        header: () => (
          <div className="capitalize inline-flex items-center gap-x-2 cursor-pointer">
            <span>Customer name</span>
            <FaSort className="text-xs" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="capitalize">
            {row.original.user?.firstname} {row.original.user?.lastname}
          </div>
        ),
      },
      {
        id: "ticketQuantity",
        header: () => (
          <div className="capitalize inline-flex items-center gap-x-2 cursor-pointer">
            <span>Tickets</span>
            <FaSort className="text-xs" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.original.tickets.length}</div>
        ),
      },
      {
        header: () => (
          <div className="capitalize inline-flex items-center gap-x-2 cursor-pointer">
            <span>Amount</span>
            <FaSort className="text-xs" />
          </div>
        ),
        id: "price",
        cell: ({ row }) => (
          <div className="capitalize">${row.original.orderAmount}</div>
        ),
      },
      {
        header: () => (
          <div className="capitalize inline-flex items-center gap-x-2 cursor-pointer">
            <span>Status</span>
            <FaSort className="text-xs" />
          </div>
        ),
        id: "status",
        cell: ({ row }) => (
          <span
            className={cn(
              row.original.status === "COMPLETED"
                ? "text-[#34C759]"
                : row.original.status === "PENDING"
                  ? "text-yellow-500"
                  : "text-[#E1306C]"
            )}
          >
            {row.original.status === "COMPLETED"
              ? "Success"
              : row.original.status === "PENDING"
                ? "Pending"
                : "Failed"}
          </span>
        ),
      },
      // {
      //   id: "actions",
      //   enableHiding: false,
      //   cell: ({ row }) => {
      //     const payment = row.original;

      //     return (
      //       <Popover>
      //         <PopoverTrigger asChild>
      //           <FiMoreHorizontal className="h-4 w-4" />
      //         </PopoverTrigger>
      //         <PopoverContent align="end">
      //           <button
      //             onClick={() => navigator.clipboard.writeText(payment.id)}
      //           >
      //             Copy payment ID
      //           </button>
      //           <button>View customer</button>
      //           <button>View payment details</button>
      //         </PopoverContent>
      //       </Popover>
      //     );
      //   },
      // },
    ],
    []
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: orderListData?.orders || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div className="text-[#A3A7AA] overflow-x-auto">
        {/* TODO: Bring the table action buttons here */}
        <div className="mt-6">
          <table className="w-full bg-[#151515] whitespace-nowrap overflow-x-auto">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-b-[#A3A7AA] text-white"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} className="p-4 m-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {orderListQuery.isPending ? (
                <tr>
                  <td colSpan={columns.length} className="h-24 text-center">
                    Loading orders..
                  </td>
                </tr>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4 m-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div> */}
      </div>
    </>
  );
};

export default RecentOrdersTable;

function FilterSelect({
  items,
  onSelect,
}: {
  onSelect: (value: string) => void;
  items: {
    title: string;
    value: string;
  }[];
}) {
  const [selectValue, setSelectValue] = useState(items[0].value);
  const [selectOpen, setSelectOpen] = useState(false);
  return (
    <div className="text-white relative">
      {/* SELECT DISPLAY */}
      <button
        className={
          "bg-[#151515] w-44 h-14 px-6 flex items-center gap-x-8 justify-between"
        }
        onClick={() => setSelectOpen((state) => !state)}
      >
        <span>{items.find((item) => item.value === selectValue)?.title}</span>

        <FaSortDown className="-mt-2" />
      </button>
      {/* END SELECT DISPLAY */}

      {/* SELECT DROPDOWN */}
      <div
        className={cn(
          "bg-[#151515] flex-col inline-flex divide-y divide-[#151515] min-w-36 absolute top-14 mt-2 right-0 overflow-hidden",
          selectOpen ? "h-max" : "h-0"
        )}
      >
        {items.map((item) => {
          return (
            <button
              onClick={() => {
                setSelectValue(item.value);
                onSelect(item.value);
                setSelectOpen(false);
              }}
              className="px-6 py-3 hover:bg-[#2c2b2b]"
            >
              {item.title}
            </button>
          );
        })}
      </div>
      {/* END SELECT DROPDOWN */}
    </div>
  );
}
