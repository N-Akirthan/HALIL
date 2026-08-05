"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateUser } from "@/services/user.service";
import { useState } from "react";

type Props = {
  userId: number;
  onPasswordChanged: () => void;
};

export default function UpdatePasswordDialog({
  userId,
  onPasswordChanged,
}: Props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // état pour contrôler le dialog

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Le nouveau mot de passe et la confirmation ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      await updateUser(userId, { password: newPassword });
      onPasswordChanged();
      setNewPassword("");
      setConfirmPassword("");
      alert("Mot de passe modifié avec succès !");
      setOpen(false); // ferme le dialog directement
    } catch (err) {
      if (err instanceof Error) alert("Erreur : " + err.message);
      else alert("Erreur inconnue lors de la mise à jour du mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="flex items-center px-4 py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
        asChild
      >
        <span
          role="button"
          tabIndex={0}
          className="text-blue-600 text-sm cursor-pointer hover:underline"
        >
          Changer mot de passe
        </span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le mot de passe</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Nouveau mot de passe *
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Confirmer le nouveau mot de passe *
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </label>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#ebc334] text-white rounded hover:bg-[#dfca70] cursor-pointer disabled:opacity-50"
            >
              {loading ? "En cours..." : "Changer le mot de passe"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
