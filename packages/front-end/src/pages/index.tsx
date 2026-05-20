import { useEffect, useRef, useState } from "react";
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

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState<SortField>("id");
  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mode, setMode] = useState<"create" | "edit">("edit");

  // ---------------- FETCH USERS ----------------
  const loadUsers = async (reset = false) => {
    if (loading) return;
    setLoading(true);

    const currentPage = reset ? 1 : page;

    const data = await fetchUsers(
      `page=${currentPage}&limit=25&search=${search}&sort=${sort}&order=${order}`
    );

    const newUsers = data?.data ?? [];

    setUsers((prev) => (reset ? newUsers : [...prev, ...newUsers]));
    setHasMore(Boolean(data?.hasMore));
    setPage(currentPage + 1);

    setLoading(false);
  };

  // ---------------- SORT ----------------
  useEffect(() => {
    setUsers([]);
    setPage(1);
    loadUsers(true);
  }, [sort, order]);

  // ---------------- SEARCH ----------------
  useEffect(() => {
    const t = setTimeout(() => {
      setUsers([]);
      setPage(1);
      loadUsers(true);
    }, 300);

    return () => clearTimeout(t);
  }, [search]);

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
  }, [hasMore, loading]);

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

    setErrors({});

    const validData: UserFormData = result.data;

    if (mode === "create") {
      await createUserApi(validData);
      await loadUsers(true);
      setEditingUser(null);
      return;
    }

    const res = await updateUserApi(editingUser.id, validData);
    const data = await res.json();

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
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            User Management
          </h1>
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