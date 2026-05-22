import { useEffect, useRef, useState, useCallback } from "react";
import Head from "next/head";

import { User } from "../types/user";
import Toolbar from "../components/Toolbar";
import UserTable from "../components/UserTable";
import EditUserModal from "../components/EditUserModal";
import { userSchema, UserFormData } from "../shared/userSchema";
import {
  fetchUsers,
  deleteUserApi,
  createUserApi,
  updateUserApi,
} from "../lib/api";

type SortField = keyof User;

type HomeProps = {
  theme: "light" | "dark";
  toggleTheme: () => void;
  isGoogleMapsLoaded?: boolean;
};

export default function Home({ theme, toggleTheme }: HomeProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState<SortField>("id");
  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<"create" | "edit">("edit");

  // ---------------- FETCH USERS ----------------
  const loadUsers = useCallback(async (reset = false) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    setPage((currentPage) => {
      const pageToFetch = reset ? 1 : currentPage;

      fetchUsers(
        `page=${pageToFetch}&limit=25&search=${search}&sort=${sort}&order=${order}`
      ).then((data) => {
        const newUsers = data?.data ?? [];

        setUsers((prev) => (reset ? newUsers : [...prev, ...newUsers]));
        setHasMore(Boolean(data?.hasMore));
        setPage(pageToFetch + 1);
        setLoading(false);
        loadingRef.current = false;
      });

      return reset ? 1 : currentPage;
    });
  }, [search, sort, order]);

  // ---------------- SORT ----------------
  useEffect(() => {
    setUsers([]);
    setPage(1);
    loadUsers(true);
  }, [sort, order, loadUsers]);

  // ---------------- SEARCH ----------------
  useEffect(() => {
    const t = setTimeout(() => {
      setUsers([]);
      setPage(1);
      loadUsers(true);
    }, 300);

    return () => clearTimeout(t);
  }, [search, loadUsers]);

  // ---------------- INFINITE SCROLL ----------------
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadUsers();
      }
    });

    const el = loaderRef.current;
    if (el) obs.observe(el);

    return () => obs.disconnect();
  }, [hasMore, loading, loadUsers]);

  // ---------------- CREATE ----------------
  const addUser = () => {
    setMode("create");

    setEditingUser({
      id: 0,
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      adminNotes: "",
      registered: "",
    });

    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      adminNotes: "",
    });
  };

  // ---------------- DELETE ----------------
  const deleteUser = async (id: number) => {
    await deleteUserApi(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // ---------------- BULK DELETE ----------------
  const bulkDeleteUsers = async (ids: number[]) => {
    await Promise.all(ids.map((id) => deleteUserApi(id)));
    setUsers((prev) => prev.filter((u) => !ids.includes(u.id)));
  };

  // ---------------- EDIT ----------------
  const openEdit = (user: User) => {
    setMode("edit");
    setEditingUser(user);
    setFormData(user);
  };

  // ---------------- SAVE ----------------
  const saveUser = async () => {
  if (!editingUser) return;

  const result = userSchema.safeParse(formData);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};

    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as string;
      fieldErrors[field] = issue.message;
    });

    setErrors(fieldErrors);
    return;
  }

  setErrors({}); // clear errors if valid

  const validData: UserFormData = result.data;

  if (mode === "create") {
    const res = await createUserApi(validData);
    const data = await res.json();

    // Check for field errors from backend (e.g., duplicate email)
    if (!data.success && data.fieldErrors) {
      setErrors(data.fieldErrors);
      return;
    }

    await loadUsers(true);
    setEditingUser(null);
    return;
  }

  const res = await updateUserApi(editingUser.id, validData);
  const data = await res.json();

  // Check for field errors from backend (e.g., duplicate email)
  if (!data.success && data.fieldErrors) {
    setErrors(data.fieldErrors);
    return;
  }

  setUsers((prev) =>
    prev.map((u) => (u.id === editingUser.id ? data.data : u))
  );

  setEditingUser(null);
};

  return (
    <>
      <Head>
        <title>User Management</title>
      </Head>

      <main className="min-h-screen bg-stone-200 dark:bg-gray-900 transition-colors p-6 space-y-6">

        {/* HEADER */}
        <div className="top-2 relative flex items-center justify-center">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            User Management
          </h1>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="fixed top-2 right-2 z-50 w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center px-1 transition-colors duration-300">
            <div
              className={`absolute w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${
                theme === "dark" ? "translate-x-8" : "translate-x-0"
              }`}
            />

            <img
              src={theme === "dark" ? "/sun1.png" : "/sun.png"}
              className="w-4 h-4 absolute left-2 transition-opacity duration-300"
              alt="sun"
            />

            <img
              src="/moon.png"
              className="w-4 h-4 absolute right-2"
              alt="moon"
            />
          </button>
        </div>

        {/* TOOLBAR */}
        <Toolbar
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          order={order}
          setOrder={setOrder}
          onAdd={addUser}
        />

        {/* TABLE */}
        <UserTable
          users={users}
          onEdit={openEdit}
          onDelete={deleteUser}
          onBulkDelete={bulkDeleteUsers}
          sort={sort}
          order={order}
          setSort={setSort}
          setOrder={setOrder}
        />

        <div ref={loaderRef} className="h-10" />

        {loading && (
          <div className="text-center text-gray-500 dark:text-gray-300">
            Loading...
          </div>
        )}

        {/* MODAL */}
        {editingUser && (
          <EditUserModal
          user={editingUser}
          formData={formData}
          setFormData={setFormData}
          onClose={() => {
            setEditingUser(null);
            setErrors({});
          }}
          onSave={saveUser}
          errors={errors}
          mode={mode}
        />
        )}
      </main>
    </>
  );
}