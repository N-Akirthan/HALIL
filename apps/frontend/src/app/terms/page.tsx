import AdBar from "@/components/adbar";
import { Footer } from "@/components/footer-section";
import { Navbar } from "@/components/navbar";

export default function Page() {
  return (
    <div>
      <AdBar />
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">
          Conditions d&apos;utilisation
        </h1>

        <p className="mb-4">
          Les présentes conditions d&apos;utilisation (ci-après «{" "}
          <strong>CGU</strong> ») régissent l&apos;accès et l&apos;utilisation
          du site vitrine exploité par <strong>HALIL</strong>, grossiste
          alimentaire B2B, dont le siège social est situé au{" "}
          <strong>25 RUE DU CHATEAU LANDON 75010 PARIS</strong>, immatriculée au
          RCS sous le n° <strong>810214056/81021405600014</strong> (ci-après «{" "}
          <strong>Nous</strong> »).
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Objet du site</h2>
        <p className="mb-4">
          Le site a pour objet de présenter notre catalogue, nos services et de
          permettre la prise de contact commerciale. Sauf mention contraire, les
          ventes s&apos;adressent exclusivement à une clientèle professionnelle
          (<strong>B2B</strong>). Aucune vente au détail au grand public
          n&apos;est réalisée via ce site.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          2. Acceptation des CGU
        </h2>
        <p className="mb-4">
          L&apos;accès et l&apos;utilisation du site impliquent
          l&apos;acceptation sans réserve des présentes CGU et de notre{" "}
          <a href="/privacy" className="underline">
            Politique de confidentialité
          </a>
          . Si vous n&apos;acceptez pas ces termes, veuillez ne pas utiliser le
          site.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Accès au site</h2>
        <p className="mb-4">
          Le site est accessible 24h/24 et 7j/7, sauf cas de force majeure,
          pannes ou opérations de maintenance. Nous nous réservons le droit
          d&apos;interrompre temporairement l&apos;accès pour toute raison
          technique ou organisationnelle.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          4. Comptes et espaces professionnels
        </h2>
        <p className="mb-4">
          Certains espaces peuvent nécessiter la création d&apos;un compte. Vous
          êtes responsable de la confidentialité de vos identifiants et de
          toutes les activités effectuées sous votre compte. Nous pouvons
          suspendre ou supprimer un compte en cas d&apos;utilisation frauduleuse
          ou non conforme aux CGU.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          5. Informations produits et allergènes
        </h2>
        <p className="mb-4">
          Les informations produits (ingrédients, allergènes, origines, photos)
          sont fournies à titre indicatif et peuvent évoluer. Les fiches
          techniques et étiquetages fournis lors des livraisons prévalent. Il
          vous appartient de vérifier la conformité aux usages professionnels et
          aux exigences de votre activité (ex. restauration collective, revente,
          etc.).
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          6. Prix, devis et commandes
        </h2>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>
            Les prix affichés sur le site sont indicatifs et non contractuels,
            hors taxes et hors frais de livraison, sauf mention contraire.
          </li>
          <li>
            Les commandes sont soumises à acceptation expresse (devis, bon de
            commande, conditions commerciales particulières). Des minimums de
            commande et contraintes logistiques peuvent s&apos;appliquer (
            <strong>[ex.: franco à partir de X € HT]</strong>).
          </li>
          <li>
            Les disponibilités produits peuvent varier selon la saisonnalité et
            les approvisionnements.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          7. Paiement et facturation
        </h2>
        <p className="mb-4">
          Les modalités de paiement (virement, LCR, conditions de règlement)
          sont précisées dans nos devis/contrats. En cas de retard de paiement,
          des pénalités légales et une indemnité de recouvrement peuvent être
          appliquées conformément au Code de commerce.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          8. Livraisons et réserves
        </h2>
        <p className="mb-4">
          Les délais de livraison sont indicatifs. Le transfert des risques
          intervient à la remise des marchandises. Il vous appartient
          d&apos;émettre toutes réserves précises et motivées auprès du
          transporteur lors de la réception, conformément aux usages et délais
          applicables.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          9. Propriété intellectuelle
        </h2>
        <p className="mb-4">
          Tous les éléments du site (textes, marques, logos, photos, visuels,
          structure) sont protégés par le droit de la propriété intellectuelle.
          Toute reproduction, représentation, adaptation ou exploitation non
          autorisée est interdite.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          10. Contenus fournis par l&apos;utilisateur
        </h2>
        <p className="mb-4">
          Vous vous engagez à ne pas transmettre de contenus illicites,
          diffamatoires, contrefaisants ou nuisibles. Vous garantissez disposer
          de tous les droits nécessaires sur les contenus transmis (avis, logos,
          photos), et nous concédez une licence non exclusive pour les besoins
          de l&apos;exploitation du site.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          11. Liens et ressources tiers
        </h2>
        <p className="mb-4">
          Le site peut contenir des liens vers des sites tiers. Nous
          n&apos;exerçons aucun contrôle sur ces ressources et déclinons toute
          responsabilité quant à leur contenu ou leurs pratiques.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          12. Données personnelles et cookies
        </h2>
        <p className="mb-4">
          Pour toute information sur le traitement des données et l&apos;usage
          des cookies (y compris le bandeau de consentement), veuillez consulter
          notre{" "}
          <a href="/privacy" className="underline">
            Politique de confidentialité
          </a>
          .
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">13. Responsabilité</h2>
        <p className="mb-4">
          Nous mettons tout en œuvre pour assurer l&apos;exactitude des
          informations. Toutefois, le site est fourni « en l&apos;état ». Nous
          ne saurions être tenus responsables des dommages indirects, pertes de
          profit, interruptions d&apos;activité ou impossibilités d&apos;accès
          au site.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">14. Force majeure</h2>
        <p className="mb-4">
          Notre responsabilité ne saurait être engagée en cas de manquement
          résultant d&apos;un événement de force majeure tel que défini par la
          loi et la jurisprudence françaises (ex. catastrophes naturelles,
          grèves, pannes réseau, crise d&apos;approvisionnement).
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          15. Modifications des CGU
        </h2>
        <p className="mb-4">
          Nous pouvons modifier les présentes CGU à tout moment. Les versions
          mises à jour sont publiées sur cette page avec mention de la date.
          L&apos;utilisation du site après modification vaut acceptation des
          nouvelles CGU.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          16. Droit applicable et juridiction
        </h2>
        <p className="mb-4">
          Les présentes CGU sont soumises au droit français. Tout litige relatif
          à leur exécution ou interprétation sera soumis aux tribunaux
          compétents du ressort de <strong>Paris</strong>, sous réserve des
          règles de compétence impératives.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
        <p className="mb-4">
          Pour toute question relative aux présentes CGU, vous pouvez nous
          écrire à :<strong> sasuhalill@gmail.com</strong> ou nous joindre au{" "}
          <strong>06 20 35 76 67</strong>.
        </p>
      </main>

      <Footer />
    </div>
  );
}
