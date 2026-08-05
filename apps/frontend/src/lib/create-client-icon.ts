import { Client } from "@/models/client.model";

export const createClientIcon = async (client: Client) => {
  const L = await import("leaflet");

  const color = client.color || "#000";

  const width = 100; // largeur du bloc
  const height = 40; // hauteur du bloc
  const triangleHeight = 6; // hauteur du triangle

  const html = `
    <div style="
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      display: inline-block;
      background: ${color};
      color: white;
      padding: 4px 8px;
      font-size: 12px;
      font-weight: bold;
      border-radius: 4px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      white-space: nowrap;
    ">
      ${client.name}
      <div style="
        content: '';
        position: absolute;
        bottom: -${triangleHeight}px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: ${triangleHeight}px solid transparent;
        border-right: ${triangleHeight}px solid transparent;
        border-top: ${triangleHeight}px solid ${color};
      "></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: "",
    iconSize: [width, height + triangleHeight], // bloc + triangle
    iconAnchor: [width / 2, height + triangleHeight], // pointe = ancre exacte
    popupAnchor: [0, -height - triangleHeight], // popup juste au-dessus
  });
};
