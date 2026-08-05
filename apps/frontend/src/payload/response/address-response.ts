export type ApiAdresseFeature = {
  properties: {
    label: string;
  };
  geometry: {
    coordinates: [number, number];
  };
};

export type ApiAdresseResponse = {
  features: ApiAdresseFeature[];
};
