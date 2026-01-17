import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MapData } from './components/MapData';
import { MetadataPanel } from './components/MetadataPanel';
import { TimeController } from './components/TimeController';
import { LayerMetadata, FilterState, YEARS } from './types';
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

  // Animation State
  const [isTimeMode, setIsTimeMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationYear, setAnimationYear] = useState<number>(2011);
  const animationYears = [2011, 2019]; // These correspond to data available in metadata

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
    // In Time Mode, we ignore the year filter for fetching available layers 
    // because we need all years to be available for the animation to switch between.
    const effectiveFilters = isTimeMode ? { ...filters, year: '' } : filters;

    fetchMetadata(effectiveFilters)
      .then(data => {
        setAvailableLayers(data);
      })
      .catch(console.error);
  }, [filters, isTimeMode]);

  // Time Mode Logic: Automatically update active layers based on animationYear
  useEffect(() => {
    if (isTimeMode) {
      // Find layers that match current filter (Site, Param) and current Animation Year
      const targetSite = filters.site || 'A'; // Default to A if generic
      const targetParam = filters.parameter || 'HTL'; // Default to HTL if generic

      // Construct likely layer name or find in available
      const layersToShow = availableLayers
        .filter(l => 
          l.year === animationYear && 
          (filters.site ? l.site === filters.site : true) && // strict if selected
          (filters.parameter ? l.parameter === filters.parameter : l.parameter === 'HTL') // strict if selected, else HTL default
        )
        .map(l => l.layer_name);

      // If no strict match found (e.g. user hasn't selected site), try a fallback for demo
      if (layersToShow.length === 0) {
          // Fallback: Try to show Site A HTL for the animation year
          const fallbackName = `Site${targetSite}_${animationYear}_${targetParam}`;
          // Check if this exists in full metadata (conceptually) or just set it
          setActiveLayers([fallbackName]);
      } else {
          setActiveLayers(layersToShow);
      }
    }
  }, [isTimeMode, animationYear, availableLayers, filters.site, filters.parameter]);

  // Animation Loop
  useEffect(() => {
    let interval: any;
    if (isTimeMode && isPlaying) {
      interval = setInterval(() => {
        setAnimationYear(prev => {
           const idx = animationYears.indexOf(prev);
           // Loop back to start
           const nextIdx = (idx + 1) % animationYears.length;
           return animationYears[nextIdx];
        });
      }, 1500); // 1.5s per frame for better visibility
    }
    return () => clearInterval(interval);
  }, [isTimeMode, isPlaying]);


  const toggleLayer = (layerName: string) => {
    setActiveLayers(prev => 
      prev.includes(layerName) 
        ? prev.filter(n => n !== layerName) 
        : [...prev, layerName]
    );
  };

  const handleCompareHTL = () => {
    const targetSite = filters.site || 'A'; 
    setFilters({
      site: targetSite,
      year: '',
      parameter: 'HTL',
      search: ''
    });
    const layersToActivate = [
      `Site${targetSite}_2011_HTL`,
      `Site${targetSite}_2019_HTL`
    ];
    setActiveLayers(layersToActivate);
  };

  const toggleTimeMode = () => {
    if (!isTimeMode) {
      // Entering Time Mode
      setIsTimeMode(true);
      setIsPlaying(true);
      // Reset filters to ensure we have something to animate
      setFilters(prev => ({ ...prev, year: '' }));
      if (!filters.parameter) {
          setFilters(prev => ({ ...prev, parameter: 'HTL' }));
      }
      if (!filters.site) {
          setFilters(prev => ({ ...prev, site: 'A' }));
      }
    } else {
      // Exiting Time Mode
      setIsTimeMode(false);
      setIsPlaying(false);
      setActiveLayers([]); // Clear map or revert to previous state (simplest is clear)
    }
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
        onTimeMode={toggleTimeMode}
        onLayerClick={setSelectedMetadata}
        isTimeMode={isTimeMode}
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

        {/* Time Controller Overlay */}
        {isTimeMode && (
          <TimeController 
            years={animationYears}
            currentYear={animationYear}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onYearChange={(y) => {
              setIsPlaying(false); // Pause if user manually scrubs
              setAnimationYear(y);
            }}
            onClose={toggleTimeMode}
          />
        )}

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