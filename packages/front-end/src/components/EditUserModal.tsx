import { User } from "../types/user";

type FormData = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  adminNotes?: string;
};

type Props = {
  user: User;
  formData: FormData;
  setFormData: (v: FormData) => void;
  onClose: () => void;
  onSave: () => void;
  errors?: Record<string, string>;
  mode: "create" | "edit";
};

export default function EditUserModal({
  user,
  formData,
  setFormData,
  onClose,
  onSave,
  errors,
  mode,
}: Props) {
  const fields: (keyof FormData)[] = [
    "firstName",
    "middleName",
    "lastName",
    "email",
    "phoneNumber",
    "address",
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6">

      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white p-6 rounded-2xl shadow-xl space-y-3">

        <h2 className="text-xl font-semibold">
          {mode === "create"
            ? "Create New User"
            : `Editing User #${user.id}`}
        </h2>

        {fields.map((field) => (
          <div key={field} className="space-y-1">
            <input
              className="w-full border p-2 rounded-xl"
              placeholder={field}
              value={formData[field] || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [field]: e.target.value,
                })
              }
            />

            {errors?.[field] && (
              <p className="text-red-500 text-sm">{errors[field]}</p>
            )}
          </div>
        ))}

        <textarea
          className="w-full border p-2 rounded-xl"
          placeholder="Notes"
          value={formData.adminNotes || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              adminNotes: e.target.value,
            })
          }
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="px-4 py-2 rounded-xl bg-black text-white"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}