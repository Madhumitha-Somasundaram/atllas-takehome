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
  onAdd,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      
      {/* SEARCH BOX CONTAINER */}
      <div
        className="
          flex-1 w-full
          p-4 rounded-2xl shadow
          bg-stone-100 text-gray-800
          dark:bg-gray-900 dark:text-white
          dark:border-2 border-violet-500
          transition-colors duration-300
        "
      >
        <input
          className="
            w-full px-4 py-2 rounded-xl
            bg-transparent
            text-gray-800 dark:text-white
            placeholder-gray-400
            focus:outline-none
          "
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ADD BUTTON */}
      <button
        onClick={onAdd}
        className="
          px-5 py-3 rounded-xl font-medium
          bg-violet-800 text-white
          hover:bg-violet-500 transition
          dark:bg-violet-600
          dark:hover:bg-violet-400
          whitespace-nowrap
        "
      >
        + Add User
      </button>
    </div>
  );
}