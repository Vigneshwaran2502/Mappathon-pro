import { LayerMetadata, FilterState } from '../types';

// Embedded metadata to replace backend dependency for prototype preview
const MOCK_METADATA: LayerMetadata[] = [
  {
    "layer_name": "SiteA_2011_HTL",
    "site": "A",
    "year": 2011,
    "parameter": "HTL",
    "geometry": "LineString",
    "crs": "EPSG:32643",
    "source": "NCSCM / Hackathon Dataset",
    "description": "High Tide Line for Site A (2011). Delineates the landward limit of the highest tide."
  },
  {
    "layer_name": "SiteA_2011_LTL",
    "site": "A",
    "year": 2011,
    "parameter": "LTL",
    "geometry": "LineString",
    "crs": "EPSG:32643",
    "source": "NCSCM / Hackathon Dataset",
    "description": "Low Tide Line for Site A (2011). Delineates the seaward limit of the tide."
  },
  {
    "layer_name": "SiteA_2011_CRZ",
    "site": "A",
    "year": 2011,
    "parameter": "CRZ",
    "geometry": "Polygon",
    "crs": "EPSG:32643",
    "source": "NCSCM / Hackathon Dataset",
    "description": "Coastal Regulation Zone boundary for Site A (2011)."
  },
  {
    "layer_name": "SiteA_2019_HTL",
    "site": "A",
    "year": 2019,
    "parameter": "HTL",
    "geometry": "LineString",
    "crs": "EPSG:32643",
    "source": "NCSCM / Hackathon Dataset",
    "description": "High Tide Line for Site A (2019). Updated based on recent satellite imagery."
  },
  {
    "layer_name": "SiteA_2019_CRZ",
    "site": "A",
    "year": 2019,
    "parameter": "CRZ",
    "geometry": "Polygon",
    "crs": "EPSG:32643",
    "source": "NCSCM / Hackathon Dataset",
    "description": "Coastal Regulation Zone boundary for Site A (2019)."
  },
  {
    "layer_name": "SiteA_2019_SEA",
    "site": "A",
    "year": 2019,
    "parameter": "SEA",
    "geometry": "Polygon",
    "crs": "EPSG:32643",
    "source": "NCSCM / Hackathon Dataset",
    "description": "Sea classification area for Site A (2019)."
  },
  {
    "layer_name": "SiteA_2019_CREEK",
    "site": "A",
    "year": 2019,
    "parameter": "CREEK",
    "geometry": "Polygon",
    "crs": "EPSG:32643",
    "source": "NCSCM / Hackathon Dataset",
    "description": "Creek water body demarcation for Site A (2019)."
  },
  {
    "layer_name": "SiteC_2011_HTL",
    "site": "C",
    "year": 2011,
    "parameter": "HTL",
    "geometry": "LineString",
    "crs": "EPSG:32643",
    "source": "NCSCM / Hackathon Dataset",
    "description": "High Tide Line for Site C (2011)."
  },
  {
    "layer_name": "SiteC_2011_LTL",
    "site": "C",
    "year": 2011,
    "parameter": "LTL",
    "geometry": "LineString",
    "crs": "EPSG:32643",
    "source": "NCSCM / Hackathon Dataset",
    "description": "Low Tide Line for Site C (2011)."
  },
  {
    "layer_name": "SiteC_2011_CRZ",
    "site": "C",
    "year": 2011,
    "parameter": "CRZ",
    "geometry": "Polygon",
    "crs": "EPSG:32643",
    "source": "NCSCM / Hackathon Dataset",
    "description": "Coastal Regulation Zone for Site C (2011)."
  },
  {
    "layer_name": "SiteC_2019_HTL",
    "site": "C",
    "year": 2019,
    "parameter": "HTL",
    "geometry": "LineString",
    "crs": "EPSG:32643",
    "source": "NCSCM / Hackathon Dataset",
    "description": "High Tide Line for Site C (2019)."
  },
  {
    "layer_name": "SiteC_2019_LTL",
    "site": "C",
    "year": 2019,
    "parameter": "LTL",
    "geometry": "LineString",
    "crs": "EPSG:32643",
    "source": "NCSCM / Hackathon Dataset",
    "description": "Low Tide Line for Site C (2019)."
  },
  {
    "layer_name": "SiteC_2019_CRZ",
    "site": "C",
    "year": 2019,
    "parameter": "CRZ",
    "geometry": "Polygon",
    "crs": "EPSG:32643",
    "source": "NCSCM / Hackathon Dataset",
    "description": "Coastal Regulation Zone for Site C (2019)."
  },
  {
    "layer_name": "SiteC_2019_SEA",
    "site": "C",
    "year": 2019,
    "parameter": "SEA",
    "geometry": "Polygon",
    "crs": "EPSG:32643",
    "source": "NCSCM / Hackathon Dataset",
    "description": "Sea area for Site C (2019)."
  },
  {
    "layer_name": "SiteC_2019_CREEK",
    "site": "C",
    "year": 2019,
    "parameter": "CREEK",
    "geometry": "Polygon",
    "crs": "EPSG:32643",
    "source": "NCSCM / Hackathon Dataset",
    "description": "Creek area for Site C (2019)."
  },
  {
    "layer_name": "Site1_Boundary",
    "site": "C",
    "year": 2019,
    "parameter": "Boundary",
    "geometry": "Polygon",
    "crs": "EPSG:32643",
    "source": "NCSCM / Hackathon Dataset",
    "description": "Administrative Boundary for Site C."
  },
  {
    "layer_name": "Site2_Boundary",
    "site": "A",
    "year": 2019,
    "parameter": "Boundary",
    "geometry": "Polygon",
    "crs": "EPSG:32643",
    "source": "NCSCM / Hackathon Dataset",
    "description": "Administrative Boundary for Site A."
  }
];

