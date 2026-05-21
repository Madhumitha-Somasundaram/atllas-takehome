import { User } from "../types/user";
import { useState } from "react";

type SortField = keyof User;

type Props = {
  users: User[];
  onEdit: (u: User) => void;
  onDelete: (id: number) => void;

  sort: SortField;
  order: "ASC" | "DESC";
  setSort: (v: SortField) => void;
  setOrder: (v: "ASC" | "DESC") => void;
};

// ---------------- HEADER ----------------
function SortableHeader({
  label,
  field,
  sort,
  order,
  setSort,
  setOrder,
}: {
  label: string;
  field: SortField;
  sort: SortField;
  order: "ASC" | "DESC";
  setSort: (v: SortField) => void;
  setOrder: (v: "ASC" | "DESC") => void;
}) {
  const active = sort === field;

  const handleClick = () => {
    if (active) {
      setOrder(order === "ASC" ? "DESC" : "ASC");
    } else {
      setSort(field);
      setOrder("ASC");
    }
  };

  return (
    <th
      className={`
        p-3 cursor-pointer select-none
        dark:border-b border-violet-500
        transition
        ${active ? "font-semibold" : ""}
        text-gray-800 dark:text-white
      `}
      onClick={handleClick}
    >
      <div className="flex items-center gap-1">
        {label}

        {active && (
          <span className="text-xs text-violet-800 dark:text-violet-500">
            {order === "ASC" ? "▲" : "▼"}
          </span>
        )}
      </div>
    </th>
  );
}

