import { User } from "../types/user";
import { Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";

type Props = {
  user: User;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
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
  const autocompleteRef =
    useRef<google.maps.places.Autocomplete | null>(null);

  const onLoad = (
    autocomplete: google.maps.places.Autocomplete
  ) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();

    setFormData((prev: any) => ({
      ...prev,
      address: place.formatted_address || "",
    }));
  };

  const handleInputChange = (
    field: string,
    value: string
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-white/50 flex items-center justify-center p-6 z-50">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl space-y-3">

        <h2 className="text-xl font-semibold text-black dark:text-white">
          {mode === "create"
            ? "Create New User"
            : `Editing User #${user.id}`}
        </h2>

        {/* NORMAL INPUTS */}
        {[
          "firstName",
          "middleName",
          "lastName",
          "email",
          "phoneNumber",
        ].map((field) => (
          <div key={field} className="space-y-1">
  <div
    className="border rounded-xl border-gray-300 dark:border-violet-500/50 bg-white dark:bg-gray-700 focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-700 transition-all duration-200">
    <input
      className="
        w-full p-2 rounded-xl
        bg-transparent
        text-black dark:text-white
        outline-none
      "
      placeholder={field}
      value={formData[field] || ""}
      onChange={(e) =>
        handleInputChange(field, e.target.value)
      }
    />
  </div>

  {errors?.[field] && (
    <p className="text-red-500 text-sm">
      {errors[field]}
    </p>
  )}
</div>
        ))}

        {/* ADDRESS AUTOCOMPLETE */}
<div className="space-y-1">
  <div
    className="
      border rounded-xl
      border-gray-300 dark:border-violet-500/50
      bg-white dark:bg-gray-700

      focus-within:border-violet-500
      focus-within:ring-1
      focus-within:ring-violet-700

      transition-all duration-200
    "
  >
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={onPlaceChanged}
    >
      <input
        className="
          w-full p-2 rounded-xl
          bg-transparent
          text-black dark:text-white
          outline-none
        "
        placeholder="Address"
        value={formData.address || ""}
        onChange={(e) =>
          handleInputChange(
            "address",
            e.target.value
          )
        }
      />
    </Autocomplete>
  </div>

  {errors?.address && (
    <p className="text-red-500 text-sm">
      {errors.address}
    </p>
  )}
</div>

{/* NOTES */}
<div
  className="
    border rounded-xl
    border-gray-300 dark:border-violet-500/50
    bg-white dark:bg-gray-700

    focus-within:border-violet-500
    focus-within:ring-1
    focus-within:ring-violet-700

    transition-all duration-200
  "
>
  <textarea
    className="
      w-full p-2 rounded-xl
      bg-transparent
      text-black dark:text-white
      outline-none
      resize-none
    "
    placeholder="Notes"
    value={formData.adminNotes || ""}
    onChange={(e) =>
      handleInputChange(
        "adminNotes",
        e.target.value
      )
    }
  />
</div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-xl border
              border-gray-300 dark:border-violet-700
              text-black dark:text-white
            "
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="
              px-4 py-2 rounded-xl
              bg-black dark:bg-violet-700
              text-white
            "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}