import { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  products: Product[];
  onQuickView: (product: Product) => void;
}

const categoryOrder = [
  "Frites et Appetiziers",
  "Sauces",
  "Viandes",
  "Volailles",
  "Tortillas et Pains",
  "Desserts",
  "Emballages",
  "Produits Laitiers",
  "Huile",
  "Conserves",
  "Autres",
];

export function ProductList({ products, onQuickView }: Props) {
  const { t } = useLanguage();

  if (products.length === 0) {
    return (
      <div className="text-center text-slate-500 py-20 text-lg font-medium bg-white rounded-3xl border border-slate-100 shadow-sm">
        {t("catalog.no_products")}
      </div>
    );
  }

  // Regrouper les produits par catégorie
  const grouped: Record<string, Product[]> = {};
  for (const product of products) {
    if (!grouped[product.category]) {
      grouped[product.category] = [];
    }
    grouped[product.category].push(product);
  }

  // Trier les catégories selon l'ordre défini
  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    const idxA = categoryOrder.indexOf(a);
    const idxB = categoryOrder.indexOf(b);
    const finalIdxA = idxA === -1 ? categoryOrder.length : idxA;
    const finalIdxB = idxB === -1 ? categoryOrder.length : idxB;
    return finalIdxA - finalIdxB;
  });

  return (
    <div className="space-y-12 text-left">
      {sortedCategories.map((category) => {
        const categoryProducts = grouped[category];
        return (
          <div key={category} className="space-y-4 animate-in fade-in duration-300">
            {/* En-tête de la section catégorie */}
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest border-l-4 border-[#ebc834] pl-3 flex items-center gap-2 select-none">
              <span>{t("category." + category) || category}</span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 lowercase tracking-normal">
                ({categoryProducts.length} {categoryProducts.length === 1 ? t("catalog.stats_badge_single") : t("catalog.stats_badge_plural")})
              </span>
            </h3>

            {/* Grille de la catégorie */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 items-stretch">
              {categoryProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onQuickView={onQuickView}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
