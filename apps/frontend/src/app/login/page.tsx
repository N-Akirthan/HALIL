import type { Metadata } from "next";
import LoginPage from "./LoginPage";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Se connecter | HALIL`,
    description: `Découvrez HALIL.`,
  };
}

export default async function Page() {
  return <LoginPage />;
}
