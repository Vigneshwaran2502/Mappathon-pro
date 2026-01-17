import React from 'react';
import { LayerMetadata, FilterState, SITES, YEARS, PARAMETERS } from '../types';

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableLayers: LayerMetadata[];
  activeLayers: string[];
  toggleLayer: (layerName: string) => void;
  onCompareHTL: () => void;
  onTimeMode: () => void;
  onLayerClick: (layer: LayerMetadata) => void;
  isTimeMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  filters,
  setFilters,
  availableLayers,
  activeLayers,
  toggleLayer,
  onCompareHTL,
  onTimeMode,
  onLayerClick,
  isTimeMode
}) => {
  
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-80 shadow-lg z-10 transition-colors duration-200">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-brand-50 dark:bg-gray-900">
        <h1 className="text-xl font-bold text-brand-900 dark:text-brand-100 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" /></svg>
          Coastal Portal
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Cataloguing & Traceability System</p>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        
        {/* Search */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Search Layers</label>
          <input 
            type="text" 
            placeholder="Search e.g., SiteA..." 
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            disabled={isTimeMode}
          />
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Filters</label>
          
          <div className="grid grid-cols-2 gap-2">
            <select 
              className="px-2 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:text-white"
              value={filters.site}
              onChange={(e) => handleFilterChange('site', e.target.value)}
            >
              <option value="">All Sites</option>
              {SITES.map(s => <option key={s} value={s}>Site {s}</option>)}
            </select>

            <select 
              className="px-2 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:text-white"
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              disabled={isTimeMode}
            >
              <option value="">All Years</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <select 
            className="w-full px-2 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm dark:text-white"
            value={filters.parameter}
            onChange={(e) => handleFilterChange('parameter', e.target.value)}
          >
            <option value="">All Parameters</option>
            {PARAMETERS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Tools Section */}
        <div>
           <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Analysis Tools</label>
           <div className="space-y-2">
            <button 
              onClick={onCompareHTL}
              disabled={isTimeMode}
              className={`w-full text-sm font-medium py-2 px-4 rounded-md shadow transition flex items-center justify-center gap-2 ${isTimeMode ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              Compare HTL (2011 vs 2019)
            </button>

            <button 
              onClick={onTimeMode}
              className={`w-full text-sm font-medium py-2 px-4 rounded-md shadow transition flex items-center justify-center gap-2 border ${isTimeMode ? 'bg-brand-50 border-brand-500 text-brand-700' : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600'}`}
            >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {isTimeMode ? 'Exit Temporal Mode' : 'Time Lapse View'}
            </button>
           </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Layer List */}
        <div>
          <div className="flex justify-between items-center mb-2">
             <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Available Layers ({availableLayers.length})</label>
          </div>
         
          <div className="space-y-1">
            {availableLayers.length === 0 && <p className="text-sm text-gray-400 italic">No layers match filters.</p>}
            {availableLayers.map(layer => (
              <div 
                key={layer.layer_name} 
                className={`flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition ${activeLayers.includes(layer.layer_name) ? 'bg-brand-50 dark:bg-gray-800 border-l-4 border-brand-500' : ''} ${isTimeMode && !activeLayers.includes(layer.layer_name) ? 'opacity-50' : ''}`}
                onClick={() => !isTimeMode && onLayerClick(layer)}
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={activeLayers.includes(layer.layer_name)}
                    onChange={(e) => {
                      e.stopPropagation();
                      if(!isTimeMode) toggleLayer(layer.layer_name);
                    }}
                    disabled={isTimeMode}
                    className="h-4 w-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500 disabled:opacity-50"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{layer.layer_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{layer.site} • {layer.year} • {layer.parameter}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};