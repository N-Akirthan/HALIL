"use client";

import { useState, useEffect } from "react";
import { Menu, PhoneCall, Sun, Moon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { JSX } from "react";
import { QuoteRequestModal } from "@/components/products/QuoteRequestModal";
import { useLanguage } from "@/context/LanguageContext";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: JSX.Element;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    src?: string;
    alt: string;
    title: string;
  };
  mobileExtraLinks?: {
    name: string;
    url: string;
  }[];
}

const Navbar = ({
  logo = {
    url: "/",
    alt: "HALIL logo",
    title: "",
    src: "/images/halil-distribution-logo.png",
  },
  mobileExtraLinks = [],
}: Navbar1Props) => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const { language, setLanguage, t } = useLanguage();

  const dynamicMenu = [
    {
      title: t("nav.about"),
      url: "/about",
    },
    {
      title: t("nav.products"),
      url: "/products",
    },
    {
      title: t("nav.contact"),
      url: "mailto:sasuhalill@gmail.com",
    },
  ];

  useEffect(() => {
    // Toujours forcer le mode clair
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    setTheme("light");

    const handleOpen = () => setIsQuoteOpen(true);
    window.addEventListener("open-quote-modal", handleOpen);
    return () => window.removeEventListener("open-quote-modal", handleOpen);
  }, []);

  const toggleTheme = () => {
    // Désactiver temporairement les transitions au clic pour éliminer tout temps de rendu
    document.documentElement.classList.add("disable-transitions");
    
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Réactiver les transitions après repaint
    setTimeout(() => {
      document.documentElement.classList.remove("disable-transitions");
    }, 50);
  };

  return (
    <section className="bg-[#ebc834] dark:bg-slate-900 text-slate-900 dark:text-white border-b dark:border-slate-800 select-none transition-colors duration-300">
      <div className="container max-w-none w-full py-1.5 px-3 sm:px-6 md:px-20">
        <nav className="hidden justify-between lg:flex ">
          <div className="flex items-center gap-6 ">
            <a href={logo.url} className="flex items-center gap-2">
              {logo.src && (
                <img src={logo.src} className="w-17" alt={logo.alt} />
              )}
              <span className="text-lg font-semibold">{logo.title}</span>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {dynamicMenu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-2 text-sm font-semibold">
              <PhoneCall size={16} />
              {t("nav.call_us")}{" "}
              <a href="tel:+33620357667" className="dark:text-amber-400">
                <b>06 20 35 76 67</b>
              </a>
            </span>

            {/* Sélecteur de langue */}
            <div className="flex bg-slate-950/10 rounded-lg p-0.5 text-xs select-none">
              <button
                onClick={() => setLanguage("fr")}
                className={`px-2 py-1 rounded-md font-bold uppercase transition-all cursor-pointer ${
                  language === "fr" ? "bg-slate-900 text-white shadow-xs" : "text-slate-700 hover:text-slate-900"
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage("tr")}
                className={`px-2 py-1 rounded-md font-bold uppercase transition-all cursor-pointer ${
                  language === "tr" ? "bg-slate-900 text-white shadow-xs" : "text-slate-700 hover:text-slate-900"
                }`}
              >
                TR
              </button>
            </div>

            <Button onClick={() => setIsQuoteOpen(true)} variant={"default"} className="cursor-pointer font-bold bg-slate-900 hover:bg-slate-800 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-slate-950 text-white rounded-lg">
              {t("nav.devis")}
            </Button>
          </div>
        </nav>
        <div className="block lg:hidden">
          <div className="flex items-center justify-between gap-1.5">
            <a href={logo.url} className="flex items-center gap-2 shrink-0">
              {logo.src && (
                <img
                  src={logo.src}
                  className="w-14 sm:w-17 bg-[#e4c84d] dark:bg-slate-800 p-1 rounded"
                  alt={logo.alt}
                />
              )}
              <span className="text-base sm:text-lg font-semibold">{logo.title}</span>
            </a>
            
            <a 
              href="tel:+33620357667"
              className="flex items-center gap-1.5 bg-slate-950/10 hover:bg-slate-950/20 px-2.5 py-1.5 rounded-xl text-xs xs:text-sm sm:text-base font-black shrink-0 transition-colors"
              title={t("nav.call_us")}
            >
              <PhoneCall size={16} strokeWidth={2.5} />
              <span className="tracking-tighter sm:tracking-normal">06 20 35 76 67</span>
            </a>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Sélecteur de langue mobile */}
              <div className="flex bg-slate-950/10 rounded-lg p-0.5 text-[10px] select-none">
                <button
                  onClick={() => setLanguage("fr")}
                  className={`px-1.5 py-0.5 rounded-md font-bold uppercase transition-all cursor-pointer ${
                    language === "fr" ? "bg-slate-900 text-white shadow-xs" : "text-slate-700"
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => setLanguage("tr")}
                  className={`px-1.5 py-0.5 rounded-md font-bold uppercase transition-all cursor-pointer ${
                    language === "tr" ? "bg-slate-900 text-white shadow-xs" : "text-slate-700"
                  }`}
                >
                  TR
                </button>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="size-8 dark:bg-slate-800 dark:text-white dark:border-slate-700">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto bg-[#ebc834] dark:bg-slate-900 text-slate-900 dark:text-white border-l dark:border-slate-800">
                  <SheetHeader>
                    <SheetTitle>
                      <a href={logo.url} className="flex items-center gap-2 text-slate-900 dark:text-white">
                        {logo.src && (
                          <img src={logo.src} className="w-17" alt={logo.alt} />
                        )}
                        <span className="text-lg font-semibold">
                          {logo.title}
                        </span>
                      </a>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="my-6 flex flex-col gap-6">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4"
                    >
                      {dynamicMenu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>
                    {mobileExtraLinks.length > 0 && (
                      <div className="border-t py-4 dark:border-slate-800">
                        <div className="grid grid-cols-2 justify-start">
                          {mobileExtraLinks.map((link, idx) => (
                            <a
                              key={idx}
                              className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-slate-800 dark:text-slate-200 transition-colors hover:bg-[#dfca70] dark:hover:bg-slate-800"
                              href={link.url}
                            >
                              {link.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col gap-3">
                      <span className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs font-semibold">
                        <PhoneCall size={13} className="shrink-0" />
                        <span>{t("nav.call_us")}</span>
                        <a href="tel:+33620357667" className="dark:text-amber-400">
                          <b>06 20 35 76 67</b>
                        </a>
                      </span>
                      <Button onClick={() => setIsQuoteOpen(true)} variant={"default"} className="cursor-pointer font-bold bg-slate-900 hover:bg-slate-800 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-slate-950 text-white rounded-lg">
                        {t("nav.devis")}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Modale de devis accessible depuis n'importe quelle page via le header */}
      <QuoteRequestModal 
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
      />
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title} className="text-slate-800 dark:text-slate-200">
        <NavigationMenuTrigger className="dark:text-white dark:hover:bg-slate-800">{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-80 p-3 bg-white dark:bg-slate-900 border dark:border-slate-800">
            {item.items.map((subItem) => (
              <li key={subItem.title}>
                <NavigationMenuLink asChild>
                  <a
                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#006680] dark:hover:text-amber-400 text-slate-800 dark:text-slate-200"
                    href={subItem.url}
                  >
                    {subItem.icon}
                    <div>
                      <div className="text-sm font-semibold">
                        {subItem.title}
                      </div>
                      {subItem.description && (
                        <p className="text-sm leading-snug text-slate-500 dark:text-slate-400">
                          {subItem.description}
                        </p>
                      )}
                    </div>
                  </a>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <a
      key={item.title}
      className="bg-[#ebc834] dark:bg-slate-900 group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-slate-900 dark:text-white transition-colors hover:bg-[#dfca70] dark:hover:bg-slate-800"
      href={item.url}
    >
      {item.title}
    </a>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0 text-slate-900 dark:text-white">
        <AccordionTrigger className="py-0 font-semibold hover:no-underline text-slate-900 dark:text-white">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <a
              key={subItem.title}
              className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-200"
              href={subItem.url}
            >
              {subItem.icon}
              <div>
                <div className="text-sm font-semibold">{subItem.title}</div>
                {subItem.description && (
                  <p className="text-sm leading-snug text-slate-550 dark:text-slate-400">
                    {subItem.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="font-semibold text-slate-900 dark:text-white">
      {item.title}
    </a>
  );
};

export { Navbar };
;
