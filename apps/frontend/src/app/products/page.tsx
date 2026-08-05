import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsPageWrapper from "./ProductsPageWrapper";

export const metadata: Metadata = {
  title: "Produits | HALIL",
  description:
    "Découvrez tous les produits proposés par HALIL, votre grossiste alimentaire.",
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageWrapper />
    </Suspense>
  );
}
