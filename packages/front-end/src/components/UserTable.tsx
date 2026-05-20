import { User } from "../types/user";

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

              <td className="p-3 flex gap-2">
                  <button
                    onClick={() => onEdit(u)}
                    className="px-3 py-1 bg-violet-800 hover:bg-violet-500 transition text-white rounded-lg dark:bg-violet-600 dark:hover:bg-violet-400"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(u.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-400 transition text-white rounded-lg"
                  >
                    Delete
                  </button>
                </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}