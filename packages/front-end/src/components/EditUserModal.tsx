"use client";

import { User } from "../types/user";
import { useEffect, useRef, useState } from "react";

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
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [predictions, setPredictions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ Prefill
  useEffect(() => {
    if (mode === "edit" && user) {
      setFormData({
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        adminNotes: user.adminNotes || "",
      });
    }
  }, [mode, user, setFormData]);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // ✅ Fetch Google suggestions
  const fetchPredictions = async (value: string) => {
    if (!value.trim()) {
      setPredictions([]);
      return;
    }

    try {
      //@ts-ignore
      const { suggestions } =
        await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
          {
            input: value,
          }
        );

      setPredictions(suggestions || []);
      setShowDropdown(true);
    } catch (error) {
      console.error("Google Places Error:", error);
    }
  };

  const handleInputChange = async (
    field: string,
    value: string
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));

    // address typing
    if (field === "address") {
      await fetchPredictions(value);
    }
  };

  // ✅ Click suggestion
  const handleSuggestionClick = async (suggestion: any) => {
    const placePrediction = suggestion.placePrediction;

    const place = placePrediction.toPlace();

    await place.fetchFields({
      fields: ["formattedAddress"],
    });

    const address = place.formattedAddress || "";

    setFormData((prev: any) => ({
      ...prev,
      address,
    }));

    setPredictions([]);
    setShowDropdown(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-white/50 flex items-center justify-center p-6 z-50">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl space-y-4">

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-black dark:text-white">
          {mode === "create"
            ? "Create New User"
            : `Editing User #${user.id}`}
        </h2>

        {/* OTHER INPUTS */}
        {[
          "firstName",
          "middleName",
          "lastName",
          "email",
          "phoneNumber",
        ].map((field) => (
          <div key={field} className="space-y-1">
            <input
              className="w-full p-2 rounded-xl border border-gray-300 dark:border-violet-500/50 bg-white dark:bg-gray-700 text-black dark:text-white outline-none"
              placeholder={field}
              value={formData[field] || ""}
              onChange={(e) =>
                handleInputChange(
                  field,
                  e.target.value
                )
              }
            />

            {errors?.[field] && (
              <p className="text-red-500 text-sm">
                {errors[field]}
              </p>
            )}
          </div>
        ))}

        {/* ADDRESS */}
        <div
          ref={wrapperRef}
          className="space-y-1 relative"
        >
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Address
          </label>

          <input
            type="text"
            placeholder="Enter address"
            value={formData.address || ""}
            onChange={(e) =>
              handleInputChange(
                "address",
                e.target.value
              )
            }
            onFocus={() => {
              if (predictions.length > 0) {
                setShowDropdown(true);
              }
            }}
            className="w-full p-2 rounded-xl border border-gray-300 dark:border-violet-500/50 bg-white dark:bg-gray-700 text-black dark:text-white outline-none"
          />

          {/* DROPDOWN */}
          {showDropdown && predictions.length > 0 && (
            <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-300 dark:border-violet-500/50 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">

              {predictions.map(
                (suggestion: any, index: number) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      handleSuggestionClick(
                        suggestion
                      )
                    }
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-black dark:text-white"
                  >
                    {
                      suggestion.placePrediction
                        ?.text?.text
                    }
                  </button>
                )
              )}
            </div>
          )}

          {errors?.address && (
            <p className="text-red-500 text-sm">
              {errors.address}
            </p>
          )}
        </div>

        {/* NOTES */}
        <textarea
          className="w-full p-2 rounded-xl border border-gray-300 dark:border-violet-500/50 bg-white dark:bg-gray-700 text-black dark:text-white outline-none resize-none"
          placeholder="Notes"
          value={formData.adminNotes || ""}
          onChange={(e) =>
            handleInputChange(
              "adminNotes",
              e.target.value
            )
          }
        />

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-violet-700 text-black dark:text-white"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="px-4 py-2 rounded-xl bg-black dark:bg-violet-700 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}