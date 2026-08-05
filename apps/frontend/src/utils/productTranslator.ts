import { Product } from "@/data/products";
import { Language } from "@/data/translations";

const exactPhraseTranslations: Record<string, string> = {
  "Excellence, Frites 6/6 mm": "Excellence, Patates Kızartması 6/6 mm",
  "Excellence, Frites 9/9 mm": "Excellence, Patates Kızartması 9/9 mm",
  "Ulaş Premium, Frites 6/6 mm": "Ulaş Premium, Patates Kızartması 6/6 mm",
  "Ulaş Premium, Frites 9/9 mm": "Ulaş Premium, Patates Kızartması 9/9 mm",
  "Ekin, Frites Présalé 6/6 mm": "Ekin, Önceden Tuzlanmış Patates Kızartması 6/6 mm",
  "Lamb Weston, Frites 6/6 mm": "Lamb Weston, Patates Kızartması 6/6 mm",
  "Ulaş Extra Crunch, Frites 6/6 mm": "Ulaş Extra Crunch, Patates Kızartması 6/6 mm",
  "Ekin, Frites 6/6 mm": "Ekin, Patates Kızartması 6/6 mm",
  "Almondy, Tarte au Daim": "Almondy, Daim Turtası",
  "Nubi, Tiramisu Caramel Spéculoos": "Nubi, Karamelli Bisküvili Tiramisu",
  "Maestrella, Mozarella 100%": "Maestrella, %100 Mozarella Peyniri",
  "Colona, Sauce Salade": "Colona, Salata Sosu",
  "Les Broches de Poulet et Dinde (Kebab)\n7-10-15-20-25-30 KG": "Tavuk ve Hindi Döner Şişleri (Kebab)\n7-10-15-20-25-30 KG",
  "Les Broches de Poulet et Dinde": "Tavuk ve Hindi Döner Şişleri",
  "Excellence, Huile de Tournesol": "Excellence, Ayçiçek Yağı",
  "Sac Kraft Flat": "Düz Kraft Kağıt Torba",
  "Colona, Sauce Pimentée": "Colona, Acılı Sos",
  "Antalya, 18 Dürüm 30 CM": "Antalya, 18'li Lavaş 30 CM",
  "Box Sandwich Kraft / Recyclable": "Kraft Geri Dönüştürülebilir Sandviç Kutusu",
  "Factory, Algérienne": "Factory, Cezayir Sosu (Algérienne)",
  "Factory, Samouraï": "Factory, Samuray Sosu (Samouraï)",
  "Factory, Sweet Barbecue": "Factory, Tatlı Barbekü Sosu",
  "Factory, BIG BURGER": "Factory, Büyük Burger Sosu (Big Burger)",
  "Filets de Poulet (Frais)": "Taze Tavuk Bonfile",
  "Filets de Poulet (congelés)": "Dondurulmuş Tavuk Bonfile",
  "Nubi, Tiramisu Chocolat Caramel": "Nubi, Çikolata Karamelli Tiramisu",
  "Sofra, Ayran": "Sofra, Ayran",
  "Nubi, Tiramisu Chocolat Noisette Spéculoos": "Nubi, Çikolata Fındık Bisküvili Tiramisu",
  "Factory, Lamelles de Kebab Poulet": "Factory, Tavuk Döner Dilimleri",
  "Ekin, Cordon Bleu": "Ekin, Kordon Mavi (Cordon Bleu)",
  "Factory, 18 Dürüm": "Factory, 18'li Lavaş",
  "Nubi, Tiramisu Cookies & Cream": "Nubi, Kurabiye ve Kremalı Tiramisu",
  "Ekin, Steack Haché Façon Bouchère": "Ekin, Kasap Usulü Kıyma Biftek",
  "Falafels": "Falafel",
  "Factory, Steak Haché": "Factory, Kıyma Biftek",
  "Pain Hamburger 1004": "Hamburger Ekmeği 1004",
  "Teker, Cubes de Poulet Curry": "Teker, Köri Soslu Tavuk Küpleri",
  "Nawhal’s, Sauces 1L": "Nawhal's, 1 Litrelik Soslar",
  "Colona, Sauces 5 L": "Colona, 5 Litrelik Soslar",
  "Bobine Essuie Tout x6": "6'lı Rulo Kağıt Havlu",
  "Tomato Ketchup": "Domates Ketçabı",
  "Cubax, Charbon de bois 15kg": "Cubax, Odun Kömürü 15kg",
  "Chorizo (Boeuf)": "Chorizo (Dana Eti)",
  "Dairymaid, Burger Slice": "Dairymaid, Burger Peyniri (Slice)",
  "Les Broches de Poulet (Kebab)\n7-10-15-20-25-30-40-50 KG": "Tavuk Döner Şişleri (Kebab)\n7-10-15-20-25-30-40-50 KG",
  "Les Broches de Veau et Dinde (Kebab)\n7-10-15-20-25-30 KG": "Dana ve Hindi Döner Şişleri (Kebab)\n7-10-15-20-25-30 KG",
  "Ekin, Crispy Strips Tenders": "Ekin, Çıtır Tavuk Fileto (Crispy Strips)",
  "Ekin, Chicken Nuggets": "Ekin, Tavuk Nuggets",
  "Ekin, Tenders Tempura": "Ekin, Tempura Tavuk Fileto",
  "Ekin, Burger de Poulet": "Ekin, Tavuk Burger",
  "Ekin, Ailes de Poulet, Tex-Mex": "Ekin, Tex-Mex Tavuk Kanadı",
  "Factory, Chicken Burger": "Factory, Tavuk Burger",
  "Fish Burger": "Balık Burger",
  "Teker, Cubes de Poulet Paprika": "Teker, Toz Biberli Tavuk Küpleri",
  "Cuisse de Poulet 10 kg": "Tavuk Budu 10 kg",
  "Box Hamburger": "Hamburger Kutusu",
};

