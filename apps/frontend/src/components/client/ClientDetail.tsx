"use client";

import { Client } from "@/models/client.model";
import { searchAddress } from "@/services/address.service";
import { getAllClients } from "@/services/client.service";
import { Eye, Map, MapPin, Navigation, Pencil, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CreateAppointmentDialog from "../appointment/CreateAppointmentDialog";
import CreateBlockingPeriodDialog from "../blocking-period/CreateBlockingPeriodDialog";
import UpdateOpeningHoursDialog from "../opening-hour/UpdateOpeningHoursDialog";
import CreateTaskDialog from "../task/CreateTaskDialog";
import UpdateClientDialog from "./UpdateClientDialog";
import UpdateColorDialog from "./UpdateColorDialog";

function formatTime(time: string) {
  // time format "HH:mm:ss" -> on garde "HH:mm"
  return time ? time.slice(0, 5) : "";
}

function formatOpeningHours(opening_hours: Client["openingHours"]) {
  if (!opening_hours) return {};

  const joursFrancais: Record<string, string> = {
    MONDAY: "lundi",
    TUESDAY: "mardi",
    WEDNESDAY: "mercredi",
    THURSDAY: "jeudi",
    FRIDAY: "vendredi",
    SATURDAY: "samedi",
    SUNDAY: "dimanche",
  };

  const result: Partial<Record<string, string>> = {};

  Object.values(joursFrancais).forEach((jour) => {
    result[jour] = "-";
  });

  opening_hours.forEach(({ dayOfWeek, openTime, closeTime }) => {
    const jour = joursFrancais[dayOfWeek];
    if (!jour) return;

    if (openTime && closeTime) {
      // Utiliser la fonction pour couper les secondes
      result[jour] = `${formatTime(openTime)} - ${formatTime(closeTime)}`;
    } else {
      result[jour] = "-";
    }
  });

  return result;
}

const ClientDetail: React.FC = () => {
  const params = useParams();
  const clientId = Number(params.id);

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  useEffect(() => {
    if (client?.address) {
      searchAddress(client.address)
        .then((results) => {
          if (results.length > 0) {
            setCoords({ lat: results[0].lat, lon: results[0].lon });
          }
        })
        .catch((err) => {
          console.error("Erreur géocodage:", err);
        });
    }
  }, [client]);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const clients = await getAllClients();
        const foundClient = clients.find((c) => c.id === clientId);

        if (!foundClient) {
          setError("Client non trouvé");
          return;
        }

        setClient(foundClient);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors du chargement"
        );
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchClient();
    }
  }, [clientId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-red-600">
          {error || "Client non trouvé"}
        </div>
      </div>
    );
  }

  const InfoSection: React.FC<{
    title: string;
    children: React.ReactNode;
    actionIcon?: React.ReactNode;
    onActionClick?: () => void;
    className?: string;
  }> = ({ title, children, actionIcon, onActionClick, className = "" }) => (
    <div className={`bg-white rounded-sm shadow-sm ${className}`}>
      <div className="text-[#006680] border-b border-[#dfca70] px-4 py-2 font-medium text-sm flex items-center justify-between">
        {title}
        {actionIcon && (
          <button
            onClick={onActionClick}
            aria-label="Action"
            className="cursor-pointer rounded p-0.5"
          >
            {actionIcon}
          </button>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <UpdateClientDialog
        client={client}
        open={isUpdateDialogOpen}
        onOpenChange={(open) => {
          setIsUpdateDialogOpen(open);
          if (!open) {
            getAllClients().then((clients) => {
              const updatedClient = clients.find((c) => c.id === client.id);
              if (updatedClient) setClient(updatedClient);
            });
          }
        }}
      />
      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Nom/Adresse/Symbole */}
            <InfoSection
              title="NOM / ADRESSE / SYMBOLE"
              actionIcon={<Pencil className="hover:text-[#dfca70]" />}
              onActionClick={() => setIsUpdateDialogOpen(true)}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{client.name}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    {client.address}
                  </span>
                </div>
              </div>
              <div className="flex justify-center gap-8 mt-6 pt-4 border-t border-gray-200">
                <Link
                  href="/dashboard/clients/map"
                  className="flex flex-col items-center gap-2 cursor-pointer hover:text-[#dfca70] p-2"
                >
                  <Map />
                  <span className="text-xs">Carte</span>
                </Link>
                <Link
                  href={
                    coords
                      ? `https://www.waze.com/fr/live-map/directions?navigate=yes&to=ll.${coords.lat}%2C${coords.lon}`
                      : "https://www.waze.com/fr/live-map"
                  }
                  className="flex flex-col items-center gap-2 cursor-pointer hover:text-[#dfca70] p-2"
                >
                  <Navigation />
                  <span className="text-xs">Navigation</span>
                </Link>
                <UpdateColorDialog client={client} />
              </div>
            </InfoSection>

            {/* Informations Générales */}
            <InfoSection
              title="INFORMATIONS GÉNÉRALES"
              actionIcon={<Pencil className="hover:text-[#dfca70]" />}
              onActionClick={() => setIsUpdateDialogOpen(true)}
            >
              <div className="text-sm text-gray-600">
                <div className="flex flex-col">
                  {client.manager ||
                  client.email ||
                  client.phone ||
                  client.phone2 ||
                  client.landline_phone ||
                  client.main_contact ||
                  client.accountant ||
                  client.accountant_phone ||
                  client.commercial ||
                  client.note ? (
                    <>
                      {client.manager && (
                        <span className="font-medium">
                          Gérant : {client.manager}
                        </span>
                      )}
                      {client.email && (
                        <Link
                          href={`mailto:${client.email}`}
                          className="font-medium"
                        >
                          Email : {client.email}
                        </Link>
                      )}
                      {client.phone && (
                        <Link
                          href={`tel:${client.phone}`}
                          className="font-medium"
                        >
                          Téléphone : {client.phone}
                        </Link>
                      )}
                      {client.phone2 && (
                        <Link
                          href={`tel:${client.phone2}`}
                          className="font-medium"
                        >
                          Téléphone 2 : {client.phone2}
                        </Link>
                      )}
                      {client.landline_phone && (
                        <Link
                          href={`tel:${client.landline_phone}`}
                          className="font-medium"
                        >
                          Téléphone Fixe : {client.landline_phone}
                        </Link>
                      )}
                      {client.main_contact && (
                        <span className="font-medium">
                          Contact Principal : {client.main_contact}
                        </span>
                      )}
                      {client.accountant && (
                        <span className="font-medium">
                          Comptable : {client.accountant}
                        </span>
                      )}
                      {client.accountant_phone && (
                        <span className="font-medium">
                          Téléphone Comptable : {client.accountant_phone}
                        </span>
                      )}
                      {client.commercial && (
                        <span className="font-medium">
                          Commercial : {client.commercial}
                        </span>
                      )}
                      {client.note && (
                        <span className="font-medium">
                          Note : {client.note}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-500">Aucun</span>
                  )}
                </div>
              </div>
            </InfoSection>
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            {/* Rendez-vous à venir */}
            <InfoSection
              title="RENDEZ-VOUS À VENIR"
              actionIcon={
                <Link href={"/dashboard/appointments"}>
                  <Eye />
                </Link>
              }
            >
              <div className="flex justify-center gap-4">
                {/* Ici on met directement le bouton du CreateAppointmentDialog */}
                <CreateAppointmentDialog
                  clientId={client.id}
                  onAppointmentCreated={() => {
                    alert("Rendez-vous créé !");
                  }}
                />
              </div>
            </InfoSection>

            {/* Tâches */}
            <InfoSection
              title="TÂCHES"
              actionIcon={
                <Link href={"/dashboard/tasks"}>
                  <Eye />
                </Link>
              }
            >
              <div className="flex justify-center">
                {/* Ici on met directement le bouton du CreateTaskDialog */}
                <CreateTaskDialog
                  clientId={client.id}
                  onTaskCreated={() => {
                    alert("Tâche créée !");
                  }}
                />
              </div>
            </InfoSection>

            <InfoSection
              title="PERIODES DE BLOCAGE"
              actionIcon={
                <Link href={"/dashboard/blocking-periods"}>
                  <Eye />
                </Link>
              }
            >
              <div className="flex justify-center">
                <CreateBlockingPeriodDialog
                  clientId={client.id}
                  onBlockingPeriodCreated={() => {
                    alert("Tâche créée !");
                  }}
                />
              </div>
            </InfoSection>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Heures d'ouverture */}
            <InfoSection
              title="HEURES D'OUVERTURE"
              actionIcon={
                <UpdateOpeningHoursDialog
                  clientId={client.id}
                  onHoursUpdated={() => {
                    getAllClients().then((clients) => {
                      const updatedClient = clients.find(
                        (c) => c.id === client.id
                      );
                      if (updatedClient) setClient(updatedClient);
                    });
                  }}
                />
              }
            >
              <div className="space-y-2 text-sm">
                {Object.entries(formatOpeningHours(client.openingHours)).map(
                  ([jour, horaires]) => (
                    <div
                      key={jour}
                      className="flex justify-between items-center"
                    >
                      <span className="font-medium capitalize">{jour} :</span>
                      <span className="text-gray-600">{horaires}</span>
                    </div>
                  )
                )}
              </div>
            </InfoSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
