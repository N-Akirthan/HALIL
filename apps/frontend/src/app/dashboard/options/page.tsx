"use client";

import AddressDialog from "@/components/user/AddressDialog";
import UpdatePasswordDialog from "@/components/user/UpdatePasswordDialog";
import UpdateWorkingHoursDialog from "@/components/working-hours/UpdateWorkingHoursDialog";
import { useAuth } from "@/context/AuthContext";

interface MenuSectionProps {
  title: string;
  items: string[];
  bgColor?: string;
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth(); // utilisateur courant
  if (!user) return null; // ou un loader
  const mesParametres = [
    "Horaires de travail",
    "Domicile",
    "Changer mot de passe",
  ];

  const parametresVisites = ["Heures d'ouverture"];
  const portatour = ["A propos de"];

  const MenuSection: React.FC<MenuSectionProps> = ({
    title,
    items,
    bgColor = "[#dfca70]",
  }) => (
    <div className="bg-white rounded-sm shadow-sm">
      <div
        className={`${bgColor} text-white px-4 py-2 font-medium text-sm rounded-t-sm`}
      >
        {title}
      </div>
      <div className="p-0">
        {items.map((item, index) => {
          // Cas spécial pour les dialogues
          if (item === "Horaires de travail") {
            return (
              <UpdateWorkingHoursDialog
                key={index}
                user={user}
                onHoursUpdated={() => console.log("Horaires mis à jour")}
              />
            );
          }

          if (item === "Changer mot de passe") {
            return (
              <UpdatePasswordDialog
                key={index}
                userId={user.id}
                onPasswordChanged={() => console.log("Mot de passe changé")}
              />
            );
          }

          if (item === "Domicile") {
            return (
              <AddressDialog
                key={index}
                address={"65 Rue Blaise Pascal, 93600 Aulnay-sous-Bois"}
              />
            );
          }

          // Cas général : simple texte
          return (
            <div
              key={index}
              className="flex items-center px-4 py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
            >
              <span className="text-blue-600 text-sm cursor-pointer hover:underline">
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Mes Paramètres */}
          <div>
            <MenuSection
              title="MES PARAMÈTRES"
              items={mesParametres}
              bgColor="bg-[#dfca70]"
            />
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            <MenuSection
              title="PARAMÈTRES DE VISITES"
              items={parametresVisites}
              bgColor="bg-[#dfca70]"
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <MenuSection
              title="PORTATOUR"
              items={portatour}
              bgColor="bg-[#dfca70]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
