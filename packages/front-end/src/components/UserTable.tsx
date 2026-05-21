import { User } from "../types/user";
import { useState } from "react";

type SortField = keyof User;

type Props = {
  users: User[];
  onEdit: (u: User) => void;
  onDelete: (id: number) => void;
  onBulkDelete?: (ids: number[]) => void;

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
        dark:border-b border-violet-700
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

// ---------------- SINGLE DELETE CONFIRMATION ----------------
function SingleDeleteConfirmation({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-violet-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Confirm Delete
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete this user?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="
              px-4 py-2 rounded-lg
              border border-gray-300 dark:border-gray-600
              text-gray-700 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4 py-2 rounded-lg
              bg-red-600 text-white
              hover:bg-red-700
              transition
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
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
                  setShowDeleteConfirm(true);
                  setIsOpen(false);
                }}
                className="group relative w-full flex items-center justify-center px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg transition"
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

      {showDeleteConfirm && (
        <SingleDeleteConfirmation
          onConfirm={() => {
            onDelete(user.id);
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}

// ---------------- USER CARD (MOBILE) ----------------
function UserCard({
  user,
  onEdit,
  onDelete,
  isSelected,
  onToggleSelect,
}: {
  user: User;
  onEdit: (u: User) => void;
  onDelete: (id: number) => void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <div
        className={`
          bg-stone-100 dark:bg-gray-800
          rounded-lg p-4 border
          border-gray-200 dark:border-violet-500/70
          hover:bg-violet-900/30 dark:hover:bg-violet-500/20
          transition shadow-lg dark:shadow-violet-500/30
          ${
            isSelected
              ? "bg-violet-200 dark:bg-violet-900/40 border-violet-500 dark:border-violet-400"
              : ""
          }
        `}
      >
        {/* Top Row */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-300 dark:border-violet-500/70">
          <div className="flex items-center gap-2">
            {onToggleSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleSelect}
                className="w-4 h-4 cursor-pointer"
              />
            )}

            <span className="text-sm font-semibold text-gray-800 dark:text-white">
              ID: {user.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(user)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
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
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
            >
              <img
                src="/delete.png"
                alt="Delete"
                className="w-5 h-5"
              />
            </button>
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-2 text-sm">
          <div className="flex">
            <span className="font-medium text-gray-600 dark:text-gray-400 w-28 flex-shrink-0">
              First Name:
            </span>
            <span className="text-gray-800 dark:text-white">
              {user.firstName}
            </span>
          </div>

          <div className="flex">
            <span className="font-medium text-gray-600 dark:text-gray-400 w-28 flex-shrink-0">
              Middle Name:
            </span>
            <span className="text-gray-800 dark:text-white">
              {user.middleName || "-"}
            </span>
          </div>

          <div className="flex">
            <span className="font-medium text-gray-600 dark:text-gray-400 w-28 flex-shrink-0">
              Last Name:
            </span>
            <span className="text-gray-800 dark:text-white">
              {user.lastName}
            </span>
          </div>

          <div className="flex">
            <span className="font-medium text-gray-600 dark:text-gray-400 w-28 flex-shrink-0">
              Email:
            </span>
            <span className="text-gray-800 dark:text-white break-all">
              {user.email}
            </span>
          </div>

          <div className="flex">
            <span className="font-medium text-gray-600 dark:text-gray-400 w-28 flex-shrink-0">
              Phone:
            </span>
            <span className="text-gray-800 dark:text-white">
              {user.phoneNumber || "-"}
            </span>
          </div>

          <div className="flex">
            <span className="font-medium text-gray-600 dark:text-gray-400 w-28 flex-shrink-0">
              Address:
            </span>
            <span className="text-gray-800 dark:text-white flex-1">
              {user.address || "-"}
            </span>
          </div>

          <div className="flex">
            <span className="font-medium text-gray-600 dark:text-gray-400 w-28 flex-shrink-0">
              Notes:
            </span>
            <span className="text-gray-800 dark:text-white flex-1">
              {user.adminNotes || "-"}
            </span>
          </div>

          <div className="flex">
            <span className="font-medium text-gray-600 dark:text-gray-400 w-28 flex-shrink-0">
              Registered:
            </span>
            <span className="text-gray-800 dark:text-white">
              {user.registered
                ? new Date(user.registered).toLocaleDateString()
                : "-"}
            </span>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <SingleDeleteConfirmation
          onConfirm={() => {
            onDelete(user.id);
            setShowDeleteConfirm(false);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
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
        className="
          flex-1 px-4 py-2 rounded-lg
          bg-white dark:bg-gray-800
          text-gray-800 dark:text-white
          border border-gray-300 dark:border-violet-500
          focus:outline-none focus:ring-2 focus:ring-violet-500
        "
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            Sort by: {option.label}
          </option>
        ))}
      </select>

      <button
        onClick={() =>
          setOrder(order === "ASC" ? "DESC" : "ASC")
        }
        className="px-4 py-2 rounded-lg bg-violet-800 dark:bg-violet-800 text-white transition flex items-center gap-2">
        {order === "ASC" ? "▲" : "▼"}

        <span className="hidden sm:inline">
          {order === "ASC" ? "Ascending" : "Descending"}
        </span>
      </button>
    </div>
  );
}

// ---------------- BULK DELETE CONFIRMATION ----------------
function BulkDeleteConfirmation({
  count,
  onConfirm,
  onCancel,
}: {
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-violet-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Confirm Deletion
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete {count} selected
          user{count > 1 ? "s" : ""}?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="
              px-4 py-2 rounded-lg
              border border-gray-300 dark:border-gray-600
              text-gray-700 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-700
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4 py-2 rounded-lg
              bg-red-600 text-white
              hover:bg-red-700
              transition
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- TABLE ----------------
export default function UserTable({
  users,
  onEdit,
  onDelete,
  onBulkDelete,
  sort,
  order,
  setSort,
  setOrder,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(
    new Set()
  );

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds);

    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }

    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === users.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(users.map((u) => u.id)));
    }
  };

  const handleBulkDelete = () => {
    if (onBulkDelete) {
      onBulkDelete(Array.from(selectedIds));
    } else {
      selectedIds.forEach((id) => onDelete(id));
    }

    setSelectedIds(new Set());
    setShowDeleteConfirm(false);
  };

  // Empty state
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-gray-900/10 rounded-2xl border border-gray-200 dark:border-violet-700">
        <img
          src="/user_not_found.png"
          alt="No users found"
          className="w-48 h-48 mb-6 opacity-80 dark:opacity-80"
        />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          No Users Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          There are no users to display. Add a new user to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* BULK DELETE */}
      {selectedIds.size > 0 && (
        <div
          className="
            mb-4 flex items-center justify-between
            bg-gray-100/30 rounded-2xl
            px-2 py-1 border border-gray-200
            dark:border-red-700 shadow overflow-x-auto
          "
        >
          <p className="text-sm font-medium text-black dark:text-white">
            {selectedIds.size} user
            {selectedIds.size > 1 ? "s" : ""} selected
          </p>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="
              px-4 py-2 rounded-lg
              text-black dark:text-white
              transition flex items-center gap-2
            "
          >
            <img
              src="/delete.png"
              alt="Delete"
              className="w-4 h-4"
            />
            Delete
          </button>
        </div>
      )}

      {/* DESKTOP TABLE */}
      <div
        className="
          hidden lg:block
          rounded-2xl shadow overflow-x-auto
          bg-white dark:bg-gray-900
          dark:border border-violet-700
          transition-colors duration-300
        "
      >
        <table className="w-full text-sm min-w-[1100px]">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-3 dark:border-b border-violet-700">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.size === users.length &&
                    users.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="w-4 h-4 cursor-pointer"
                />
              </th>

              <SortableHeader
                label="ID"
                field="id"
                {...{ sort, order, setSort, setOrder }}
              />

              <SortableHeader
                label="First Name"
                field="firstName"
                {...{ sort, order, setSort, setOrder }}
              />

              <SortableHeader
                label="Middle Name"
                field="middleName"
                {...{ sort, order, setSort, setOrder }}
              />

              <SortableHeader
                label="Last Name"
                field="lastName"
                {...{ sort, order, setSort, setOrder }}
              />

              <SortableHeader
                label="Email"
                field="email"
                {...{ sort, order, setSort, setOrder }}
              />

              <SortableHeader
                label="Phone"
                field="phoneNumber"
                {...{ sort, order, setSort, setOrder }}
              />

              <SortableHeader
                label="Address"
                field="address"
                {...{ sort, order, setSort, setOrder }}
              />

              <SortableHeader
                label="Notes"
                field="adminNotes"
                {...{ sort, order, setSort, setOrder }}
              />

              <SortableHeader
                label="Registered"
                field="registered"
                {...{ sort, order, setSort, setOrder }}
              />

              <th className="p-3 text-gray-800 dark:text-white dark:border-b border-violet-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className={`
                  bg-stone-100
                  dark:bg-gray-900 dark:text-white
                  dark:border-b border-violet-500/40
                  hover:bg-violet-900/30
                  dark:hover:bg-violet-500/20
                  transition
                  ${
                    selectedIds.has(u.id)
                      ? "bg-violet-200 dark:bg-violet-900/40"
                      : ""
                  }
                `}
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(u.id)}
                    onChange={() => toggleSelect(u.id)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </td>

                <td className="p-3 text-gray-800 dark:text-white">
                  {u.id}
                </td>

                <td className="p-3 text-gray-800 dark:text-white">
                  {u.firstName}
                </td>

                <td className="p-3 text-gray-800 dark:text-white">
                  {u.middleName || "-"}
                </td>

                <td className="p-3 text-gray-800 dark:text-white">
                  {u.lastName}
                </td>

                <td className="p-3 text-gray-800 dark:text-white">
                  {u.email}
                </td>

                <td className="p-3 text-gray-800 dark:text-white">
                  {u.phoneNumber || "-"}
                </td>

                <td className="p-3 text-gray-800 dark:text-white">
                  {u.address || "-"}
                </td>

                <td className="p-3 text-gray-800 dark:text-white">
                  {u.adminNotes || "-"}
                </td>

                <td className="p-3 text-gray-800 dark:text-white">
                  {u.registered
                    ? new Date(
                        u.registered
                      ).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-3">
                  <ActionsMenu
                    user={u}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW */}
      <div className="lg:hidden">
        <MobileSortControls
          sort={sort}
          order={order}
          setSort={setSort}
          setOrder={setOrder}
        />

        <div className="space-y-4">
          {users.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              onEdit={onEdit}
              onDelete={onDelete}
              isSelected={selectedIds.has(u.id)}
              onToggleSelect={() => toggleSelect(u.id)}
            />
          ))}
        </div>
      </div>

      {/* BULK DELETE CONFIRM */}
      {showDeleteConfirm && (
        <BulkDeleteConfirmation
          count={selectedIds.size}
          onConfirm={handleBulkDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}