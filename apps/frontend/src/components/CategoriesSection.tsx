"use client";

import Image from "next/image";
import Link from "next/link";

type Category = {
  name: string;
  image: string;
  href: string;
};

const categoriesLeft: Category[] = [
  {
    name: "Viandes et Volailles",
    image: "/images/categories/viandes-et-volailles.png",
    href: "/products?category=Viandes,Volailles",
  },
  {
    name: "Frites et Appetizers",
    image: "/images/categories/frites-et-appetizers.png",
    href: `/products?category=${encodeURIComponent("Frites et Appetiziers")}`,
  },
  {
    name: "Pain et Tortillas",
    image: "/images/categories/pain-et-tortillas.png",
    href: `/products?category=${encodeURIComponent("Tortillas et Pains")}`,
  },
  {
    name: "Produits Laitiers et Epicerie",
    image: "/images/categories/produits-laitiers-et-epicerie.png",
    href: `/products?category=${encodeURIComponent("Produits Laitiers")}`,
  },
];

const categoriesRight: Category[] = [
  {
    name: "Tartes et Desserts",
    image: "/images/categories/tartes-et-desserts.png",
    href: "/products?category=Desserts",
  },
  {
    name: "Sauces",
    image: "/images/categories/sauces.png",
    href: "/products?category=Sauces",
  },
  {
    name: "Emballages et Packaging",
    image: "/images/categories/emballages-et-packaging.png",
    href: "/products?category=Emballages",
  },
  {
    name: "Conserves et Legumes",
    image: "/images/categories/conserves-et-legumes.png",
    href: "/products?category=Conserves",
  },
];

export default function CategoriesSection() {
  return (
    <section className="w-full py-12 bg-gray-100 dark:bg-slate-900 bg-center bg-cover transition-colors duration-300">
      <div className="container mx-auto flex flex-col items-center gap-8">
        {/* Titre */}
        <Link href="/products">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white hover:text-[#ebc834] dark:hover:text-amber-400 transition cursor-pointer">
            NOS PRODUITS
          </h2>
        </Link>

        {/* Flex gauche/droite */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-8 w-full px-3">
          {/* Colonne gauche */}
          <div className="flex-1 grid grid-cols-2 gap-3">
            {categoriesLeft.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="relative group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={400}
                  height={400}
                  className="w-full h-36 sm:h-44 md:h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/10 transition flex items-center justify-center"></div>
              </Link>
            ))}
          </div>

          {/* Colonne droite */}
          <div className="flex-1 grid grid-cols-2 gap-3">
            {categoriesRight.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="relative group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={400}
                  height={400}
                  className="w-full h-36 sm:h-44 md:h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/10 transition flex items-center justify-center"></div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