const wordReplacements: Record<string, string> = {
  // Expressions complexes de liaison
  "de Poulet et Dinde": "Tavuk ve Hindi",
  "de Veau et Dinde": "Dana ve Hindi",
  "de Poulet": "Tavuk",
  "de Dinde": "Hindi",
  "de Veau": "Dana",
  "de Boeuf": "Dana",
  "de Kebab": "Kebap",
  "de poissons": "Balık",
  "de poisson": "Balık",
  "de bois": "Odunu",
  "Filets de": "Fileto",
  "Filet de": "Fileto",
  "Les Broches de": "Döner Şişleri",
  "Les Broches": "Şişler",
  "Broches de": "Döner Şişi",

  // Mots simples
  "Frites": "Patates Kızartması",
  "Frite": "Patates Kızartması",
  "Sauces": "Sosları",
  "Sauce": "Sosu",
  "Poulet": "Tavuk",
  "Dinde": "Hindi",
  "Huile": "Yağ",
  "Steak": "Biftek",
  "Pains": "Ekmekler",
  "Pain": "Ekmek",
  "Laitiers": "Süt Ürünleri",
  "Laitier": "Süt Ürünü",
  "Emballages": "Ambalajlar",
  "Emballage": "Ambalaj",
  "Conserves": "Konserveler",
  "Conserve": "Konserve",
  "Charbon de bois": "Odun Kömürü",
  "Charbon": "Kömür",
  "bois": "Odun",
  "congelés": "Dondurulmuş",
  "congelé": "Dondurulmuş",
  "frais": "Taze",
  "et": "ve",
};

const descriptionTranslations: Record<string, string> = {
  "Prête à l’emploi, nappante & gourmande": "Kullanıma hazır, kaplayıcı ve lezzetli",
  "Pommes frites enrobées, préfrites et surgelées": "Kaplanmış, önceden kızartılmış ve dondurulmuş patates kızartması",
  "Frites surgelées pré-frites de calibre 6/6 mm. Idéal pour une cuisson rapide et croustillante.": "6/6 mm ebatlarında önceden kızartılmış dondurulmuş patates. Hızlı ve çıtır pişirme için idealdir.",
  "Aucune description disponible pour ce produit.": "Bu ürün için açıklama bulunmamaktadır.",
  "Sauce algérienne légèrement épicée et sucrée, parfaite pour accompagner vos frites, viandes et burgers.": "Hafif acı ve tatlı Cezayir sosu, patates kızartması, et ve burgerlerinizin yanına mükemmel eşlik eder.",
};

export function translateProduct(product: Product, language: Language): Product {
  if (language === "fr") return product;

  // 1. Traduire le nom du produit
  let translatedName = product.name;
  
  // Lookup insensible à la casse
  const matchedKey = Object.keys(exactPhraseTranslations).find(
    (key) => key.toLowerCase() === product.name.toLowerCase()
  );

  if (matchedKey) {
    translatedName = exactPhraseTranslations[matchedKey];
  } else {
    // Remplacement par mots clés
    for (const [frWord, trWord] of Object.entries(wordReplacements)) {
      const regex = new RegExp(`\\b${frWord}\\b`, "gi");
      translatedName = translatedName.replace(regex, trWord);
    }
  }

  // 2. Traduire la description
  let translatedDesc = product.description;
  
  const matchedDescKey = Object.keys(descriptionTranslations).find(
    (key) => key.toLowerCase() === product.description?.toLowerCase()
  );

  if (matchedDescKey) {
    translatedDesc = descriptionTranslations[matchedDescKey];
  } else if (product.description) {
    let temp = product.description;
    for (const [frWord, trWord] of Object.entries(wordReplacements)) {
      const regex = new RegExp(`\\b${frWord}\\b`, "gi");
      temp = temp.replace(regex, trWord);
    }
    translatedDesc = temp;
  }

  // 3. Traduire les variantes récursivement
  const translatedVariants = product.variants
    ? product.variants.map((v) => translateProduct(v, language))
    : undefined;

  return {
    ...product,
    name: translatedName,
    description: translatedDesc,
    variants: translatedVariants,
  };
}
