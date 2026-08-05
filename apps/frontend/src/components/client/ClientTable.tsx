import { Client } from "@/models/client.model";
import { columns } from "./columns";
import { DataTable } from "./data-table";

type Props = {
  clients: Client[];
  onClientUpdated?: () => void;
};

export default function ClientTable({ clients, onClientUpdated }: Props) {
  // Plus besoin d'état clients ni loading ici, on gère tout côté parent

  // Afficher un message si pas de clients
  if (!clients.length)
    return <p className="text-sm text-gray-500 p-2">Aucun client trouvé.</p>;

  // On pourrait ajouter un spinner via prop si besoin, mais ici on suppose que parent gère loading

  return (
    <div className="px-2">
      {/* columns reçoit handleClientUpdated pour actions sur les lignes */}
      <DataTable<Client, unknown>
        columns={columns(onClientUpdated)}
        data={clients}
      />
    </div>
  );
}
