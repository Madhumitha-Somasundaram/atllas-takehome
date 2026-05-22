"use client";

import { User } from "../types/user";
import React, { useEffect, useRef, useState } from "react";

import {
  PhoneInput,
} from "react-international-phone";

import "react-international-phone/style.css";

type Props = {
  user: User;
  formData: any;
  setFormData: React.Dispatch<
    React.SetStateAction<any>
  >;
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
  const wrapperRef =
    useRef<HTMLDivElement | null>(null);

  const [predictions, setPredictions] =
    useState<any[]>([]);

  const [showDropdown, setShowDropdown] =
    useState(false);

  // ✅ Disable body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // ✅ Prefill edit form
  useEffect(() => {
    if (mode === "edit" && user) {
      setFormData({
        firstName: user.firstName || "",
        middleName: user.middleName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber:
          user.phoneNumber || "",
        address: user.address || "",
        adminNotes:
          user.adminNotes || "",
      });
    }
  }, [mode, user, setFormData]);

  // ✅ Close dropdown outside click
  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node
        )
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // ✅ Google predictions
  const fetchPredictions = async (
    value: string
  ) => {
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
      console.error(
        "Google Places Error:",
        error
      );
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

    // address autocomplete
    if (field === "address") {
      await fetchPredictions(value);
    }
  };

  // ✅ Select address suggestion
  const handleSuggestionClick =
    async (suggestion: any) => {
      const placePrediction =
        suggestion.placePrediction;

      const place =
        placePrediction.toPlace();

      await place.fetchFields({
        fields: ["formattedAddress"],
      });

      const address =
        place.formattedAddress || "";

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

        {/* FIRST NAME */}
        <div className="space-y-1">
          <input
            className="w-full p-2 rounded-xl border border-gray-300 dark:border-violet-500/50 bg-white dark:bg-gray-700 text-black dark:text-white outline-none focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-700"
            placeholder="First Name"
            value={
              formData.firstName || ""
            }
            onChange={(e) =>
              handleInputChange(
                "firstName",
                e.target.value
              )
            }
          />

          {errors?.firstName && (
            <p className="text-red-500 text-sm">
              {errors.firstName}
            </p>
          )}
        </div>

        {/* MIDDLE NAME */}
        <div className="space-y-1">
          <input
            className="w-full p-2 rounded-xl border border-gray-300 dark:border-violet-500/50 bg-white dark:bg-gray-700 text-black dark:text-white outline-none focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-700"
            placeholder="Middle Name"
            value={
              formData.middleName || ""
            }
            onChange={(e) =>
              handleInputChange(
                "middleName",
                e.target.value
              )
            }
          />

          {errors?.middleName && (
            <p className="text-red-500 text-sm">
              {errors.middleName}
            </p>
          )}
        </div>

        {/* LAST NAME */}
        <div className="space-y-1">
          <input
            className="w-full p-2 rounded-xl border border-gray-300 dark:border-violet-500/50 bg-white dark:bg-gray-700 text-black dark:text-white outline-none focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-700"
            placeholder="Last Name"
            value={
              formData.lastName || ""
            }
            onChange={(e) =>
              handleInputChange(
                "lastName",
                e.target.value
              )
            }
          />

          {errors?.lastName && (
            <p className="text-red-500 text-sm">
              {errors.lastName}
            </p>
          )}
        </div>

        {/* EMAIL */}
        <div className="space-y-1">
          <input
            type="email"
            className="w-full p-2 rounded-xl border border-gray-300 dark:border-violet-500/50 bg-white dark:bg-gray-700 text-black dark:text-white outline-none focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-700"
            placeholder="Email"
            value={
              formData.email || ""
            }
            onChange={(e) =>
              handleInputChange(
                "email",
                e.target.value
              )
            }
          />

          {errors?.email && (
            <p className="text-red-500 text-sm">
              {errors.email}
            </p>
          )}
        </div>
        {/* PHONE NUMBER */}
        <div className="space-y-1">
          <PhoneInput
            defaultCountry="us"
            value={formData.phoneNumber || ""}
            onChange={(phone, meta) =>
              handleInputChange(
                "phoneNumber",
                meta.inputValue
              )
            }
            inputClassName="
              !w-full
              !p-2
              !h-auto
              !rounded-r-xl
              !border-0
              !bg-white
              dark:!bg-gray-700
              !text-black
              dark:!text-white
              !outline-none
              !shadow-none
              !text-sm
            "
            countrySelectorStyleProps={{
              buttonClassName: `
                !p-2
                !h-full
                !border-0
                !border-r
                !border-gray-300
                dark:!border-violet-500/50
                !bg-white
                dark:!bg-gray-700
                !rounded-l-xl
              `,
            }}
            className="
              !w-full
              !rounded-xl
              !border
              !border-gray-300
              dark:!border-violet-500/50
              !bg-white
              dark:!bg-gray-700
              focus-within:!border-violet-500
              focus-within:!ring-1
              focus-within:!ring-violet-700
            "
          />

          {errors?.phoneNumber && (
            <p className="text-red-500 text-sm">
              {errors.phoneNumber}
            </p>
          )}
        </div>
        

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
            value={
              formData.address || ""
            }
            onChange={(e) =>
              handleInputChange(
                "address",
                e.target.value
              )
            }
            onFocus={() => {
              if (
                predictions.length > 0
              ) {
                setShowDropdown(true);
              }
            }}
            className="w-full p-2 rounded-xl border border-gray-300 dark:border-violet-500/50 bg-white dark:bg-gray-700 text-black dark:text-white outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-700"
          />

          {/* DROPDOWN */}
          {showDropdown &&
            predictions.length > 0 && (
              <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-300 dark:border-violet-500/50 bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
                {predictions.map(
                  (
                    suggestion: any,
                    index: number
                  ) => (
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
                        suggestion
                          .placePrediction
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
        <div className="space-y-1">
          <textarea
            className="w-full p-2 rounded-xl border border-gray-300 dark:border-violet-500/50 bg-white dark:bg-gray-700 text-black dark:text-white outline-none resize-none focus:border-violet-500 focus:ring-1 focus:ring-violet-700"
            placeholder="Notes"
            rows={4}
            value={
              formData.adminNotes || ""
            }
            onChange={(e) =>
              handleInputChange(
                "adminNotes",
                e.target.value
              )
            }
          />
          {errors?.adminNotes && (
            <p className="text-red-500 text-sm">
              {errors.adminNotes}
            </p>
          )}
        </div>

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