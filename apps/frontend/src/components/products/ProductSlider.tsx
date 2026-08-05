"use client";

import { InfiniteSlider } from "@/components/ui/infinite-slider-horizontal";
import { Product, products } from "@/data/products";
import Image from "next/image";

const productNamesToShow = [
  "Excellence, Frites 9/9 mm",
  "Ekin, Frites 6/6 mm",
  "Lamb Weston, Frites 6/6 mm",
  "Almondy, Tarte au Daim",
  "Nubi, Tiramisu Caramel Spéculoos",
  "Maestrella, Mozarella 100%",
  "Colona, Sauce Salade",
  "Les Broches de Poulet et Dinde",
  "Harissa",
  "Excellence, Huile de Tournesol",
  "Sac Kraft Flat",
  "Colona, Sauce Pimentée",
  "Antalya, 18 Dürüm 30 CM",
  "Box Sandwich Kraft / Recyclable",
  "Factory, Algérienne",
  "Factory, Samouraï",
  "Factory, Sweet Barbecue",
  "Factory, BIG BURGER",
  "Filets de Poulet (Frais)",
  "Nubi, Tiramisu Chocolat Caramel",
  "Sofra, Ayran",
  "Nubi, Tiramisu Chocolat Noisette Spéculoos",
  "Factory, Lamelles de Kebab Poulet",
  "Ekin, Cordon Bleu",
  "Factory, 18 Dürüm",
  "Nubi, Tiramisu Cookies & Cream",
  "Ekin, Frites Présalé 6/6 mm",
  "Ekin, Steack Haché Façon Bouchère",
  "Falafels",
  "Factory, Steak Haché",
  "Pain Hamburger 1004",
  "Teker, Cubes de Poulet Curry",
  "Nawhal’s, Sauces 1L",
  "Colona, Sauces 5 L",
  "Bobine Essuie Tout x6",
  "Tomato Ketchup",
];

function findProductByName(
  name: string,
  products: Product[]
): Product | undefined {
  const keywords = name.toLowerCase().split(/[, ]+/).filter(Boolean);
  return products.find((prod) =>
    keywords.every((kw) => prod.name.toLowerCase().includes(kw))
  );
}

const matchedProducts = productNamesToShow
  .map((name) => findProductByName(name, products))
  .filter(Boolean) as Product[];

export function ProductSlider() {
  const firstHalf = matchedProducts.slice(0, matchedProducts.length / 2 - 1);
  const secondHalf = matchedProducts.slice(matchedProducts.length / 2);
  return (
    <div className="h-[400px] flex flex-col justify-center gap-4">
      <div className="flex items-center space-x-4 mx-auto w-full max-w-max">
        <InfiniteSlider direction="horizontal">
          {firstHalf.map((product) => (
            <div
              key={product.id}
              className="flex items-center aspect-square w-[120px] rounded-[4px]"
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                width={1200}
                height={1200}
                className="rounded-[4px]"
              />
            </div>
          ))}
        </InfiniteSlider>
      </div>
      <div className="flex items-center space-x-4 mx-auto w-full max-w-max">
        <InfiniteSlider direction="horizontal" reverse>
          {secondHalf.map((product) => (
            <div
              key={product.id}
              className="flex items-center aspect-square w-[120px] rounded-[4px]"
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                width={1200}
                height={1200}
                className="rounded-[4px]"
              />
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </div>
  );
}
