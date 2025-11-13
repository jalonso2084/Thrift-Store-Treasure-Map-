
export interface ThriftStore {
  storeName: string;
  summary: string;
  keyThemes: string[];
  mapsUrl?: string;
  mapsTitle?: string;
}

export interface GroundingChunk {
  maps: {
    uri: string;
    title: string;
  };
}
