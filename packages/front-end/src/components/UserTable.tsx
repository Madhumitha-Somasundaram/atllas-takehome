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
          <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <button
              onClick={() => {
                onEdit(user);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-t-lg transition"
            >
              Edit
            </button>
            <button
              onClick={() => {
                onDelete(user.id);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-b-lg transition"
            >
              Delete
            </button>
          </div>
        </>
      )}
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
    <div
      className="
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
  );
}