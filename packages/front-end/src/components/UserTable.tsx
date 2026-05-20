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

// ---------------- SORTABLE HEADER ----------------
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
      onClick={handleClick}
      className={`
        p-3 cursor-pointer select-none
        text-gray-800 dark:text-white
        border-b dark:border-violet-600
        transition
        ${active ? "font-semibold" : ""}
      `}
    >
      <div className="flex items-center gap-1">
        {label}
        {active && (
          <span className="text-xs text-violet-600 dark:text-violet-400">
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
    <div className="rounded-2xl shadow overflow-x-auto bg-white dark:bg-gray-900 transition-colors">
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

            <th className="p-3 text-gray-800 dark:text-white border-b dark:border-violet-600">
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
                dark:bg-gray-900 dark:text-white
                hover:bg-violet-900/20 dark:hover:bg-violet-500/10
                transition
              "
            >
              <td className="p-3">{u.id}</td>
              <td className="p-3">{u.firstName}</td>
              <td className="p-3">{u.middleName || "-"}</td>
              <td className="p-3">{u.lastName}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.phoneNumber || "-"}</td>
              <td className="p-3">{u.address || "-"}</td>
              <td className="p-3">{u.adminNotes || "-"}</td>
              <td className="p-3">
                {u.registered ? new Date(u.registered).toLocaleDateString() : "-"}
              </td>

              <td className="p-3 flex gap-2">
                <button
                  onClick={() => onEdit(u)}
                  className="px-3 py-1 bg-violet-700 hover:bg-violet-500 text-white rounded-lg transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(u.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-400 text-white rounded-lg transition"
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