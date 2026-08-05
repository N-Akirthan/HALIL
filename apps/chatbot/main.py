import os
import re
import math
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="HALIL Chatbot API", version="5.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    language: str = "fr"

# Parser dynamique pour lire les produits du frontend en temps réel
def load_products() -> list[dict]:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    products_path = os.path.abspath(os.path.join(current_dir, "../frontend/src/data/products.ts"))
    
    products_list = []
    if not os.path.exists(products_path):
        return products_list
        
    try:
        with open(products_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Parse grossier mais robuste des blocs d'objets du tableau TypeScript
        blocks = re.findall(r'\{\s*(id:\s*".*?",\s*name:\s*".*?".*?)\}', content, re.DOTALL)
        for block in blocks:
            p = {}
            id_match = re.search(r'id:\s*"(.*?)"', block)
            name_match = re.search(r'name:\s*"(.*?)"', block)
            slug_match = re.search(r'slug:\s*"(.*?)"', block)
            cat_match = re.search(r'category:\s*"(.*?)"', block)
            desc_match = re.search(r'description:\s*"(.*?)"', block)
            weight_match = re.search(r'weight:\s*"(.*?)"', block)
            pkg_match = re.search(r'package:\s*"(.*?)"', block)
            cert_match = re.search(r'certificate:\s*"(.*?)"', block)
            storage_match = re.search(r'storage_conditions:\s*"(.*?)"', block)
            
            if name_match:
                p["name"] = name_match.group(1).replace('\\"', '"')
                p["id"] = id_match.group(1) if id_match else ""
                p["slug"] = slug_match.group(1) if slug_match else ""
                p["category"] = cat_match.group(1) if cat_match else ""
                p["description"] = desc_match.group(1) if desc_match else ""
                p["weight"] = weight_match.group(1) if weight_match else ""
                p["package"] = pkg_match.group(1) if pkg_match else ""
                p["certificate"] = cert_match.group(1) if cert_match else ""
                p["storage_conditions"] = storage_match.group(1) if storage_match else ""
                products_list.append(p)
    except Exception as e:
        print("Erreur de chargement du fichier products.ts:", e)
        
    return products_list

# Chargement de l'inventaire en mémoire au démarrage
PRODUCTS_INVENTORY = load_products()
print(f"Chargement réussi : {len(PRODUCTS_INVENTORY)} produits trouvés dans l'inventaire.")

# Base d'apprentissage locale pour le calcul de similarité sémantique (Français)
INTENT_DATA = {
    "greetings": {
        "phrases": [
            "bonjour", "salut", "hello", "bonsoir", "hey", "coucou", 
            "bjr", "slt", "bonjour bot", "yo", "bonjour assistant",
            "bonjour comment ca va", "salut ca va"
        ],
        "response": (
            "Bonjour ! Je suis le <b>Conseiller HALIL</b>, votre assistant virtuel. 🤝<br/>"
            "Comment puis-je vous aider aujourd'hui ? Vous pouvez me poser des questions sur :<br/>"
            "• Nos <b>produits</b> (frites, sauces, viandes...)<br/>"
            "• Nos conditions de <b>livraison</b><br/>"
            "• La demande de <b>devis</b>"
        )
    },
    "products": {
        "phrases": [
            "quels sont vos produits", "qu'est ce que vous vendez", "catalogue", "produits", 
            " grossiste alimentaire", "marchandise", "qu'est-ce que vous proposez", "gamme de produits"
        ],
        "response": (
            "Nous proposons une gamme complète de produits de qualité supérieure pour les restaurateurs :<br/>"
            "🍟 <b>Frites</b> (Excellence, Ulaş Premium, Lamb Weston...)<br/>"
            "🥫 <b>Sauces</b> en grands formats (Factory, Nawhal's...)<br/>"
            "🥩 <b>Viandes & Volailles</b> sélectionnées<br/>"
            "🫓 <b>Tortillas & Pains</b> pour kebabs et tacos<br/>"
            "📦 <b>Emballages</b> jetables et produits laitiers<br/><br/>"
            "Vous pouvez explorer l'ensemble de notre gamme dans l'onglet <b>'Tous les produits'</b> !"
        )
    },
    "delivery": {
        "phrases": [
            "livraison", "livrer", "delai", "zone", "idf", "paris", "livrez vous", 
            "24h", "7j", "quand livrez vous", "temps de livraison", "jours de livraison",
            "livreson", "livraisons", "ile de france", "frais de port", "frais de livraison",
            "vous livrez ou", "zone de livraison"
        ],
        "response": (
            "🚚 <b>Service de Livraison HALIL</b> :<br/>"
            "• Nous livrons sous <b>24 heures</b> directement dans vos locaux.<br/>"
            "• Notre service de livraison est disponible <b>7 jours sur 7</b>.<br/>"
            "• Nous couvrons toute la région <b>Île-de-France</b> (IDF).<br/>"
            "• Nous assurons un respect rigoureux de la chaîne du froid."
        )
    },
    "quote": {
        "phrases": [
            "devis", "commander", "prix", "tarif", "cout", "demander", "acheter",
            "devis gratuit", "faire un devis", "obtenir un devis", "tarif des produits",
            "devisse", "commande", "acheter en gros", "comment commander",
            "tarif de livraison", "combien ca coute", "prix de gros"
        ],
        "response": (
            "📝 <b>Comment obtenir un devis ?</b><br/>"
            "C'est très simple et gratuit :<br/>"
            "1. Cliquez sur le bouton <b>'Devis'</b> dans la barre de navigation en haut à droite.<br/>"
            "2. Ou cliquez sur le bouton <b>'Aperçu rapide / Demander un devis'</b> sur la carte d'un produit.<br/>"
            "3. Remplissez vos coordonnées et notre équipe commerciale vous recontactera sous <b>24h</b> avec une offre personnalisée."
        )
    },
    "contact": {
        "phrases": [
            "contact", "telephone", "appel", "mail", "email", "adresse", "locaux", "joindre", 
            "appeler", "numero", "mail de contact", "où etes vous", "coordonnees", "contacter",
            "telephoner", "snack de contact", "adresse physique", "ou vous trouvez"
        ],
        "response": (
            "📞 <b>Coordonnées de HALIL Distribution</b> :<br/>"
            "• Téléphone : <a href='tel:+33620357667' className='underline font-bold text-amber-900'><b>06 20 35 76 67</b></a> (disponible pour toute question)<br/>"
            "• E-mail : <b>sasuhalill@gmail.com</b><br/>"
            "• Nous sommes basés en Île-de-France et livrons vos snacks et restaurants à domicile."
        )
    },
    "about": {
        "phrases": [
            "qui es tu", "chatbot", "nom", "robot", "assistant", "qui vous etes", "presentation",
            "c'est quoi halil", "entreprise halil", "sasu halil", "grossiste", "pourquoi halil",
            "qui t'a cree", "d'ou viens tu"
        ],
        "response": (
            "🤖 Je suis l'assistant virtuel intelligent de <b>HALIL Distribution</b>. "
            "Je suis conçu pour vous aider à naviguer sur notre site, vous renseigner sur nos stocks de frites, viandes et sauces, et vous accompagner dans vos demandes de devis."
        )
    },
    "thanks": {
        "phrases": [
            "merci", "super", "ok", "cool", "parfait", "merci beaucoup", "thanks", "thx", "nickel",
            "genial", "magnifique", "merci bien"
        ],
        "response": (
            "Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions. Je suis à votre service."
        )
    }
}

# Base d'apprentissage locale pour le calcul de similarité sémantique (Turc)
INTENT_DATA_TR = {
    "greetings": {
        "response": (
            "Merhaba! Ben sizin sanal asistanınız <b>HALIL Asistan</b>. 🤝<br/>"
            "Bugün size nasıl yardımcı olabilirim? Aşağıdaki konularda soru sorabilirsiniz:<br/>"
            "• <b>Ürünlerimiz</b> (patates, soslar, etler...)<br/>"
            "• <b>Teslimat</b> koşullarımız<br/>"
            "• Fiyat <b>teklifi</b> talebi"
        )
    },
    "products": {
        "response": (
            "Restoran işletmeleri için yüksek kaliteli ürün yelpazesi sunuyoruz:<br/>"
            "🍟 <b>Patates Kızartması</b> (Excellence, Ulaş Premium, Lamb Weston...)<br/>"
            "🥫 Büyük boy <b>Soslar</b> (Factory, Nawhal's...)<br/>"
            "🥩 Seçilmiş <b>Et & Kümes Hayvanları</b><br/>"
            "🫓 Döner ve takolar için <b>Lavaş & Ekmekler</b><br/>"
            "📦 <b>Ambalaj Ürünleri</b> ve Süt Ürünleri<br/><br/>"
            "Tüm ürünlerimizi incelemek için yukarıdaki <b>'Tüm Ürünler'</b> sekmesine tıklayabilirsiniz!"
        )
    },
    "delivery": {
        "response": (
            "🚚 <b>HALIL Teslimat Hizmeti</b> :<br/>"
            "• Siparişlerinizi <b>24 saat içinde</b> kapınıza teslim ediyoruz.<br/>"
            "• Teslimat servisimiz haftanın <b>7 günü</b> aktiftir.<br/>"
            "• Tüm <b>Île-de-France</b> (IDF) bölgesini kapsıyoruz.<br/>"
            "• Ürünleri soğuk zincir standartlarına uygun olarak ulaştırıyoruz."
        )
    },
    "quote": {
        "response": (
            "📝 <b>Fiyat teklifi nasıl istenir?</b><br/>"
            "Çok kolay ve ücretsizdir:<br/>"
            "1. Ekranın sağ üst köşesindeki <b>'Teklif İsteyin'</b> butonuna tıklayın.<br/>"
            "2. Veya herhangi bir ürün kartındaki <b>'Teklif Al'</b> butonuna tıklayın.<br/>"
            "3. Bilgilerinizi girdikten sonra satış ekibimiz <b>24 saat içinde</b> size özel bir teklifle dönecektir."
        )
    },
    "contact": {
        "response": (
            "📞 <b>HALIL Distribution İletişim Bilgileri</b> :<br/>"
            "• Telefon : <a href='tel:+33620357667' className='underline font-bold text-amber-900'><b>06 20 35 76 67</b></a><br/>"
            "• E-postası : <b>sasuhalill@gmail.com</b><br/>"
            "• Île-de-France bölgesindeki restoranlarınıza doğrudan teslimat sağlıyoruz."
        )
    },
    "about": {
        "response": (
            "🤖 Ben <b>HALIL Distribution</b> firmasının yapay zeka destekli sanal asistanıyım. "
            "Size ürün stoklarımız, teslimat koşullarımız ve fiyat teklifi talepleriniz hakkında bilgi vermek için buradayım."
        )
    },
    "thanks": {
        "response": (
            "Rica ederim! 😊 Yardımcı olabildiysem ne mutlu. Başka sorunuz varsa yanıtlamaya hazırırım."
        )
    }
}

def clean_and_tokenize(text: str) -> list[str]:
    text = text.lower()
    text = re.sub(r'[éèêë]', 'e', text)
    text = re.sub(r'[àâä]', 'a', text)
    text = re.sub(r'[ùûü]', 'u', text)
    text = re.sub(r'[îï]', 'i', text)
    text = re.sub(r'[ôö]', 'o', text)
    text = re.sub(r'[ç]', 'c', text)
    words = re.findall(r'\b\w+\b', text)
    return words

def normalize_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[éèêë]', 'e', text)
    text = re.sub(r'[àâä]', 'a', text)
    text = re.sub(r'[ùûü]', 'u', text)
    text = re.sub(r'[îï]', 'i', text)
    text = re.sub(r'[ôö]', 'o', text)
    text = re.sub(r'[ç]', 'c', text)
    return text

def get_cosine_similarity(vec1: dict[str, int], vec2: dict[str, int]) -> float:
    intersection = set(vec1.keys()) & set(vec2.keys())
    numerator = sum([vec1[x] * vec2[x] for x in intersection])

    sum1 = sum([vec1[x]**2 for x in vec1.keys()])
    sum2 = sum([vec2[x]**2 for x in vec2.keys()])
    denominator = math.sqrt(sum1) * math.sqrt(sum2)

    if not denominator:
        return 0.0
    return float(numerator) / denominator

def vectorize(tokens: list[str]) -> dict[str, int]:
    vec = {}
    for t in tokens:
        vec[t] = vec.get(t, 0) + 1
    return vec

# Fonction de recherche intelligente de produits dans notre inventaire local
def search_products(query: str, inventory: list[dict]) -> list[dict]:
    query_tokens = clean_and_tokenize(query)
    stop_words = {
        "avez", "vous", "des", "de", "la", "du", "les", "le", "je", "cherche", 
        "un", "une", "avez-vous", "proposez-vous", "vendez-vous", "y", "a", 
        "t", "il", "est", "ce", "que", "en", "stock", "vendez", "proposez", "quel",
        "combien", "donne", "moi", "est-ce", "s'il", "vous", "plait", "plaît"
    }
    search_tokens = [t for t in query_tokens if t not in stop_words]
    
    if not search_tokens:
        return []
        
    results = []
    for p in inventory:
        p_name_tokens = clean_and_tokenize(p.get("name", ""))
        p_cat_tokens = clean_and_tokenize(p.get("category", ""))
        p_desc_tokens = clean_and_tokenize(p.get("description", ""))
        
        # Attribution d'un score de pertinence sémantique
        score = 0.0
        for token in search_tokens:
            if token in p_name_tokens:
                score += 1.2  # Poids fort pour les correspondances de nom
            if token in p_cat_tokens:
                score += 0.6  # Poids moyen pour la catégorie
            if token in p_desc_tokens:
                score += 0.3  # Poids faible pour la description
                
        if score > 0.4:
            results.append((p, score))
            
    # Tri par pertinence décroissante et conservation des 3 meilleurs
    results.sort(key=lambda x: x[1], reverse=True)
    return [r[0] for r in results[:3]]

@app.post("/api/chat")
async def chat_endpoint(payload: ChatRequest):
    message_raw = payload.message
    message_clean = normalize_text(message_raw)
    lang = payload.language.lower()
    
    # 0. Override de réponses courtes et simples pour frites et kebab
    if "frite" in message_clean or "patate" in message_clean or "kizartma" in message_clean or "patates" in message_clean:
        if lang == "tr":
            return {
                "response": (
                    "Bizde öncelikle <b>Excellence Patates Kızartması 6/6 mm veya 9/9 mm</b> olmak üzere, "
                    "<b>Ulaş Premium Patates Kızartması</b> (6/6 mm veya 9/9 mm) ve <b>Lamb Weston 6/6 mm</b> seçeneklerimiz mevcuttur."
                )
            }
        else:
            return {
                "response": (
                    "Nous vous proposons principalement les frites <b>Excellence 6/6 mm ou 9/9 mm</b>, "
                    "ainsi que les frites <b>Ulaş Premium</b> (6/6 mm ou 9/9 mm) et <b>Lamb Weston</b> (6/6 mm)."
                )
            }

    if any(k in message_clean for k in ["kebab", "kebap", "brochette", "broche", "poulet", "tavuk", "döner"]):
        if lang == "tr":
            return {
                "response": (
                    "Kebab ürünlerimiz için en kaliteli döner şişlerimiz mevcuttur:<br/>"
                    "• <b>Tavuk Döner Şişi (Kebab)</b> (7 ila 50 kg arası)<br/>"
                    "• <b>Tavuk ve Hindi Döner Şişi (Kebab)</b> (7 ila 30 kg arası)<br/>"
                    "• <b>Dana ve Hindi Döner Şişi (Kebab)</b> (7 ila 30 kg arası)<br/>"
                    "• <b>Tavuk Döner Dilimleri</b> (hazır kesilmiş)<br/>"
                    "• <b>Tavuk Burger</b> ve <b>Çıtır Tavuk Fileto</b> çeşitleri."
                )
            }
        else:
            return {
                "response": (
                    "Pour les kebabs, nous proposons des broches de qualité supérieure :<br/>"
                    "• <b>Broche Kebab Poulet</b> (disponible de 7 à 50 kg)<br/>"
                    "• <b>Broche Kebab Poulet et Dinde</b> (de 7 à 30 kg)<br/>"
                    "• <b>Broche Kebab Veau et Dinde</b> (de 7 à 30 kg)<br/>"
                    "• <b>Lamelles de Kebab Poulet</b> (prêtes à l'emploi)<br/>"
                    "• Ainsi que des <b>burgers de poulet</b> et <b>tenders de poulet</b> croustillants."
                )
            }
            
    # 1. Vérification d'une recherche de produits dans l'inventaire en premier
    product_keywords = ["cherche", "avez", "vendez", "proposez", "trouver", "frite", "sauce", "viande", "pain", "colis", "kebab", "tacos", "poids", "carton", "conservation", "temperature", "colisage", "conditionnement", "halal", "certificat", "ulas", "excellence", "lamb weston", "colona", "nawhal", "algerienne", "burger", "mayo", "ketchup"]
    contains_product_query = any(k in message_clean for k in product_keywords)
    
    if contains_product_query:
        matched_products = search_products(message_raw, PRODUCTS_INVENTORY)
        if matched_products:
            # Si on a un match très fort, on regarde si la question porte sur un attribut précis de ce produit
            best_match = matched_products[0]
            
            # Détection d'attributs spécifiques demandés par l'utilisateur
            is_asking_package = any(k in message_clean for k in ["carton", "colis", "conditionnement", "colisage", "paquet"])
            is_asking_weight = any(k in message_clean for k in ["poids", "pese", "kg", "kilo", "gramme"])
            is_asking_storage = any(k in message_clean for k in ["conservation", "conserver", "stockage", "temperature", "froid", "degre", "gel", "conserve"])
            is_asking_certificate = any(k in message_clean for k in ["certificat", "halal", "label", "charte", "bio"])
            is_asking_desc = any(k in message_clean for k in ["description", "c'est quoi", "sert a", "detail", "explique"])

            if is_asking_package and best_match.get("package"):
                return {
                    "response": (
                        f"Le conditionnement (colisage) de <b>{best_match['name']}</b> est :<br/>"
                        f"📦 <b>{best_match['package']}</b>.<br/><br/>"
                        f"Vous pouvez consulter la fiche complète <a href='/products/{best_match['slug']}' class='text-[#006680] underline font-bold'>ici</a>."
                    )
                }
            elif is_asking_weight and best_match.get("weight"):
                return {
                    "response": (
                        f"Le poids de <b>{best_match['name']}</b> est :<br/>"
                        f"⚖️ <b>{best_match['weight']}</b> par unité.<br/><br/>"
                        f"Vous pouvez consulter la fiche complète <a href='/products/{best_match['slug']}' class='text-[#006680] underline font-bold'>ici</a>."
                    )
                }
            elif is_asking_storage and best_match.get("storage_conditions"):
                return {
                    "response": (
                        f"Les conditions de conservation pour <b>{best_match['name']}</b> sont :<br/>"
                        f"❄️ À conserver à <b>{best_match['storage_conditions']}</b>.<br/><br/>"
                        f"Vous pouvez consulter la fiche complète <a href='/products/{best_match['slug']}' class='text-[#006680] underline font-bold'>ici</a>."
                    )
                }
            elif is_asking_certificate and best_match.get("certificate"):
                return {
                    "response": (
                        f"Le certificat pour <b>{best_match['name']}</b> est :<br/>"
                        f"📜 <b>{best_match['certificate']}</b>.<br/><br/>"
                        f"Vous pouvez consulter la fiche complète <a href='/products/{best_match['slug']}' class='text-[#006680] underline font-bold'>ici</a>."
                    )
                }
            elif is_asking_desc and best_match.get("description"):
                return {
                    "response": (
                        f"Voici la description de <b>{best_match['name']}</b> :<br/>"
                        f"📝 <i>\"{best_match['description']}\"</i>.<br/><br/>"
                        f"Vous pouvez consulter la fiche complète <a href='/products/{best_match['slug']}' class='text-[#006680] underline font-bold'>ici</a>."
                    )
                }

            # Sinon, retour de la liste générale des correspondances de façon simple et épurée
            names_list = ", ".join([f"<b>{p['name']}</b>" for p in matched_products])
            if lang == "tr":
                return {
                    "response": f"Evet ! Stoklarımızda bu ürünler mevcuttur: {names_list}. Detaylar için kataloğumuza göz atabilirsiniz !"
                }
            else:
                return {
                    "response": f"Oui ! Nous proposons ces produits en stock : {names_list}. Vous pouvez les retrouver directement dans notre catalogue !"
                }
            
    # 2. Sinon, classification par intention sémantique standard (Cosine Similarity)
    user_tokens = clean_and_tokenize(message_raw)
    if not user_tokens:
        if lang == "tr":
            return {"response": "Sizi dinliyorum! Lütfen bana bir soru sorun."}
        else:
            return {"response": "Je vous écoute ! N'hésitez pas à me poser une question."}
        
    user_vector = vectorize(user_tokens)
    
    best_intent = None
    best_score = 0.0
    
    for intent_name, data in INTENT_DATA.items():
        for phrase in data["phrases"]:
            phrase_tokens = clean_and_tokenize(phrase)
            phrase_vector = vectorize(phrase_tokens)
            score = get_cosine_similarity(user_vector, phrase_vector)
            if score > best_score:
                best_score = score
                best_intent = intent_name

    # Seuil de correspondance de similarité sémantique (20% minimum)
    if best_intent and best_score >= 0.20:
        if lang == "tr":
            return {"response": INTENT_DATA_TR[best_intent]["response"]}
        else:
            return {"response": INTENT_DATA[best_intent]["response"]}
        
    # Message d'incompréhension détaillé
    if lang == "tr":
        return {
            "response": (
                "Üzgünüm, sorunuzu tam olarak anlayamadım. 😅<br/><br/>"
                "Bana <b>ürün stoklarımız</b>, <b>teslimat koşullarımız (24h/7j)</b>, "
                "<b>iletişim bilgilerimiz</b> veya <b>fiyat teklifi</b> talepleri hakkında sorular sorabilirsiniz.<br/><br/>"
                "Sorunuzu farklı kelimelerle tekrar yazabilir misiniz?"
            )
        }
    else:
        return {
            "response": (
                "Désolé, je n'ai pas bien saisi votre demande. 😅<br/><br/>"
                "Je suis programmé pour répondre sur nos <b>produits en stock</b>, nos <b>zones de livraison 24h/7j</b>, "
                "nos <b>moyens de contact</b> ou nos demandes de <b>devis</b>.<br/><br/>"
                "Pouvez-vous reformuler votre question ?"
            )
        }
