import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MapData } from './components/MapData';
import { MetadataPanel } from './components/MetadataPanel';
import { LayerMetadata, FilterState } from './types';
import { fetchMetadata } from './services/api';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    site: '',
    year: '',
    parameter: '',
    search: ''
  });

  const [availableLayers, setAvailableLayers] = useState<LayerMetadata[]>([]);
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const [selectedMetadata, setSelectedMetadata] = useState<LayerMetadata | null>(null);

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch layers when filters change
  useEffect(() => {
    fetchMetadata(filters)
      .then(data => {
        setAvailableLayers(data);
        // Clean up active layers that are no longer available in the filtered list
        // Note: For "Compare" functionality, we might want to keep them, but for strict filtering:
        // const availableNames = data.map(d => d.layer_name);
        // setActiveLayers(prev => prev.filter(n => availableNames.includes(n)));
      })
      .catch(console.error);
  }, [filters]);

  const toggleLayer = (layerName: string) => {
    setActiveLayers(prev => 
      prev.includes(layerName) 
        ? prev.filter(n => n !== layerName) 
        : [...prev, layerName]
    );
  };

  const handleCompareHTL = () => {
    // Logic: If a site is selected, active HTL for both 2011 and 2019
    const targetSite = filters.site || 'A'; // Default to A if none selected
    
    // Set filters to allow seeing both years
    setFilters({
      site: targetSite,
      year: '', // clear year to show both
      parameter: 'HTL',
      search: ''
    });

    // Auto-select the layers
    // We need to fetch specific names based on logic or wait for next render. 
    // For prototype speed, we predict names based on naming convention
    const layersToActivate = [
      `Site${targetSite}_2011_HTL`,
      `Site${targetSite}_2019_HTL`
    ];
    setActiveLayers(layersToActivate);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100">
      
      {/* Sidebar */}
      <Sidebar 
        filters={filters} 
        setFilters={setFilters}
        availableLayers={availableLayers}
        activeLayers={activeLayers}
        toggleLayer={toggleLayer}
        onCompareHTL={handleCompareHTL}
        onLayerClick={setSelectedMetadata}
      />

      {/* Main Content */}
      <div className="flex-1 relative flex flex-col">
        
        {/* Top Bar (Dark Mode Toggle) */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md text-gray-600 dark:text-yellow-400 hover:text-gray-900 focus:outline-none"
            title="Toggle Dark Mode"
          >
            {darkMode ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
          </button>
        </div>

        {/* Map */}
        <MapData 
          activeLayers={activeLayers} 
          allLayers={availableLayers}
          siteFilter={filters.site || 'A'}
        />

      </div>

      {/* Right Panel (Metadata) */}
      <MetadataPanel 
        layer={selectedMetadata} 
        onClose={() => setSelectedMetadata(null)} 
      />

    </div>
  );
};

export default App;
