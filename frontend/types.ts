export interface LayerMetadata {
  layer_name: string;
  site: 'A' | 'C';
  year: number;
  parameter: 'HTL' | 'LTL' | 'CRZ' | 'SEA' | 'CREEK' | 'Boundary';
  geometry: 'LineString' | 'Polygon';
  crs: string;
  source: string;
  description: string;
}

export interface FilterState {
  site: string;
  year: string;
  parameter: string;
  search: string;
}

export const SITES = ['A', 'C'];
export const YEARS = ['2011', '2019'];
export const PARAMETERS = ['HTL', 'LTL', 'CRZ', 'SEA', 'CREEK', 'Boundary'];
