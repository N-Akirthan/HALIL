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
          Politique de Confidentialité
        </h1>

        <p className="mb-4">
          Chez <strong>HALIL</strong>, nous attachons une grande importance à la
          protection des données personnelles de nos clients, partenaires et
          visiteurs. Cette politique de confidentialité explique quelles
          informations nous collectons, comment nous les utilisons et les
          mesures mises en place pour les protéger.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          1. Collecte des informations
        </h2>
        <p className="mb-4">
          Nous collectons uniquement les informations nécessaires au bon
          fonctionnement de notre activité de grossiste alimentaire, notamment :
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Données d’identification (nom, prénom, raison sociale)</li>
          <li>Coordonnées de contact (email, téléphone, adresse)</li>
          <li>Informations de commande et de facturation</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          2. Utilisation des informations
        </h2>
        <p className="mb-4">Les données collectées sont utilisées pour :</p>
        <ul className="list-disc list-inside mb-4">
          <li>Assurer le traitement des commandes et livraisons</li>
          <li>Gérer la relation client et le support</li>
          <li>
            Communiquer des informations commerciales ou promotionnelles (si
            consentement)
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          3. Protection des données
        </h2>
        <p className="mb-4">
          Nous mettons en œuvre des mesures de sécurité techniques et
          organisationnelles afin de protéger vos données contre tout accès non
          autorisé, perte, divulgation ou modification.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          4. Partage des informations
        </h2>
        <p className="mb-4">
          Vos données ne sont jamais vendues à des tiers. Elles peuvent être
          transmises uniquement à des prestataires de services intervenant dans
          le cadre de nos activités (ex : transporteurs, services de paiement),
          et uniquement dans la mesure nécessaire à l’exécution de leurs
          missions.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          5. Durée de conservation
        </h2>
        <p className="mb-4">
          Les données personnelles sont conservées pendant la durée nécessaire à
          la réalisation des finalités mentionnées ci-dessus et conformément aux
          obligations légales en vigueur.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Vos droits</h2>
        <p className="mb-4">
          Conformément au Règlement Général sur la Protection des Données
          (RGPD), vous disposez des droits suivants :
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            Droit d’accès, de rectification et de suppression de vos données
          </li>
          <li>Droit d’opposition au traitement de vos informations</li>
          <li>Droit à la portabilité des données</li>
        </ul>
        <p className="mb-4">
          Pour exercer ces droits, vous pouvez nous contacter à l’adresse
          suivante :
          <strong> sasuhalill@gmail.com</strong>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          7. Modifications de la politique
        </h2>
        <p className="mb-4">
          Nous nous réservons le droit de modifier la présente politique de
          confidentialité à tout moment. Toute modification sera publiée sur
          cette page.
        </p>
      </main>

      <Footer />
    </div>
  );
}
