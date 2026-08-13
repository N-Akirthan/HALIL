import { Product } from "@/data/products";
import Link from "next/link";
import { Fragment } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  product: Product;
  onQuickView: (product: Product) => void;
}

const getCutSizeBadge = (name: string): string | null => {
  if (/6\s*\/\s*6/i.test(name)) return "6/6";
  if (/9\s*\/\s*9/i.test(name)) return "9/9";
  if (/10\s*\/\s*10/i.test(name)) return "10/10";
  if (/12\s*\/\s*12/i.test(name)) return "12/12";
  return null;
};

export function ProductCard({ product, onQuickView }: Props) {
  const { language, t } = useLanguage();
  const cutSize = getCutSizeBadge(product.name);

  return (
    <Link href={`/products/${product.slug}`} className="block h-full">
      <div className="group bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-1.5 sm:p-4 border border-slate-100 dark:border-slate-800 hover:border-amber-355 dark:hover:border-amber-500 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between items-center w-full h-full relative overflow-hidden text-center">
        
        {/* Catégorie */}
        <span className="text-[7.5px] sm:text-[10px] tracking-tight sm:tracking-widest text-[#006680] dark:text-amber-400 font-black uppercase mb-1.5 sm:mb-3 px-1 sm:px-2.5 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800 select-none max-w-full truncate">
          {t("category." + product.category) || product.category}
        </span>

        {/* Zone image + Aperçu rapide au survol */}
        <div className="relative bg-slate-50/30 dark:bg-slate-950/40 rounded-lg sm:rounded-xl w-full p-1 sm:p-4 flex items-center justify-center h-[110px] sm:h-[180px] md:h-[220px] overflow-hidden border border-gray-50/50 dark:border-slate-800 group/image">
          <img
            src={product.images[0]}
            alt={product.name}
            className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />

          {/* Pastille 6/6 ou 9/9 en bas à droite de l'image */}
          {cutSize && (
            <div className="absolute bottom-1 right-1 sm:bottom-2.5 sm:right-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-1 py-0.2 sm:px-2.5 sm:py-0.5 shadow-md z-10 pointer-events-none select-none">
              <span className="font-extrabold italic text-slate-900 dark:text-slate-100 text-[8px] sm:text-xs tracking-tight font-serif">
                {cutSize}
              </span>
            </div>
          )}
          
          {/* Overlay avec bouton Aperçu rapide */}
          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover/image:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-xs">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-extrabold text-[8px] sm:text-[9px] tracking-wider uppercase px-2 py-1.5 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl shadow-md transform scale-90 group-hover/image:scale-100 transition-all duration-300 cursor-pointer border border-slate-150 dark:border-slate-700"
            >
              {t("catalog.quick_view")}
            </button>
          </div>
        </div>

        {/* Titre produit */}
        <h2 className="text-slate-800 dark:text-slate-100 mt-2 sm:mt-4 text-[9.5px] sm:text-xs xl:text-sm font-extrabold text-center leading-tight uppercase px-0.5 min-h-[2rem] sm:min-h-[2.5rem] group-hover:text-[#006680] dark:group-hover:text-amber-400 transition-colors">
          {product.name.split("\n").map((line, index) => (
            <Fragment key={index}>
              {line}
              <br />
            </Fragment>
          ))}
        </h2>

        {/* Découvrir */}
        <div className="mt-1.5 sm:mt-3 text-[8px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 group-hover:text-[#ebc834] dark:group-hover:text-amber-400 transition-colors uppercase tracking-widest flex items-center gap-1">
          <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
        </div>

      </div>
    </Link>
  );
}
