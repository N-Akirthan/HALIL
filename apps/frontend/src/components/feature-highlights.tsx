"use client";

import { Boxes, CreditCard, Phone, Truck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function FeatureHighlights() {
  const { t } = useLanguage();
  return (
    <section className="bg-[#ebc834] dark:bg-slate-900 border border-transparent dark:border-slate-800 py-12 w-full rounded-lg transition-colors duration-300">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-8 text-slate-950 dark:text-slate-100 text-center w-full px-4 md:px-20">
        <div className="flex flex-col items-center space-y-4">
          <Truck strokeWidth={1.5} className="text-slate-950 dark:text-amber-400 size-15 md:size-20" />
          <h3 className="text-md md:text-xl font-bold">{t("hl.delivery_title")}</h3>
          <p className="text-xs md:text-sm text-slate-850 dark:text-slate-300">{t("hl.delivery_desc")}</p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <Boxes strokeWidth={1.5} className="text-slate-950 dark:text-amber-400 size-15 md:size-20" />
          <h3 className="text-md md:text-xl font-bold">{t("hl.stock_title")}</h3>
          <p className="text-xs md:text-sm text-slate-850 dark:text-slate-300">{t("hl.stock_desc")}</p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <Phone strokeWidth={1.5} className="text-slate-950 dark:text-amber-400 size-15 md:size-20" />
          <h3 className="text-md md:text-xl font-bold">{t("hl.service_title")}</h3>
          <p className="text-xs md:text-sm text-slate-850 dark:text-slate-300">{t("hl.service_desc")}</p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <CreditCard
            strokeWidth={1.5}
            className="text-slate-950 dark:text-amber-400 size-15 md:size-20"
          />
          <h3 className="text-md md:text-xl font-bold">{t("hl.payment_title")}</h3>
          <p className="text-xs md:text-sm text-slate-850 dark:text-slate-300">{t("hl.payment_desc")}</p>
        </div>
      </div>
    </section>
  );
}
