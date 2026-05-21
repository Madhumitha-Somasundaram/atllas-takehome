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
    <div className="flex flex-row gap-4 items-center">

      {/* SEARCH BOX CONTAINER */}
      <div
        className="
          flex-1
          bg-stone-100 dark:bg-gray-800
          rounded-2xl
          px-4 py-3
          border border-gray-200 dark:border-violet-700
          hover:bg-violet-900/10
          dark:hover:bg-violet-500/10
          transition
          
          focus-within:border-violet-500
          focus-within:ring-1
          focus-within:ring-violet-700
        "
      >
        <input
          className="
            w-full px-2 py-1
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

      {/* ADD BUTTON */}
      <button
        onClick={onAdd}
        className="
          h-[56px]
          w-[56px]

          flex items-center justify-center

          rounded-2xl
          border-2 border-violet-700 dark:border dark:border-violet-700
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
  );
}