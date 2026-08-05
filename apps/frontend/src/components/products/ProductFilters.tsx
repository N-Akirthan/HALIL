"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  brands: string[];
  selectedBrand: string | null;
  onBrandChange: (brand: string | null) => void;
  categoryCounts?: Record<string, number>;
}

export function ProductFilters({
  categories,
  selectedCategories,
  onCategoryChange,
  brands,
  selectedBrand,
  onBrandChange,
  categoryCounts = {},
}: Props) {
  const { language, t } = useLanguage();
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  return (
    <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm space-y-6 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-left select-none transition-colors duration-300">
      
      {/* Catégories */}
      <div>
        <h2 className="text-xs font-black text-slate-900 dark:text-white mb-4 tracking-wider uppercase border-b border-slate-100 dark:border-slate-800 pb-2">
          {t("catalog.filters_categories")}
        </h2>

        {/* Version Desktop : cases à cocher premium alignées verticalement */}
        <div className="hidden md:flex flex-col gap-3">
          {categories.map((cat) => {
            const isChecked = selectedCategories.includes(cat);
            const count = categoryCounts[cat] || 0;
            return (
              <label 
                key={cat} 
                className="flex items-center gap-3 cursor-pointer group text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-350 hover:text-[#006680] dark:hover:text-amber-400 transition-colors"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(cat)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${
                    isChecked 
                      ? "bg-[#006680] border-[#006680] text-white shadow-xs" 
                      : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 group-hover:border-slate-400 dark:group-hover:border-slate-500"
                  }`}>
                    {isChecked && <Check size={12} strokeWidth={4} />}
                  </div>
                </div>
                <span>{t("category." + cat) || cat}</span>
                <span className="ml-auto text-[10px] text-slate-400 dark:text-slate-500 font-bold font-mono group-hover:text-slate-500 transition-colors">
                  ({count})
                </span>
              </label>
            );
          })}
        </div>

        {/* Version Mobile : menu déroulant sur mesure */}
        <div className="md:hidden relative">
          <button
            type="button"
            onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
            className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-left bg-white dark:bg-slate-800 text-xs font-bold text-slate-850 dark:text-slate-200 flex justify-between items-center cursor-pointer shadow-xs uppercase tracking-wider"
          >
            <span>
              {selectedCategories.length > 0
                ? `${selectedCategories.length} ${t("catalog.filters_selected")}`
                : t("catalog.filters_all_categories")}
            </span>
            {mobileDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {mobileDropdownOpen && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl p-4 z-30 max-h-60 overflow-y-auto space-y-3">
              {categories.map((cat) => {
                const isChecked = selectedCategories.includes(cat);
                const count = categoryCounts[cat] || 0;
                return (
                  <label 
                    key={cat} 
                    className="flex items-center gap-3 cursor-pointer text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 select-none hover:text-[#006680] dark:hover:text-amber-400 transition"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCategory(cat)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${
                        isChecked 
                          ? "bg-[#006680] border-[#006680] text-white" 
                          : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      }`}>
                        {isChecked && <Check size={12} strokeWidth={4} />}
                      </div>
                    </div>
                    <span>{t("category." + cat) || cat}</span>
                    <span className="ml-auto text-[10px] text-slate-400 dark:text-slate-500 font-bold font-mono">
                      ({count})
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Marques */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
        <h2 className="text-xs font-black text-slate-900 dark:text-white mb-4 tracking-wider uppercase pb-1">
          {t("catalog.filters_brands")}
        </h2>
        <select
          className="w-full p-3 border border-slate-250 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ebc834] cursor-pointer shadow-xs"
          value={selectedBrand ?? ""}
          onChange={(e) => onBrandChange(e.target.value || null)}
        >
          <option value="">{language === "fr" ? "Toutes les marques" : "Tüm Markalar"}</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Réinitialiser les filtres */}
      <button
        type="button"
        onClick={() => {
          onCategoryChange([]);
          onBrandChange(null);
          setMobileDropdownOpen(false);
        }}
        className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-colors duration-200 cursor-pointer text-center"
      >
        {language === "fr" ? "Réinitialiser" : "Sıfırla"}
      </button>
    </div>
  );
}
