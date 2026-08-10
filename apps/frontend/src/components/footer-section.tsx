"use client";
import { LinkedinIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import React from "react";

interface FooterLink {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

const logo = {
  url: "/",
  alt: "HALIL logo",
  title: "",
  src: "/images/halil-distribution-logo-white.png",
};

const footerLinks: FooterSection[] = [
  {
    label: "Entreprise",
    links: [
      { title: "Page d’accueil", href: "/" },
      { title: "FAQs", href: "/#faqs" },
      { title: "À propos de nous", href: "/about" },
      { title: "Catalogues / Produits", href: "/products" },
      { title: "Politique de confidentialité", href: "/privacy" },
      { title: "Conditions d'utilisation", href: "/terms" },
    ],
  },
  {
    label: "Nous contacter",
    links: [
      { title: "sasuhalill@gmail.com", href: "mailto:sasuhalill@gmail.com" },
    ],
  },
  {
    label: "Réseaux sociaux",
    links: [{ title: "LinkedIn", href: "#", icon: LinkedinIcon }],
  },
  {
    label: "Devis",
    links: [{ title: "Demander un devis", href: "#" }],
  },
];

import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { language, t } = useLanguage();

  const dynamicFooterLinks = [
    {
      label: language === "fr" ? "Entreprise" : "Firma",
      links: [
        { title: language === "fr" ? "Page d’accueil" : "Anasayfa", href: "/" },
        { title: "FAQs", href: "/#faqs" },
        { title: t("nav.about"), href: "/about" },
        { title: t("nav.products"), href: "/products" },
        { title: language === "fr" ? "Politique de confidentialité" : "Gizlilik Politikası", href: "/privacy" },
        { title: language === "fr" ? "Conditions d'utilisation" : "Kullanım Şartları", href: "/terms" },
      ],
    },
    {
      label: t("nav.contact"),
      links: [
        { title: "sasuhalill@gmail.com", href: "mailto:sasuhalill@gmail.com" },
      ],
    },
    {
      label: language === "fr" ? "Réseaux sociaux" : "Sosyal Medya",
      links: [{ title: "LinkedIn", href: "#", icon: LinkedinIcon }],
    },
    {
      label: t("footer.devis_title"),
      links: [{ title: t("footer.devis_action"), href: "#" }],
    },
  ];

  return (
    <footer
      id="footer"
      className="bg-black text-white md:rounded-t-6xl relative w-full mx-auto flex flex-col items-center justify-center border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] px-6 py-12 lg:py-16"
    >
      <div className="bg-foreground/20 absolute top-0 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

      <div className="w-full flex flex-col-reverse xl:grid xl:grid-cols-3 xl:gap-8">
        <AnimatedContainer>
          <div className="space-y-4">
            <span className="text-lg font-semibold">
              <a href={logo.url} className="flex items-center gap-2">
                {logo.src && (
                  <img src={logo.src} className="w-20" alt={logo.alt} />
                )}
                <span className="text-lg font-semibold">{logo.title}</span>
              </a>
            </span>
            <p className="mt-8 text-sm mb-0">{t("footer.help")}</p>
            <Link href="tel:06 20 35 76 67">
              <p className="mt-0 font-bold mb-0">06 20 35 76 67</p>
            </Link>
            <Link href="tel:07 81 35 09 09">
              <p className="font-bold mb-0">07 81 35 09 09</p>
            </Link>
            <p className="text-sm">{t("footer.contact_now")}</p>
            <p className="mt-0 text-sm">
              Copyright © {new Date().getFullYear()} halil.com. {t("footer.rights")}
            </p>
          </div>
        </AnimatedContainer>

        <div className="mt-8 xl:mt-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 xl:col-span-2">
          <AnimatedContainer delay={0.1}>
            <div className="mb-6 md:mb-0">
              <h3 className="text-xs font-bold">{dynamicFooterLinks[0].label}</h3>
              <ul className="text-white mt-4 space-y-2 text-sm">
                {dynamicFooterLinks[0].links.map((link: any) => (
                  <li key={link.title}>
                    <a
                      href={link.href}
                      className="hover:text-muted-foreground inline-flex items-center transition-all duration-300"
                    >
                      {link.icon && <link.icon className="me-1 size-4" />}
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedContainer>

          <div className="col-span-1 sm:col-span-1 md:col-span-3 flex flex-col sm:flex-row flex-wrap gap-8 md:gap-10">
            {[dynamicFooterLinks[1], dynamicFooterLinks[2], dynamicFooterLinks[3]].map((section, index) => (
              <AnimatedContainer key={section.label} delay={0.2 + index * 0.1}>
                <div className="mb-10 md:mb-0">
                  <h3 className="text-xs font-bold whitespace-nowrap">
                    {section.label}
                  </h3>
                  <ul className="text-white mt-4 space-y-2 text-sm">
                    {section.links.map((link: any) => (
                      <li key={link.title}>
                        <a
                          href={link.href}
                          onClick={link.title === t("footer.devis_action") ? (e) => {
                            e.preventDefault();
                            window.dispatchEvent(new CustomEvent("open-quote-modal"));
                          } : undefined}
                          className="hover:text-muted-foreground inline-flex items-center transition-all duration-300"
                        >
                          {link.icon && <link.icon className="me-1 size-4" />}
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedContainer>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>["className"];
  children: ReactNode;
};

function AnimatedContainer({
  className,
  delay = 0.1,
  children,
}: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return children;
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
