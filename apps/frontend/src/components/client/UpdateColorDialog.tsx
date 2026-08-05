"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Client } from "@/models/client.model";
import { SendClient } from "@/payload/request/send-client";
import { updateClient } from "@/services/client.service";
import { Palette } from "lucide-react";
import { useState } from "react";

type Props = {
  client: Client;
  onUpdated?: (client: Client) => void;
};

export default function UpdateColorDialog({ client, onUpdated }: Props) {
  const [open, setOpen] = useState(false);

  // Couleur choisie dans l'input principal
  const [color, setColor] = useState(client.color || "#000000");

  // Les couleurs fixes des pastilles : rouge, jaune, vert
  const presetColors = ["#EF4444", "#ffda6e", "#9dfc71"];

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const updated = await updateClient(client.id, {
        ...client,
        color,
      } as SendClient);
      onUpdated?.(updated);
      setOpen(false);
    } catch (err) {
      console.error("Erreur update client", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-[#dfca70] p-2">
          <Palette />
          <span className="text-xs">Changer la couleur</span>
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Changer la couleur du marker</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {/* Input + pastilles alignées */}
          <label className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Couleur</span>
            <div className="flex items-center gap-3">
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-20 p-1 cursor-pointer"
              />

              <div className="flex gap-2">
                {presetColors.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setColor(preset)}
                    className="h-8 w-8 rounded-full border shadow-sm transition hover:scale-110"
                    style={{
                      backgroundColor: preset,
                      borderColor: "#d1d5db",
                    }}
                  />
                ))}
              </div>
            </div>
          </label>
        </div>

        <DialogFooter>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-[#ebc834] text-white rounded hover:bg-[#dfca70] cursor-pointer disabled:opacity-60"
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
