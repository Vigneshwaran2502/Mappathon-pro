import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Load Metadata
const metadataPath = path.join(__dirname, 'metadata.json');
const getMetadata = () => {
  const data = fs.readFileSync(metadataPath, 'utf8');
  return JSON.parse(data);
};

// API: Get all layers (names only)
app.get('/api/layers', (req, res) => {
  const metadata = getMetadata();
  const layers = metadata.map((m: any) => m.layer_name);
  res.json(layers);
});

// API: Get Metadata with filtering
app.get('/api/metadata', (req, res) => {
  let metadata = getMetadata();
  const { site, year, parameter, query } = req.query;

  if (site) {
    metadata = metadata.filter((m: any) => m.site === site);
  }
  if (year) {
    metadata = metadata.filter((m: any) => m.year.toString() === year);
  }
  if (parameter) {
    metadata = metadata.filter((m: any) => m.parameter === parameter);
  }
  if (query) {
    const q = (query as string).toLowerCase();
    metadata = metadata.filter((m: any) => m.layer_name.toLowerCase().includes(q));
  }

  res.json(metadata);
});

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

// API: Serve GeoJSON
// NOTE: In a real app, this would read from /data/geojson/FILE.geojson
// Here we generate it on the fly for the prototype to ensure visuals work without binary files
app.get('/api/geojson/:layer', (req, res) => {
  const layerName = req.params.layer;
  const metadata = getMetadata().find((m: any) => m.layer_name === layerName);

  if (!metadata) {
    return res.status(404).json({ error: "Layer not found" });
  }

  // Simulate change between 2011 and 2019
  const yearOffset = metadata.year === 2019 ? 2 : 0;
  const geoData = generateMockGeoJSON(layerName, metadata.site, metadata.geometry, yearOffset);

  res.json(geoData);
});

app.listen(PORT, () => {
  console.log(`Coastal Backend running on http://localhost:${PORT}`);
});
