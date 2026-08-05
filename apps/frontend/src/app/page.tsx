import AdBar from "@/components/adbar";
import CategoriesSection from "@/components/CategoriesSection";
import { Faq } from "@/components/faq";
import FeatureHighlights from "@/components/feature-highlights";
import { Footer } from "@/components/footer-section";
import { Navbar } from "@/components/navbar";
import { ProductSlider } from "@/components/products/ProductSlider";
import { Feature } from "@/components/ui/feature-with-image-carousel";
import { Hero } from "@/components/ui/landing-hero";

export default function Home() {
  return (
    <div className="">
      <AdBar />
      <Navbar />
      <Hero />
      <ProductSlider />
      <CategoriesSection />
      <div className="flex flex-col items-center justify-center mx-10 md:mx-20">
        <Feature />
        <FeatureHighlights />
        <Faq />
      </div>
      <Footer />
    </div>
  );
}
