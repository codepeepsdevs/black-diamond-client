import React from "react";
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
import {
  FiChevronsLeft,
  FiChevronsRight,
  FiDelete,
  FiDownload,
  FiEye,
  FiMoreHorizontal,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import { Order, User } from "@/constants/types";
import { FaEye, FaSort } from "react-icons/fa6";
import { useGetUsers } from "@/api/user/user.queries";
import { VscTriangleDown } from "react-icons/vsc";
import IconInputField from "../shared/IconInputField";
import { PiEyeBold } from "react-icons/pi";
import LoadingMessage from "../shared/Loader/LoadingMessage";
import { parseAsInteger, useQueryState } from "nuqs";

const UserListTable = () => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const usersQuery = useGetUsers({ page: page, limit: 10 });

  const columns: ColumnDef<User>[] = React.useMemo(
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
        id: "userId",
        header: () => (
          <div className="capitalize inline-flex items-center gap-x-2 cursor-pointer">
            <span>User ID</span>
            <FaSort className="text-xs" />
          </div>
        ),
        cell: ({ row }) => <div className="capitalize">{row.original.id}</div>,
      },
      {
        id: "name",
        header: () => (
          <div className="capitalize inline-flex items-center gap-x-2 cursor-pointer">
            <span>Name</span>
            <FaSort className="text-xs" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="capitalize">
            {row.original.firstname} {row.original.lastname}
          </div>
        ),
      },
      {
        id: "email",
        header: () => (
          <div className="capitalize inline-flex items-center gap-x-2 cursor-pointer">
            <span>Email</span>
            <FaSort className="text-xs" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.original.email}</div>
        ),
      },
      {
        id: "phoneNumber",
        header: () => (
          <div className="capitalize inline-flex items-center gap-x-2 cursor-pointer">
            <span>Phone Number</span>
            <FaSort className="text-xs" />
          </div>
        ),
        cell: ({ row }) => (
          <div className="capitalize">{row.original.phone}</div>
        ),
      },
      {
        header: () => (
          <div className="capitalize inline-flex items-center gap-x-2 cursor-pointer">
            <span>Amount Spent</span>
            <FaSort className="text-xs" />
          </div>
        ),
        id: "gross",
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue("amount")}</div> // TODO: compute or remove this field
        ),
      },
      {
        header: () => (
          <div className="capitalize inline-flex items-center gap-x-2 cursor-pointer">
            <span>Role</span>
            <FaSort className="text-xs" />
          </div>
        ),
        id: "role",
        cell: ({ row }) => (
          <div className="capitalize">{row.original.role}</div>
        ),
      },
      //   {
      //     header: () => (
      //       <div className="capitalize inline-flex items-center gap-x-2 cursor-pointer">
      //         <span>Role</span>
      //         <FaSort className="text-xs" />
      //       </div>
      //     ),
      //     id: "role",
      //     cell: ({ row }) => (
      //         <div className="capitalize inline-flex items-center gap-x-2 cursor-pointer">
      //         <span>Role</span>
      //         <FaSort className="text-xs" />
      //       </div>
      //     ),
      //   },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const payment = row.original;

          return (
            <div className="flex items-center gap-x-4">
              <button>
                <PiEyeBold />
              </button>
              <button>
                <FiTrash2 />
              </button>
              <button>
                <FiDownload />
              </button>
            </div>
          );
        },
      },
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
    data: usersQuery.data?.data || [],
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
    <div className="text-[#A3A7AA]">
      {/* TODO: Bring the table action buttons here */}

      {/* INFO CARDS */}
      <div className="overflow-x-auto">
        <div className="flex gap-x-8 justify-between whitespace-nowrap mt-12">
          {/* NEW USERS */}
          <div className="flex flex-col shrink-0 justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
            <div className="flex items-center justify-center gap-x-1">
              <VscTriangleDown className="text-[#E1306C] text-2xl" />
              <span>New Users</span>
            </div>
            {/* TODO: Compute new users or remove this field, may need a reference date to compute */}
            <div className="text-white font-semibold text-6xl">52</div>
          </div>
          {/* END NEW USERS */}

          {/* TOTAL USERS */}
          <div className="flex flex-col shrink-0 justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
            <div className="flex items-center justify-center gap-x-1">
              <VscTriangleDown className="text-[#E1306C] text-2xl" />
              <span>Total Users</span>
            </div>
            <div className="text-white font-semibold text-6xl">
              {usersQuery.data?.data.length || 0}
            </div>
          </div>
          {/* END TOTAL USERS */}

          {/* TOTAL ADMINS */}
          <div className="flex flex-col shrink-0 justify-center space-y-4 text-center bg-[#151515] w-80 h-56">
            <div className="flex items-center justify-center gap-x-1">
              <VscTriangleDown className="text-[#E1306C] text-2xl" />
              <span>Total Admins</span>
            </div>
            <div className="text-white font-semibold text-6xl">
              {usersQuery.data?.data.filter((user) => user.role === "admin")
                .length || 0}
            </div>
          </div>
          {/* END TOTAL ADMINS */}
        </div>
      </div>
      {/* END INFO CARDS */}

      {/* SEARCH USER INPUT FIELD */}
      <div className="mt-10">
        <IconInputField Icon={<FiSearch />} placeholder="Search user" />
      </div>
      {/* END SEARCH USER INPUT FIELD */}

      <div className="mt-6 whitespace-nowrap overflow-x-auto">
        <table className="w-full bg-[#151515]">
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
            {usersQuery.isPending ? (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center">
                  Loading list of users..
                </td>
              </tr>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} data-state={row.getIsSelected() && "selected"}>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        {/* TODO: implement disabling of the next and prev buttons when there is not more data and maybe even preloading tables */}
        {/* TODO: return hasMore, hasPrev, total number of pages, current page e.t.c  */}
        {/* TODO: implement loading indicator  */}
        <div className="space-x-2 flex items-center">
          <button
            className="size-10 rounded-lg bg-[#151515] text-2xl grid place-items-center"
            onClick={() =>
              setPage((prev) => {
                if (prev <= 1) {
                  return 1;
                }
                return prev - 1;
              })
            }
            disabled={page == 1}
          >
            <FiChevronsLeft />
          </button>
          <div className="h-10 min-w-10 rounded-lg bg-[#757575] grid place-items-center">
            {page}
          </div>
          <button
            className="size-10 rounded-lg bg-[#151515] text-2xl grid place-items-center"
            onClick={() => setPage((prev) => prev + 1)}
            //   disabled={!table.getCanNextPage()}
          >
            <FiChevronsRight />
          </button>
        </div>
      </div>
      {/* TODO: Implement showing from total rows */}
      <div>
        {usersQuery.isFetching ? (
          <LoadingMessage>Loading data</LoadingMessage>
        ) : (
          <div>Showing 1-10 of 1,253</div>
        )}
      </div>
    </div>
  );
};

export default UserListTable;