// ---------------- ACTIONS MENU ----------------
function ActionsMenu({
  user,
  onEdit,
  onDelete,
}: {
  user: User;
  onEdit: (u: User) => void;
  onDelete: (id: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
      >
        <img
          src="/3Dots_black.png"
          alt="Menu"
          className="w-5 h-5 dark:hidden"
        />
        <img
          src="/3Dots_White.png"
          alt="Menu"
          className="w-5 h-5 hidden dark:block"
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-1 w-20 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <button
              onClick={() => {
                onEdit(user);
                setIsOpen(false);
              }}
              className="group relative w-full flex items-center justify-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg transition"
              title="Edit"
            >
              <img
                src="/edit_black.png"
                alt="Edit"
                className="w-5 h-5 dark:hidden"
              />
              <img
                src="/edit_white.png"
                alt="Edit"
                className="w-5 h-5 hidden dark:block"
              />
              <span className="absolute left-full ml-2 px-2 py-1 text-xs text-white bg-gray-800 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Edit
              </span>
            </button>
            <button
              onClick={() => {
                onDelete(user.id);
                setIsOpen(false);
              }}
              className="group relative w-full flex items-center justify-center px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg transition"
              title="Delete"
            >
              <img
                src="/delete.png"
                alt="Delete"
                className="w-5 h-5"
              />
              <span className="absolute left-full ml-2 px-2 py-1 text-xs text-white bg-gray-800 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Delete
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------- USER CARD (MOBILE) ----------------
function UserCard({
  user,
  onEdit,
  onDelete,
}: {
  user: User;
  onEdit: (u: User) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="bg-stone-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-violet-500/70 hover:bg-violet-900/30 dark:hover:bg-violet-500/20 transition shadow-lg dark:shadow-violet-500/30">
      {/* First line: ID and action icons */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-300 dark:border-violet-500/70">
        <span className="text-sm font-semibold text-gray-800 dark:text-white">
          ID: {user.id}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(user)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
            title="Edit"
          >
            <img
              src="/edit_black.png"
              alt="Edit"
              className="w-5 h-5 dark:hidden"
            />
            <img
              src="/edit_white.png"
              alt="Edit"
              className="w-5 h-5 hidden dark:block"
            />
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
            title="Delete"
          >
            <img
              src="/delete.png"
              alt="Delete"
              className="w-5 h-5"
            />
          </button>
        </div>
      </div>

      {/* User details */}
      <div className="space-y-2 text-sm">
        <div className="flex">
          <span className="font-medium text-gray-600 dark:text-gray-400 w-28 flex-shrink-0">First Name:</span>
          <span className="text-gray-800 dark:text-white">{user.firstName}</span>
        </div>
        <div className="flex">
          <span className="font-medium text-gray-600 dark:text-gray-400 w-28 flex-shrink-0">Middle Name:</span>
          <span className="text-gray-800 dark:text-white">{user.middleName || "-"}</span>
        </div>
        <div className="flex">
          <span className="font-medium text-gray-600 dark:text-gray-400 w-28 flex-shrink-0">Last Name:</span>
          <span className="text-gray-800 dark:text-white">{user.lastName}</span>
        </div>
        <div className="flex">
          <span className="font-medium text-gray-600 dark:text-gray-400 w-28 flex-shrink-0">Email:</span>
          <span className="text-gray-800 dark:text-white break-all">{user.email}</span>
        </div>
        <div className="flex">
          <span className="font-medium text-gray-600 dark:text-gray-400 w-28 flex-shrink-0">Phone:</span>
          <span className="text-gray-800 dark:text-white">{user.phoneNumber || "-"}</span>
        </div>
        <div className="flex">
          <span className="font-medium text-gray-600 dark:text-gray-400 w-28 flex-shrink-0">Address:</span>
          <span className="text-gray-800 dark:text-white flex-1">{user.address || "-"}</span>
        </div>
        <div className="flex">
          <span className="font-medium text-gray-600 dark:text-gray-400 w-28 flex-shrink-0">Notes:</span>
          <span className="text-gray-800 dark:text-white flex-1">{user.adminNotes || "-"}</span>
        </div>
        <div className="flex">
          <span className="font-medium text-gray-600 dark:text-gray-400 w-28 flex-shrink-0">Registered:</span>
          <span className="text-gray-800 dark:text-white">
            {user.registered ? new Date(user.registered).toLocaleDateString() : "-"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------- MOBILE SORT CONTROLS ----------------
function MobileSortControls({
  sort,
  order,
  setSort,
  setOrder,
}: {
  sort: SortField;
  order: "ASC" | "DESC";
  setSort: (v: SortField) => void;
  setOrder: (v: "ASC" | "DESC") => void;
}) {
  const sortOptions: { value: SortField; label: string }[] = [
    { value: "id", label: "ID" },
    { value: "firstName", label: "First Name" },
    { value: "middleName", label: "Middle Name" },
    { value: "lastName", label: "Last Name" },
    { value: "email", label: "Email" },
    { value: "phoneNumber", label: "Phone" },
    { value: "address", label: "Address" },
    { value: "adminNotes", label: "Notes" },
    { value: "registered", label: "Registered" },
  ];

  return (
    <div className="flex gap-2 mb-4">
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value as SortField)}
        className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            Sort by: {option.label}
          </option>
        ))}
      </select>
      <button
        onClick={() => setOrder(order === "ASC" ? "DESC" : "ASC")}
        className="px-4 py-2 rounded-lg bg-violet-800 dark:bg-violet-600 text-white hover:bg-violet-500 dark:hover:bg-violet-400 transition flex items-center gap-2"
      >
        {order === "ASC" ? "▲" : "▼"}
        <span className="hidden sm:inline">{order === "ASC" ? "Ascending" : "Descending"}</span>
      </button>
    </div>
  );
}

// ---------------- TABLE ----------------
export default function UserTable({
  users,
  onEdit,
  onDelete,
  sort,
  order,
  setSort,
  setOrder,
}: Props) {
  return (
    <>
      {/* Desktop Table View */}
      <div
        className="
          hidden lg:block
          rounded-2xl shadow overflow-x-auto
          bg-white dark:bg-gray-900 dark:border-2 border-violet-600
          transition-colors duration-300
        "
      >
        <table className="w-full text-sm min-w-[1100px]">

          {/* HEADER */}
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <SortableHeader label="ID" field="id" {...{ sort, order, setSort, setOrder }} />
              <SortableHeader label="First Name" field="firstName" {...{ sort, order, setSort, setOrder }} />
              <SortableHeader label="Middle Name" field="middleName" {...{ sort, order, setSort, setOrder }} />
              <SortableHeader label="Last Name" field="lastName" {...{ sort, order, setSort, setOrder }} />
              <SortableHeader label="Email" field="email" {...{ sort, order, setSort, setOrder }} />
              <SortableHeader label="Phone" field="phoneNumber" {...{ sort, order, setSort, setOrder }} />
              <SortableHeader label="Address" field="address" {...{ sort, order, setSort, setOrder }} />
              <SortableHeader label="Notes" field="adminNotes" {...{ sort, order, setSort, setOrder }} />
              <SortableHeader label="Registered" field="registered" {...{ sort, order, setSort, setOrder }} />

              <th className="p-3 text-gray-800 dark:text-white dark:border-b border-violet-600">
                Actions
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="
                  bg-stone-100
                  dark:bg-gray-900 dark:text-white dark:border-b border-violet-500/40
                  hover:bg-violet-900/30 dark:hover:bg-violet-500/20
                  transition
                "
              >
                <td className="p-3 text-gray-800 dark:text-white">{u.id}</td>
                <td className="p-3 text-gray-800 dark:text-white">{u.firstName}</td>
                <td className="p-3 text-gray-800 dark:text-white">{u.middleName || "-"}</td>
                <td className="p-3 text-gray-800 dark:text-white">{u.lastName}</td>
                <td className="p-3 text-gray-800 dark:text-white">{u.email}</td>
                <td className="p-3 text-gray-800 dark:text-white">{u.phoneNumber || "-"}</td>
                <td className="p-3 text-gray-800 dark:text-white">{u.address || "-"}</td>
                <td className="p-3 text-gray-800 dark:text-white">{u.adminNotes || "-"}</td>
                <td className="p-3 text-gray-800 dark:text-white">
                  {u.registered ? new Date(u.registered).toLocaleDateString() : "-"}
                </td>

                <td className="p-3">
                  <ActionsMenu user={u} onEdit={onEdit} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="lg:hidden">
        <MobileSortControls sort={sort} order={order} setSort={setSort} setOrder={setOrder} />
        <div className="space-y-4">
          {users.map((u) => (
            <UserCard key={u.id} user={u} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </div>
    </>
  );
}