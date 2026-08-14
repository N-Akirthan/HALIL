"use client";

import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductList } from "@/components/products/ProductList";
import { QuoteRequestModal } from "@/components/products/QuoteRequestModal";
import { QuickViewModal } from "@/components/products/QuickViewModal";
import { Product, products } from "@/data/products";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translateProduct } from "@/utils/productTranslator";

import AdBar from "@/components/adbar";
import { Footer } from "@/components/footer-section";
import { Navbar } from "@/components/navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSearchParams } from "next/navigation";

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

function extractCategories(selectedBrand: string | null) {
  const categorySet = new Set<string>();
  const filtered = selectedBrand
    ? products.filter((p) => {
        const brand = p.name.includes(",")
          ? p.name.split(",")[0].trim()
          : "Autre";
        return brand === selectedBrand;
      })
    : products;

  for (const product of filtered) {
    categorySet.add(product.category);
  }
  return categoryOrder.filter((cat) => categorySet.has(cat));
}

function extractBrands(selectedCategories: string[]) {
  const brandSet = new Set<string>();
  const filtered = selectedCategories.length
    ? products.filter((p) => selectedCategories.includes(p.category))
    : products;

  for (const product of filtered) {
    const brand = product.name.includes(",")
      ? product.name.split(",")[0].trim()
      : "Autre";
    brandSet.add(brand);
  }
  return Array.from(brandSet).sort();
}

function cleanText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function ProductsPage() {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const brandFromUrl = searchParams.get("brand");

  const initialCategories = categoryFromUrl ? categoryFromUrl.split(",") : [];
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategories);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    brandFromUrl
  );
  
  const [searchQuery, setSearchQuery] = useState("");

  // États pour les modales
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteProductName, setQuoteProductName] = useState("");
  
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<Product | null>(null);

  // Traduire dynamiquement tous les produits de la base de données
  const translatedProducts = useMemo(() => {
    return products.map((p) => translateProduct(p, language));
  }, [language]);

  const availableCategories = useMemo(
    () => extractCategories(selectedBrand),
    [selectedBrand]
  );
  const availableBrands = useMemo(
    () => extractBrands(selectedCategories),
    [selectedCategories]
  );

  // Calcul des statistiques par catégorie (nombre de produits) avec les produits traduits
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const baseProducts = selectedBrand
      ? translatedProducts.filter((p) => {
          const brand = p.name.includes(",")
            ? p.name.split(",")[0].trim()
            : "Autre";
          return brand === selectedBrand;
        })
      : translatedProducts;

    for (const product of baseProducts) {
      counts[product.category] = (counts[product.category] || 0) + 1;
    }
    return counts;
  }, [selectedBrand, translatedProducts]);

  const filteredProductsSorted = useMemo(() => {
    const filtered = translatedProducts.filter((product) => {
      const brand = product.name.includes(",")
        ? product.name.split(",")[0].trim()
        : "Autre";

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      const matchesBrand = !selectedBrand || brand === selectedBrand;
      
      const matchesSearch = (() => {
        if (!searchQuery.trim()) return true;
        const queryClean = cleanText(searchQuery);
        const tokens = queryClean.split(/\s+/);
        const targetClean = cleanText(`${product.name} ${product.category} ${product.description || ""}`);
        return tokens.every((token) => targetClean.includes(token));
      })();

      return matchesCategory && matchesBrand && matchesSearch;
    });

    if (selectedCategories.length === 0) {
      return filtered.sort((a, b) => {
        const indexA = categoryOrder.indexOf(a.category);
        const indexB = categoryOrder.indexOf(b.category);
        return (indexA !== -1 ? indexA : 999) - (indexB !== -1 ? indexB : 999);
      });
    }

    return filtered;
  }, [selectedCategories, selectedBrand, searchQuery, translatedProducts]);

  const handleOpenQuoteModal = (productName: string) => {
    setQuoteProductName(productName);
    setIsQuoteOpen(true);
  };

  const handleOpenQuickView = (product: Product) => {
    setSelectedQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf4ee] transition-colors duration-300">
      <AdBar />
      <Navbar />

      <main className="flex-1">
        
        {/* En-tête de page */}
        <div className="px-4 py-12 md:px-20 md:py-20 bg-[url('/images/banniere-catalogue.png')] bg-cover bg-center text-white relative">
          <div className="absolute inset-0 bg-black/35 z-0" />
          
          <div className="relative z-10 flex flex-col items-center gap-3">
            <h1 className="text-4xl md:text-5xl font-black text-center uppercase tracking-wider">
              {t("catalog.title")}
            </h1>


            <div className="flex justify-center mt-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink className="hover:text-white text-slate-350 font-bold" asChild>
                      <Link href="/">{t("catalog.breadcrumb_home")}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white font-bold">
                      {t("catalog.breadcrumb_products")}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>

        {/* Section principale */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-8 px-2 sm:px-4 md:px-20 py-6 sm:py-12">
          {/* Colonne Filtres */}
          <div className="hidden md:block lg:w-1/5 md:w-1/4 w-full md:sticky md:top-10 h-fit">
            <ProductFilters
              categories={availableCategories}
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
              brands={availableBrands}
              selectedBrand={selectedBrand}
              onBrandChange={setSelectedBrand}
              categoryCounts={categoryCounts}
            />
          </div>

          {/* Colonne Catalogue */}
          <div className="lg:w-4/5 md:w-3/4 w-full">
            
            {/* Barre de recherche et statistiques */}
             <div className="flex flex-col sm:flex-row justify-between items-center bg-white border border-slate-100 p-4 rounded-3xl mb-8 shadow-sm gap-4 text-left transition-colors duration-300">
               <div className="relative w-full sm:max-w-md">
                 <input
                   type="text"
                   placeholder={t("catalog.search_placeholder")}
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl text-xs font-semibold placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#006680] focus:border-transparent bg-slate-50/50 text-slate-800 focus:bg-white transition-all duration-300 shadow-xs"
                 />
                 <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
               </div>
               
               <div className="text-[10px] font-extrabold text-[#006680] bg-[#006680]/5 px-4 py-2 rounded-full uppercase tracking-widest select-none">
                 {filteredProductsSorted.length} {filteredProductsSorted.length === 1 ? t("catalog.stats_badge_single") : t("catalog.stats_badge_plural")}
               </div>
             </div>

            {/* Grille de produits */}
            <ProductList 
              products={filteredProductsSorted} 
              onQuickView={handleOpenQuickView}
            />
          </div>
        </div>

      </main>

      {/* Modale de Devis Globale */}
      <QuoteRequestModal 
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        productName={quoteProductName}
      />

      {/* Modale d'Aperçu Rapide */}
      <QuickViewModal 
        product={selectedQuickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setSelectedQuickViewProduct(null);
        }}
        onQuoteRequest={handleOpenQuoteModal}
      />

      <Footer />
    </div>
  );
}
