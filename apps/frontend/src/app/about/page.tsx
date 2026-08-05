import type { Metadata } from "next";
import AboutPage from "./PageAbout";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `À propos | HALIL`,
    description: `Découvrez HALIL.`,
  };
}

export default async function Page() {
  return <AboutPage />;
}
