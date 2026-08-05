"use client";

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
import { Button } from "@/components/ui/button";
import ZoomImage from "@/components/zoom-image";
import { products } from "@/data/products";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ProductPage({ slug }: { slug: string }) {
  const { language, t } = useLanguage();
  const [href, setHref] = useState("#footer");

  const product = useMemo(() => products.find((p) => p.slug === slug), [slug]);

  useEffect(() => {
    const isMobile =
      /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (isMobile) {
      setHref("tel:+33620357667");
    }
  }, []);

  const initialActiveProduct = useMemo(() => {
    if (!product) return null;
    if (product.variants && product.variants.length > 0) {
      return product.variants[0];
    }
    return product;
  }, [product]);

  const [activeProduct, setActiveProduct] = useState(initialActiveProduct);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const thumbnailRef = useRef<HTMLDivElement>(null);

  if (!product || !activeProduct) {
    return <div className="text-center py-24">{language === "fr" ? "Produit introuvable" : "Ürün bulunamadı"}</div>;
  }

  const showDetailsBox =
    activeProduct.weight ||
    activeProduct.certificate ||
    activeProduct.storage_conditions ||
    activeProduct.package ||
    activeProduct.size;

  const scrollLeft = () => {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (thumbnailRef.current) {
      thumbnailRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <AdBar />
      <Navbar />
      <div className="px-4 md:px-20 py-12">
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">{t("catalog.breadcrumb_home")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/products">{t("catalog.breadcrumb_products")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="dark:text-slate-200">{activeProduct.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Image principale + miniatures */}
          <div className="md:w-1/2 w-full">
            <ZoomImage
              src={activeProduct.images[selectedImageIndex]}
              alt={activeProduct.name}
            />

            {activeProduct.images.length > 1 && (
              <div className="flex justify-center gap-3 mt-4 overflow-x-auto no-scrollbar">
                {activeProduct.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${activeProduct.name} ${index + 1}`}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`h-20 w-20 object-contain border rounded cursor-pointer transition ${
                      selectedImageIndex === index
                        ? "border-[#ebc834] ring-2 ring-[#ebc834]"
                        : "border-gray-200 dark:border-slate-800"
                    }`}
                  />
                ))}
              </div>
            )}

            {product.variants && product.variants.length > 0 && (
              <div className="relative mt-4">
                {/* Bouton gauche */}
                <button
                  onClick={scrollLeft}
                  aria-label="Scroll left"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* Miniatures scrollables */}
                <div
                  ref={thumbnailRef}
                  className="flex gap-3 overflow-x-auto no-scrollbar mx-12"
                  style={{ scrollbarWidth: "none" }}
                >
                  {product.variants.map((variant) => (
                    <img
                      key={variant.id}
                      src={variant.images[0]}
                      alt={variant.name}
                      onClick={() => setActiveProduct(variant)}
                      className={`min-w-[80px] h-20 object-contain border rounded cursor-pointer transition ${
                        variant.id === activeProduct.id
                          ? "border-[#ebc834] ring-2 ring-[#ebc834]"
                          : "border-gray-200 dark:border-slate-800"
                      }`}
                    />
                  ))}
                </div>

                {/* Bouton droite */}
                <button
                  onClick={scrollRight}
                  aria-label="Scroll right"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-800 p-2 rounded-full shadow hover:bg-gray-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100"
                >
                  <ChevronRight size={20} />
                </button>

                <style jsx>{`
                  .no-scrollbar::-webkit-scrollbar {
                    display: none;
                  }
                  .no-scrollbar {
                    -ms-overflow-style: none; /* IE and Edge */
                    scrollbar-width: none; /* Firefox */
                  }
                `}</style>
              </div>
            )}
          </div>

          {/* Infos produit */}
          <div className="md:w-1/2 w-full space-y-6">
            <h1 className="flex flex-col items-start text-2xl font-bold text-[#ebc834] gap-3">
              <div>{activeProduct.name}</div>

              <span className="inline-flex whitespace-nowrap items-center gap-2 px-3 py-1 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-950/30 rounded-md font-semibold text-sm select-none">
                <span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400" />
                {language === "fr" ? "En stock" : "Stokta var"}
              </span>
            </h1>
            <p className="text-gray-650 dark:text-slate-300 mb-6">{activeProduct.description}</p>
            <p className="text-gray-650 dark:text-slate-300 mb-6">
              {t("modal.category")} : <b>{t("category." + activeProduct.category) || activeProduct.category}</b>
            </p>

            {showDetailsBox && (
              <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800 mt-6">
                <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 text-center">
                  {activeProduct.weight && (
                    <div className="flex flex-col items-center">
                      <span className="text-xl mb-2">⚖️</span>
                      <p className="text-sm text-gray-500 dark:text-slate-400">{language === "fr" ? "Poids" : "Ağırlık"}</p>
                      <p className="font-semibold text-gray-800 dark:text-slate-200">
                        {activeProduct.weight}
                      </p>
                    </div>
                  )}
                  {activeProduct.size && (
                    <div className="flex flex-col items-center">
                      <span className="text-xl mb-2">📏</span>
                      <p className="text-sm text-gray-500 dark:text-slate-400">{language === "fr" ? "Taille" : "Boyut"}</p>
                      <p className="font-semibold text-gray-800 dark:text-slate-200">
                        {activeProduct.size}
                      </p>
                    </div>
                  )}
                  {activeProduct.certificate && (
                    <div className="flex flex-col items-center">
                      <span className="text-xl mb-2">
                        {activeProduct.certificate.toLowerCase().includes("bio")
                          ? "♻️ "
                          : "📜"}
                      </span>
                      <p className="text-sm text-gray-500 dark:text-slate-400">{language === "fr" ? "Certificat" : "Sertifika"}</p>
                      <p className="font-semibold text-gray-800 dark:text-slate-200">
                        {activeProduct.certificate}
                      </p>
                    </div>
                  )}
                  {activeProduct.storage_conditions && (
                    <div className="flex flex-col items-center">
                      <span className="text-xl mb-2">❄️</span>
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        {language === "fr" ? "Stockage" : "Saklama Koşulları"}
                      </p>
                      <p className="font-semibold text-gray-800 dark:text-slate-200">
                        {activeProduct.storage_conditions}
                      </p>
                    </div>
                  )}
                  {activeProduct.package && (
                    <div className="flex flex-col items-center">
                      <span className="text-xl mb-2">📦</span>
                      <p className="text-sm text-gray-500 dark:text-slate-400">{t("modal.packaging")}</p>
                      <p className="font-semibold text-gray-800 dark:text-slate-200">
                        {activeProduct.package}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-slate-400">
                {language === "fr" ? "Ce produit vous intéresse ?" : "Bu ürünle ilgileniyor musunuz?"}
              </p>
              <Link href={href}>
                <Button className="bg-[#ebc834] hover:bg-[#dfca70] dark:bg-amber-400 dark:hover:bg-amber-500 text-black font-bold">
                  {t("faq.support_btn")}
                  <span className="hidden"> au 06 20 35 76 67</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
