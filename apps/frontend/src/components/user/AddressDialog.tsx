"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

type Props = {
  address: string;
};

export default function AddressDialog({ address }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // revient au clip après 2s
    } catch (err) {
      console.error("Erreur lors de la copie :", err);
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
          Domicile
        </span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adresse</DialogTitle>
        </DialogHeader>

        <div className="mt-4 flex items-center border rounded bg-gray-50">
          <span className="flex-1 px-3 py-2 text-gray-800 text-sm truncate">
            {address}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="mr-1"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
