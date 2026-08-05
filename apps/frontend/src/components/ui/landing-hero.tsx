"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { useLanguage } from "@/context/LanguageContext";

const sliderImages = [
  "/images/landing-image-3.png",
  "/images/landing-image-1.png",
];

function Hero() {
  const { t } = useLanguage();
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [t("hero.title_part_2_alimentaires"), t("hero.title_part_2_surgeles"), t("hero.title_part_2_non_surgeles")],
    [t]
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const sliderInterval = useRef<NodeJS.Timeout | null>(null);

  const startSliderTimer = () => {
    if (sliderInterval.current) clearInterval(sliderInterval.current);
    sliderInterval.current = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % sliderImages.length;
        setProgressKey((k) => k + 1);
        return next;
      });
    }, 10000);
  };

  useEffect(() => {
    startSliderTimer();
    return () => {
      if (sliderInterval.current) clearInterval(sliderInterval.current);
    };
  }, []);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    setProgressKey((k) => k + 1);
    startSliderTimer();
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev + 1) % titles.length);
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles.length]);

  return (
    <div
      className="relative flex justify-center items-center bg-cover bg-center transition-all duration-1000"
      style={{
        backgroundImage: `url(${sliderImages[currentSlide]})`,
        height: "calc(100vh - 17rem)",
      }}
    >
      {/* Overlay de fond pour meilleur contraste */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-0 transition-colors duration-300" />
      {/* Barre de progression */}
      <div className="absolute top-0 left-0 w-full h-1 bg-transparent z-20 overflow-hidden">
        <motion.div
          key={progressKey}
          className="h-full bg-[#ebc834]"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 10, ease: "linear" }}
        />
      </div>

      <div className="container mx-auto my-auto z-10">
        <div className="flex gap-8 items-center mt-4 justify-center flex-col">
          <div className="flex gap-4 flex-col px-4">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {t("hero.title_part_1")}
              </span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight max-w-2xl text-center text-white">
              {t("hero.subtitle")}
            </p>
          </div>

          <div className="flex flex-row gap-3">
            <Button
              size="lg"
              className="bg-[#ebc834] hover:bg-[#dfca70] text-black"
            >
              <Link href={"/products"}>{t("hero.catalog_btn")}</Link>
            </Button>
          </div>

          {/* Points de navigation */}
          <div className="flex gap-2 mt-6">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  currentSlide === index ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
