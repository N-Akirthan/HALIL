"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddressSuggestion } from "@/models/address.model";
import { SendClient } from "@/payload/request/send-client";
import { createClient } from "@/services/client.service";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import AutoCompletedAddress from "../address/AutoCompletedAddress";

type Props = {
  onClientCreated: () => void;
};

export default function CreateClientDialog({ onClientCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<SendClient>({
    name: "",
    address: "",
    email: "",
    phone: "",
    phone2: "",
    landline_phone: "",
    manager: "",
    main_contact: "",
    accountant: "",
    accountant_phone: "",
    commercial: "",
    note: "",
    open: true,
    color: "#000000",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdresseSelect = (addr: AddressSuggestion) => {
    setFormData((prev) => ({
      ...prev,
      address: addr.label,
      lat: addr.lat,
      lon: addr.lon,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.address.trim()) {
      alert("Le nom et l'adresse sont obligatoires");
      return;
    }

    try {
      await createClient(formData);
      setFormData({
        name: "",
        address: "",
        email: "",
        phone: "",
        phone2: "",
        landline_phone: "",
        manager: "",
        main_contact: "",
        accountant: "",
        accountant_phone: "",
        commercial: "",
        note: "",
        open: true,
        color: "#000000",
      });
      setOpen(false);
      onClientCreated();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert("Erreur : " + err.message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center text-sm font-medium px-4 py-2 hover:text-[#dfca70] cursor-pointer">
          <UserPlus />
          Nouveau client
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un client</DialogTitle>
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

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Client ouvert:</label>
            <select
              name="open"
              value={formData.open ? "true" : "false"}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  open: e.target.value === "true",
                }))
              }
              className="border px-3 py-2 rounded"
            >
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Couleur</span>

            <div className="flex items-center gap-3">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, color: e.target.value }))
                }
                className="h-10 w-20 p-1 cursor-pointer border rounded"
              />

              <div className="flex gap-2">
                {["#EF4444", "#ffda6e", "#9dfc71"].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, color: preset }))
                    }
                    className="h-8 w-8 rounded-full border shadow-sm transition hover:scale-110"
                    style={{
                      backgroundColor: preset,
                      borderColor: "#d1d5db",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 bg-[#ebc834] text-white rounded hover:bg-[#dfca70] cursor-pointer"
            >
              Créer
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