// Helper to generate mock coordinate based on site and type
const generateMockGeoJSON = (layerName: string, site: string, geometryType: string, offset: number) => {
  // Approximate Mumbai coordinates for Site A, slightly shifted for Site C
  const baseLat = site === 'A' ? 19.0760 : 19.2000;
  const baseLng = site === 'A' ? 72.8777 : 72.9781;
  
  // Use offset to differentiate years slightly to visualize change
  const shift = offset * 0.001; 

  if (geometryType === 'LineString') {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: layerName },
          geometry: {
            type: "LineString",
            coordinates: [
              [baseLng + shift, baseLat],
              [baseLng + 0.01 + shift, baseLat + 0.01],
              [baseLng + 0.02 + shift, baseLat - 0.01],
              [baseLng + 0.03 + shift, baseLat + 0.02]
            ]
          }
        }
      ]
    };
  } else {
    // Polygon
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: layerName },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [baseLng + shift, baseLat],
              [baseLng + 0.01 + shift, baseLat],
              [baseLng + 0.01 + shift, baseLat + 0.01],
              [baseLng + shift, baseLat + 0.01],
              [baseLng + shift, baseLat]
            ]]
          }
        }
      ]
    };
  }
};

export const fetchMetadata = async (filters: FilterState): Promise<LayerMetadata[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));

  let metadata = MOCK_METADATA;

  if (filters.site) {
    metadata = metadata.filter((m) => m.site === filters.site);
  }
  if (filters.year) {
    metadata = metadata.filter((m) => m.year.toString() === filters.year);
  }
  if (filters.parameter) {
    metadata = metadata.filter((m) => m.parameter === filters.parameter);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    metadata = metadata.filter((m) => m.layer_name.toLowerCase().includes(q));
  }

  return metadata;
};

export const fetchGeoJSON = async (layerName: string): Promise<any> => {
   // Simulate network delay
   await new Promise(resolve => setTimeout(resolve, 300));
  
   const metadata = MOCK_METADATA.find((m) => m.layer_name === layerName);

  if (!metadata) {
    throw new Error("Layer not found");
  }

  // Simulate change between 2011 and 2019
  const yearOffset = metadata.year === 2019 ? 2 : 0;
  const geoData = generateMockGeoJSON(layerName, metadata.site, metadata.geometry, yearOffset);

  return geoData;
};
