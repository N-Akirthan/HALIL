"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddressSuggestion } from "@/models/address.model";
import { Client } from "@/models/client.model";
import { SendClient } from "@/payload/request/send-client";
import { updateClient } from "@/services/client.service";
import { useEffect, useState } from "react";
import AutoCompletedAddress from "../address/AutoCompletedAddress";

type Props = {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientUpdated?: () => void;
};

export default function UpdateClientDialog({
  client,
  open,
  onOpenChange,
  onClientUpdated,
}: Props) {
  const [formData, setFormData] = useState<SendClient>({
    name: client.name || "",
    address: client.address || "",
    email: client.email || "",
    phone: client.phone || "",
    phone2: client.phone2 || "",
    landline_phone: client.landline_phone || "",
    manager: client.manager || "",
    main_contact: client.main_contact || "",
    accountant: client.accountant || "",
    accountant_phone: client.accountant_phone || "",
    commercial: client.commercial || "",
    note: client.note || "",
    open: client.isOpen ?? true,
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: client.name || "",
        address: client.address || "",
        email: client.email || "",
        phone: client.phone || "",
        phone2: client.phone2 || "",
        landline_phone: client.landline_phone || "",
        manager: client.manager || "",
        main_contact: client.main_contact || "",
        accountant: client.accountant || "",
        accountant_phone: client.accountant_phone || "",
        commercial: client.commercial || "",
        note: client.note || "",
        open: client.isOpen ?? true,
      });
    }
  }, [client, open]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "select-one" && (value === "true" || value === "false")) {
      setFormData((prev) => ({ ...prev, [name]: value === "true" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAdresseSelect = (addr: AddressSuggestion) => {
    setFormData((prev) => ({
      ...prev,
      address: addr.label,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateClient(client.id, formData);
      onOpenChange(false);
      if (onClientUpdated) onClientUpdated();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Erreur : " + err.message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le client</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Nom *"
            className="w-full border px-3 py-2 rounded"
          />

          <AutoCompletedAddress
            value={formData.address}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, address: val }))
            }
            onSelect={handleAdresseSelect}
          />

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Téléphone"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            name="phone2"
            value={formData.phone2}
            onChange={handleChange}
            placeholder="Téléphone 2"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            name="landline_phone"
            value={formData.landline_phone}
            onChange={handleChange}
            placeholder="Téléphone Fixe"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            name="manager"
            value={formData.manager}
            onChange={handleChange}
            placeholder="Gérant"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            name="main_contact"
            value={formData.main_contact}
            onChange={handleChange}
            placeholder="Contact principal"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            name="accountant"
            value={formData.accountant}
            onChange={handleChange}
            placeholder="Comptable"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            name="accountant_phone"
            value={formData.accountant_phone}
            onChange={handleChange}
            placeholder="Téléphone comptable"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            name="commercial"
            value={formData.commercial}
            onChange={handleChange}
            placeholder="Commercial"
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Note"
            className="w-full border px-3 py-2 rounded resize-y"
            rows={4}
          />

          <div className="flex items-center">
            <label className="text-sm font-medium w-32">Client ouvert:</label>
            <select
              name="open"
              value={formData.open ? "true" : "false"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  open: e.target.value == "true",
                }))
              }
              className="border px-3 py-2 rounded"
            >
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#ebc834] text-white rounded hover:bg-[#dfca70] cursor-pointer"
            >
              Mettre à jour
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
