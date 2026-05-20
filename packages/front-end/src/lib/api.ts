const BASE_URL = "http://127.0.0.1:50000/users";

export const fetchUsers = async (params: string) => {
  const res = await fetch(`${BASE_URL}?${params}`);
  return res.json();
};

export const deleteUserApi = (id: number) =>
  fetch(`${BASE_URL}/${id}`, { method: "DELETE" });

export const createUserApi = (data: any) =>
  fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updateUserApi = (id: number, data: any) =>
  fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });