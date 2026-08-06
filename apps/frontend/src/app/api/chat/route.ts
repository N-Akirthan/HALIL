import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";

export const dynamic = "force-dynamic";

interface ChatRequest {
  message: string;
  language?: string;
}

// Nettoyage et tokenisation
function cleanAndTokenize(text: string): string[] {
  let cleaned = text.toLowerCase();
  cleaned = cleaned.replace(/[éèêë]/g, "e");
  cleaned = cleaned.replace(/[àâä]/g, "a");
  cleaned = cleaned.replace(/[ùûü]/g, "u");
  cleaned = cleaned.replace(/[îï]/g, "i");
  cleaned = cleaned.replace(/[ôö]/g, "o");
  cleaned = cleaned.replace(/[ç]/g, "c");
  const words = cleaned.match(/\b\w+\b/g);
  return words || [];
}

function normalizeText(text: string): string {
  let cleaned = text.toLowerCase();
  cleaned = cleaned.replace(/[éèêë]/g, "e");
  cleaned = cleaned.replace(/[àâä]/g, "a");
  cleaned = cleaned.replace(/[ùûü]/g, "u");
  cleaned = cleaned.replace(/[îï]/g, "i");
  cleaned = cleaned.replace(/[ôö]/g, "o");
  cleaned = cleaned.replace(/[ç]/g, "c");
  return cleaned;
}

// Recherche intelligente dans le catalogue produits
function searchProducts(query: string) {
  const queryTokens = cleanAndTokenize(query);
  const stopWords = new Set([
    "avez", "vous", "des", "de", "la", "du", "les", "le", "je", "cherche",
    "un", "une", "avez-vous", "proposez-vous", "vendez-vous", "y", "a",
    "t", "il", "est", "ce", "que", "en", "stock", "vendez", "proposez", "quel",
    "combien", "donne", "moi", "est-ce", "s'il", "plait", "plaît"
  ]);

  const searchTokens = queryTokens.filter((t) => !stopWords.has(t));
  if (searchTokens.length === 0) return [];

  const results: { product: typeof products[0]; score: number }[] = [];

  for (const p of products) {
    const pNameTokens = cleanAndTokenize(p.name);
    const pCatTokens = cleanAndTokenize(p.category || "");
    const pDescTokens = cleanAndTokenize(p.description || "");

    let score = 0;
    for (const token of searchTokens) {
      if (pNameTokens.includes(token)) score += 1.2;
      if (pCatTokens.includes(token)) score += 0.6;
      if (pDescTokens.includes(token)) score += 0.3;
    }

    if (score > 0.4) {
      results.push({ product: p, score });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 3).map((r) => r.product);
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const rawMessage = body.message || "";
    const lang = (body.language || "fr").toLowerCase();
    const messageClean = normalizeText(rawMessage);

    // 1. Réponses spécifiques frites
    if (
      messageClean.includes("frite") ||
      messageClean.includes("patate") ||
      messageClean.includes("kizartma") ||
      messageClean.includes("patates")
    ) {
      if (lang === "tr") {
        return NextResponse.json({
          response:
            "Bizde öncelikle <b>Excellence Patates Kızartması 6/6 mm veya 9/9 mm</b> olmak üzere, <b>Ulaş Premium Patates Kızartması</b> (6/6 mm veya 9/9 mm) ve <b>Lamb Weston 6/6 mm</b> seçeneklerimiz mevcuttur."
        });
      }
      return NextResponse.json({
        response:
          "Nous vous proposons principalement les frites <b>Excellence 6/6 mm ou 9/9 mm</b>, ainsi que les frites <b>Ulaş Premium</b> (6/6 mm ou 9/9 mm) et <b>Lamb Weston</b> (6/6 mm)."
      });
    }

    // 2. Réponses spécifiques kebabs / viandes
    if (
      ["kebab", "kebap", "brochette", "broche", "poulet", "tavuk", "döner"].some(
        (k) => messageClean.includes(k)
      )
    ) {
      if (lang === "tr") {
        return NextResponse.json({
          response:
            "Kebab ürünlerimiz için en kaliteli döner şişlerimiz mevcuttur:<br/>" +
            "• <b>Tavuk Döner Şişi (Kebab)</b> (7 ila 50 kg arası)<br/>" +
            "• <b>Tavuk ve Hindi Döner Şişi (Kebab)</b> (7 ila 30 kg arası)<br/>" +
            "• <b>Dana ve Hindi Döner Şişi (Kebab)</b> (7 ila 30 kg arası)<br/>" +
            "• <b>Tavuk Döner Dilimleri</b> (hazır kesilmiş)<br/>" +
            "• <b>Tavuk Burger</b> ve <b>Çıtır Tavuk Fileto</b> çeşitleri."
        });
      }
      return NextResponse.json({
        response:
          "Pour les kebabs, nous proposons des broches de qualité supérieure :<br/>" +
          "• <b>Broche Kebab Poulet</b> (disponible de 7 à 50 kg)<br/>" +
          "• <b>Broche Kebab Poulet et Dinde</b> (de 7 à 30 kg)<br/>" +
          "• <b>Broche Kebab Veau et Dinde</b> (de 7 à 30 kg)<br/>" +
          "• <b>Lamelles de Kebab Poulet</b> (prêtes à l'emploi)<br/>" +
          "• Ainsi que des <b>burgers de poulet</b> et <b>tenders de poulet</b> croustillants."
      });
    }

    // 3. Questions de livraison
    if (
      ["livraison", "livrer", "delai", "zone", "idf", "paris", "livrez", "24h", "7j", "frais"].some(
        (k) => messageClean.includes(k)
      )
    ) {
      if (lang === "tr") {
        return NextResponse.json({
          response:
            "🚚 <b>HALIL Teslimat Hizmeti</b> :<br/>" +
            "• Siparişlerinizi <b>24 saat içinde</b> kapınıza teslim ediyoruz.<br/>" +
            "• Teslimat servisimiz haftanın <b>7 günü</b> aktiftir.<br/>" +
            "• Tüm <b>Île-de-France</b> (IDF) bölgesini kapsıyoruz.<br/>" +
            "• Ürünleri soğuk zincir standartlarına uygun olarak ulaştırıyoruz."
        });
      }
      return NextResponse.json({
        response:
          "🚚 <b>Service de Livraison HALIL</b> :<br/>" +
          "• Nous livrons sous <b>24 heures</b> directement dans vos locaux.<br/>" +
          "• Notre service de livraison est disponible <b>7 jours sur 7</b>.<br/>" +
          "• Nous couvrons toute la région <b>Île-de-France</b> (IDF).<br/>" +
          "• Nous assurons un respect rigoureux de la chaîne du froid."
      });
    }

    // 4. Demande de devis
    if (
      ["devis", "commander", "prix", "tarif", "cout", "acheter", "commande"].some((k) =>
        messageClean.includes(k)
      )
    ) {
      if (lang === "tr") {
        return NextResponse.json({
          response:
            "📝 <b>Fiyat teklifi nasıl istenir?</b><br/>" +
            "Çok kolay ve ücretsizdir:<br/>" +
            "1. Ekranın sağ üst köşesindeki <b>'Teklif İsteyin'</b> butonuna tıklayın.<br/>" +
            "2. Veya herhangi bir ürün kartındaki <b>'Teklif Al'</b> butonuna tıklayın.<br/>" +
            "3. Bilgilerinizi girdikten sonra satış ekibimiz <b>24 saat içinde</b> size özel bir teklifle dönecektir."
        });
      }
      return NextResponse.json({
        response:
          "📝 <b>Comment obtenir un devis ?</b><br/>" +
          "C'est très simple et gratuit :<br/>" +
          "1. Cliquez sur le bouton <b>'Devis'</b> dans la barre de navigation en haut à droite.<br/>" +
          "2. Ou cliquez sur le bouton <b>'Aperçu rapide / Demander un devis'</b> sur la carte d'un produit.<br/>" +
          "3. Remplissez vos coordonnées et notre équipe commerciale vous recontactera sous <b>24h</b>."
      });
    }

    // 5. Informations de contact
    if (
      ["contact", "telephone", "appel", "mail", "email", "adresse", "joindre", "appeler", "numero"].some(
        (k) => messageClean.includes(k)
      )
    ) {
      if (lang === "tr") {
        return NextResponse.json({
          response:
            "📞 <b>HALIL Distribution İletişim Bilgileri</b> :<br/>" +
            "• Telefon : <b>06 20 35 76 67</b><br/>" +
            "• E-postası : <b>sasuhalill@gmail.com</b><br/>" +
            "• Île-de-France bölgesindeki restoranlarınıza doğrudan teslimat sağlıyoruz."
        });
      }
      return NextResponse.json({
        response:
          "📞 <b>Coordonnées de HALIL Distribution</b> :<br/>" +
          "• Téléphone : <b>06 20 35 76 67</b> (disponible 7j/7 pour toute question)<br/>" +
          "• E-mail : <b>sasuhalill@gmail.com</b><br/>" +
          "• Basés en Île-de-France, nous livrons vos restaurants et snacks à domicile."
      });
    }

    // 6. Recherche dynamique dans le catalogue produits
    const matchedProducts = searchProducts(rawMessage);
    if (matchedProducts.length > 0) {
      const namesList = matchedProducts.map((p) => `<b>${p.name}</b>`).join(", ");
      if (lang === "tr") {
        return NextResponse.json({
          response: `Evet ! Stoklarımızda bu ürünler mevcuttur: ${namesList}. Detaylar için kataloğumuza göz atabilirsiniz !`
        });
      }
      return NextResponse.json({
        response: `Oui ! Nous proposons ces produits en stock : ${namesList}. Vous pouvez les retrouver directement dans notre catalogue !`
      });
    }

    // 7. Salutations & Présentation
    if (
      ["bonjour", "salut", "hello", "bonsoir", "hey", "bjr", "slt", "merhab", "selam"].some((k) =>
        messageClean.includes(k)
      )
    ) {
      if (lang === "tr") {
        return NextResponse.json({
          response:
            "Merhaba! Ben sizin sanal asistanınız <b>HALIL Asistan</b>. 🤝<br/>" +
            "Bugün size nasıl yardımcı olabilirim? Ürünlerimiz, teslimat koşullarımız veya teklif talepleriniz hakkında soru sorabilirsiniz."
        });
      }
      return NextResponse.json({
        response:
          "Bonjour ! Je suis le <b>Conseiller HALIL</b>, votre assistant virtuel. 🤝<br/>" +
          "Comment puis-je vous aider aujourd'hui ? Vous pouvez me poser des questions sur :<br/>" +
          "• Nos <b>produits</b> (frites, sauces, viandes...)<br/>" +
          "• Nos conditions de <b>livraison</b> (24h/7j)<br/>" +
          "• La demande de <b>devis</b>"
      });
    }

    // 8. Produits généraux
    if (
      ["produits", "catalogue", "vendez", "marchandise", "proposez", "gamme"].some((k) =>
        messageClean.includes(k)
      )
    ) {
      if (lang === "tr") {
        return NextResponse.json({
          response:
            "Restoran işletmeleri için yüksek kaliteli ürün yelpazesi sunuyoruz:<br/>" +
            "🍟 <b>Patates Kızartması</b> (Excellence, Ulaş Premium, Lamb Weston...)<br/>" +
            "🥫 Büyük boy <b>Soslar</b> (Factory, Nawhal's...)<br/>" +
            "🥩 Seçilmiş <b>Et & Kümes Hayvanları</b><br/>" +
            "🫓 Döner ve takolar için <b>Lavaş & Ekmekler</b><br/>" +
            "📦 <b>Ambalaj Ürünleri</b> ve Süt Ürünleri<br/><br/>" +
            "Tüm ürünlerimizi incelemek için yukarıdaki <b>'Tüm Ürünler'</b> sekmesine tıklayabilirsiniz!"
        });
      }
      return NextResponse.json({
        response:
          "Nous proposons une gamme complète de produits de qualité supérieure pour les restaurateurs :<br/>" +
          "🍟 <b>Frites</b> (Excellence 6/6 & 9/9, Ulaş Premium, Lamb Weston...)<br/>" +
          "🥫 <b>Sauces</b> en grands formats (Factory, Nawhal's...)<br/>" +
          "🥩 <b>Viandes & Volailles</b> sélectionnées (Broches kebab, tenders, burgers...)<br/>" +
          "🫓 <b>Tortillas & Pains</b> pour kebabs et tacos<br/>" +
          "📦 <b>Emballages</b> jetables et produits laitiers<br/><br/>" +
          "Vous pouvez explorer l'ensemble de notre gamme dans l'onglet <b>'Tous les produits'</b> !"
      });
    }

    // 9. Réponse par défaut si la demande n'est pas reconnue
    if (lang === "tr") {
      return NextResponse.json({
        response:
          "Size nasıl yardımcı olabilirim? 😅<br/><br/>" +
          "Bana <b>ürün stoklarımız (frites, viandes, sauces...)</b>, <b>teslimat koşullarımız (24h/7j)</b>, " +
          "<b>iletişim bilgilerimiz (06 20 35 76 67)</b> veya <b>fiyat teklifi</b> hakkında sorular sorabilirsiniz."
      });
    }

    return NextResponse.json({
      response:
        "Je suis à votre service ! 🤝<br/><br/>" +
        "Vous pouvez me poser des questions sur nos <b>produits en stock (frites 6/6 & 9/9, sauces, viandes...)</b>, " +
        "nos <b>conditions de livraison (24h/7j en IDF)</b>, nos <b>coordonnées (06 20 35 76 67)</b> ou vos demandes de <b>devis</b>."
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { response: "Une erreur est survenue lors du traitement de votre message." },
      { status: 500 }
    );
  }
}
