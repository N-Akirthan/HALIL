"use client";

import { Badge } from "./badge";

function Hero() {
  return (
    <div className="relative bg-transparent">
      {/* Contenu pour mobile */}
      <div className="container mx-auto md:hidden">
        <div className="flex gap-8 py-8 items-center justify-center flex-col">
          <div>
            <span>
              <Badge className="bg-[#bcbfcf] dark:bg-slate-800 hover:bg-[#c9ccdd] dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-2xl px-4">
                Notre mission
              </Badge>
            </span>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-2xl md:text-5xl max-w-2xl tracking-tighter text-center font-black uppercase text-slate-900 dark:text-white leading-tight">
              Accompagner les professionnels dans l’approvisionnement rapide
              et fiable de produits alimentaires
            </h1>
            <p className="px-2 text-lg md:text-xl leading-relaxed tracking-tight text-slate-650 dark:text-slate-300 max-w-2xl text-center">
              Fondée en 1998 à Paris, HALIL distribue des produits alimentaires
              pour les professionnels de la restauration. Son catalogue comprend
              viandes, surgelés, pains et sauces. Fiable et réactive, HALIL est
              un partenaire de confiance en Île-de-France
            </p>
            <img
              src={"/images/halil-truck.png"}
              className="object-contain p-6"
              alt="Halil truck mobile"
            />
          </div>
        </div>
      </div>

      <div
        className="mx-0 relative bg-cover md:bg-center hidden md:block bg-transparent"
        style={{
          backgroundImage: "url('/images/bg-about.png')",
          height: "calc(100vh - 6.5rem)",
        }}
      >
        <div className="container mx-auto">
          <div className="flex gap-8 py-20 lg:py-20 items-center justify-center flex-col">
            <div>
              <span>
                <Badge className="bg-[#bcbfcf] dark:bg-slate-800 hover:bg-[#c9ccdd] dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-2xl px-4">
                  Notre mission
                </Badge>
              </span>
            </div>
            <div className="flex gap-4 flex-col">
              <h1 className="text-2xl md:text-5xl max-w-2xl tracking-tighter text-center font-black uppercase text-slate-900 dark:text-white leading-tight">
                Accompagner les professionnels dans l’approvisionnement rapide
                et fiable de produits alimentaires
              </h1>
              <p className="text-lg md:text-xl leading-relaxed tracking-tight text-slate-650 dark:text-slate-350 max-w-2xl text-center">
                Fondée en 1998 à Paris, HALIL distribue des produits
                alimentaires pour les professionnels de la restauration. Son
                catalogue comprend viandes, surgelés, pains et sauces. Fiable et
                réactive, HALIL est un partenaire de confiance en Île-de-France
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
