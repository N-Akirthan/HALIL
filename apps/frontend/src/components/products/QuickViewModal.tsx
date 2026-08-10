"use client";

import { Product } from "@/data/products";
import { X, Check } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onQuoteRequest: (productName: string) => void;
}

export function QuickViewModal({ product, isOpen, onClose, onQuoteRequest }: Props) {
  const { language, t } = useLanguage();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Réinitialise l'index de l'image sélectionnée à l'ouverture d'un nouveau produit
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product]);

  const activeProduct = useMemo(() => {
    if (!product) return null;
    return product;
  }, [product]);

  if (!isOpen || !activeProduct) return null;

  const showDetailsBox =
    activeProduct.weight ||
    activeProduct.certificate ||
    activeProduct.storage_conditions ||
    activeProduct.package ||
    activeProduct.size;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-[95vw] max-w-3xl border border-slate-100 dark:border-slate-800 overflow-hidden text-left relative transition-all duration-200 animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col transition-colors duration-300">
        
        {/* En-tête */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <span className="text-[10px] tracking-widest text-[#006680] dark:text-amber-400 font-black uppercase select-none">
            {t("catalog.quick_view")}
          </span>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 p-1 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenu principal */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-800 dark:text-slate-200">
          
          {/* Galerie d'Images */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl p-4 w-full h-[250px] md:h-[300px] flex items-center justify-center border border-slate-100 dark:border-slate-800">
              <img
                src={activeProduct.images[selectedImageIndex]}
                alt={activeProduct.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            
            {activeProduct.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-1 max-w-full">
                {activeProduct.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${activeProduct.name} ${index + 1}`}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`h-14 w-14 object-contain border rounded-xl cursor-pointer transition ${
                      selectedImageIndex === index
                        ? "border-[#ebc834] ring-2 ring-[#ebc834]"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Descriptif & Informations */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight uppercase">
                {activeProduct.name}
              </h3>
              
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 rounded-lg font-bold text-[10px] uppercase select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                {language === "fr" ? "En stock" : "Stokta var"}
              </span>

              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase select-none">
                {t("modal.category")} : <span className="text-[#006680] dark:text-amber-400">{t("category." + activeProduct.category) || activeProduct.category}</span>
              </p>

              <p className="text-sm text-slate-650 dark:text-slate-300 leading-relaxed pt-2">
                {activeProduct.description || (language === "fr" ? "Aucune description disponible pour ce produit." : "Bu ürün için açıklama bulunmamaktadır.")}
              </p>
            </div>

            {showDetailsBox && (
              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl grid grid-cols-2 gap-4 text-center select-none shadow-xs">
                {activeProduct.weight && (
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase">{language === "fr" ? "Poids" : "Ağırlık"}</span>
                    <p className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">{activeProduct.weight}</p>
                  </div>
                )}
                {activeProduct.package && (
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase">{t("modal.packaging")}</span>
                    <p className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">{activeProduct.package}</p>
                  </div>
                )}
                {activeProduct.storage_conditions && (
                  <div className="col-span-2 border-t border-slate-200/50 dark:border-slate-800/80 pt-2">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{language === "fr" ? "Conservation" : "Saklama Koşulları"}</span>
                    <p className="font-bold text-slate-700 dark:text-slate-300 text-xs">{activeProduct.storage_conditions}</p>
                  </div>
                )}
              </div>
            )}

            {/* Actions rapides */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  onQuoteRequest(activeProduct.name);
                  onClose();
                }}
                className="flex-1 bg-[#ebc834] hover:bg-[#dfca70] dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-slate-950 text-slate-900 font-black text-xs uppercase tracking-wider py-3 px-4 rounded-xl shadow-xs transition cursor-pointer text-center"
              >
                {t("modal.quote_title")}
              </button>
              <a
                href={`/products/${activeProduct.slug}`}
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition cursor-pointer text-center flex-1"
              >
                {language === "fr" ? "Fiche produit" : "Ürün Detayı"}
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
