"use client";

import { AddressSuggestion } from "@/models/address.model";
import { searchAddress } from "@/services/address.service";
import { useEffect, useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSelect: (addr: AddressSuggestion) => void;
};

export default function AutoCompletedAddress({
  value,
  onChange,
  onSelect,
}: Props) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showList, setShowList] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (value.length >= 3 && /^[a-zA-Z0-9]/.test(value)) {
        try {
          const results = await searchAddress(value);
          setSuggestions(results);
          setError("");
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          }
        }
      } else {
        setSuggestions([]);
        if (value.length > 0) {
          setError(
            "La recherche doit commencer par une lettre ou un chiffre et contenir au moins 3 caractères."
          );
        } else {
          setError("");
        }
      }
    }, 300); // debounce

    return () => clearTimeout(timeout);
  }, [value]);

  const handleSelect = (s: AddressSuggestion) => {
    onChange(s.label);
    onSelect(s);
    setShowList(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowList(true);
        }}
        placeholder="Tapez une adresse... *"
        className="w-full border px-3 py-2 rounded"
        required
      />
      {showList && suggestions.length > 0 && (
        <ul className="absolute z-50 bg-white border w-full max-h-48 overflow-y-auto shadow-lg">
          {suggestions.map((s, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(s)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}
      {error && <div className="text-sm text-red-500">{error}</div>}
    </div>
  );
}
