import { User } from "../types/user";

export type SortField = keyof User;

type Props = {
  search: string;
  setSearch: (v: string) => void;

  sort: SortField;
  setSort: (v: SortField) => void;

  order: "ASC" | "DESC";
  setOrder: (v: "ASC" | "DESC") => void;

  onAdd: () => void;
};

export default function Toolbar({
  search,
  setSearch,
  sort,
  setSort,
  order,
  setOrder,
  onAdd,
}: Props) {
  const sortOptions: { value: string; label: string; field: SortField; order: "ASC" | "DESC" }[] = [
    { value: "id-desc", label: "Newest First", field: "id", order: "DESC" },
    { value: "id-asc", label: "Oldest First", field: "id", order: "ASC" },
    { value: "firstName-asc", label: "First Name (A→Z)", field: "firstName", order: "ASC" },
    { value: "firstName-desc", label: "First Name (Z→A)", field: "firstName", order: "DESC" },
    { value: "lastName-asc", label: "Last Name (A→Z)", field: "lastName", order: "ASC" },
    { value: "lastName-desc", label: "Last Name (Z→A)", field: "lastName", order: "DESC" },
    { value: "email-asc", label: "Email (A→Z)", field: "email", order: "ASC" },
    { value: "email-desc", label: "Email (Z→A)", field: "email", order: "DESC" },
    { value: "phoneNumber-asc", label: "Phone (A→Z)", field: "phoneNumber", order: "ASC" },
    { value: "phoneNumber-desc", label: "Phone (Z→A)", field: "phoneNumber", order: "DESC" },
    { value: "address-asc", label: "Address (A→Z)", field: "address", order: "ASC" },
    { value: "address-desc", label: "Address (Z→A)", field: "address", order: "DESC" },
    { value: "registered-desc", label: "Registration (Newest)", field: "registered", order: "DESC" },
    { value: "registered-asc", label: "Registration (Oldest)", field: "registered", order: "ASC" },
  ];

  const currentValue = `${sort}-${order.toLowerCase()}`;

  const handleSortChange = (value: string) => {
    const option = sortOptions.find((opt) => opt.value === value);
    if (option) {
      setSort(option.field);
      setOrder(option.order);
    }
  };

  return (
    <div className="space-y-3">
      {/* DESKTOP: Search Bar + Add Button Row */}
      <div className="hidden lg:flex gap-3 items-stretch">
        <div
          className="
            flex-1
            bg-stone-100 dark:bg-gray-800
            rounded-2xl
            px-4
            border border-gray-200 dark:border-violet-700
            hover:bg-violet-900/10
            dark:hover:bg-violet-500/10
            transition

            focus-within:border-violet-500
            focus-within:ring-1
            focus-within:ring-violet-700

            flex items-center
            h-[50px]
          "
        >
          <input
            className="
              w-full
              bg-transparent
              text-gray-800 dark:text-white
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none
            "
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={onAdd}
          className="
            h-[50px]
            w-[50px]

            flex items-center justify-center

            rounded-2xl
            border-2 border-violet-700 dark:border-violet-700
            hover:bg-violet-500/20

            dark:hover:bg-violet-400/20

            transition
            shadow-lg dark:shadow-violet-500/30

            shrink-0
          "
        >
          <img
            src="/add_user.png"
            alt="Add User"
            className="w-5 h-5"
          />
        </button>
      </div>

      {/* MOBILE: Search Bar (Full Width) */}
      <div
        className="
          lg:hidden
          w-full
          bg-stone-100 dark:bg-gray-800
          rounded-2xl
          px-4
          border border-gray-200 dark:border-violet-700
          hover:bg-violet-900/10
          dark:hover:bg-violet-500/10
          transition

          focus-within:border-violet-500
          focus-within:ring-1
          focus-within:ring-violet-700

          flex items-center
          h-[50px]
        "
      >
        <input
          className="
            w-full
            bg-transparent
            text-gray-800 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none
          "
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* MOBILE ONLY: Sort + Add Button Row */}
      <div className="flex lg:hidden gap-3 items-stretch">
        <select
          value={currentValue}
          onChange={(e) => handleSortChange(e.target.value)}
          className="
            flex-1 px-4 h-[50px] rounded-2xl
            bg-stone-100 dark:bg-gray-800
            text-gray-800 dark:text-white
            border border-gray-200 dark:border-violet-700
            focus:outline-none focus:ring-1 focus:ring-violet-700
            hover:bg-violet-900/10 dark:hover:bg-violet-500/10
            transition
          "
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          onClick={onAdd}
          className="
            h-[50px]
            w-[50px]

            flex items-center justify-center

            rounded-2xl
            border-2 border-violet-700 dark:border-violet-700
            hover:bg-violet-500/20

            dark:hover:bg-violet-400/20

            transition
            shadow-lg dark:shadow-violet-500/30

            shrink-0
          "
        >
          <img
            src="/add_user.png"
            alt="Add User"
            className="w-5 h-5"
          />
        </button>
      </div>
    </div>
  );
}