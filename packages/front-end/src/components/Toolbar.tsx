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
    bg-stone-100 dark:bg-gray-800
    rounded-lg p-4
    border border-gray-200 dark:border-violet-500/70
    hover:bg-violet-900/30
    dark:hover:bg-violet-500/20
    transition
    
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
          px-6 py-5 rounded-xl font-medium
          border border-violet-500/70
          hover:bg-violet-500/20 transition
          dark:hover:bg-violet-400/20
          whitespace-nowrap
          shadow-lg dark:shadow-violet-500/30
        "
      >
        <img
              src="/add_user.png"
              alt="Add User"
              className="w-7 h-7"
            />
      </button>
    </div>
  );
}