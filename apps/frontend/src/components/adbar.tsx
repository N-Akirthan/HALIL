"use client";
import { Truck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdBar() {
  const { t } = useLanguage();
  return (
    <div className="flex justify-center items-center gap-2 bg-[#264f36] text-white py-1 font-bold text-sm select-none">
      <Truck size={16} />
      <span>{t("adbar.delivery")}</span>
    </div>
  );
}
