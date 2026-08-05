import { products } from "@/data/products";
import type { Metadata } from "next";
import ProductPage from "./ProductPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Produit introuvable | HALIL",
      description: "Ce produit n'existe pas ou a été retiré du catalogue.",
    };
  }

  return {
    title: `${product.name} | HALIL`,
    description: product.description || `Découvrez ${product.name} chez HALIL.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductPage slug={slug} />;
}
