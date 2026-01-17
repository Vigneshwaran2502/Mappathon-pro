import React from 'react';
import { LayerMetadata } from '../types';

interface MetadataPanelProps {
  layer: LayerMetadata | null;
  onClose: () => void;
}

export const MetadataPanel: React.FC<MetadataPanelProps> = ({ layer, onClose }) => {
  if (!layer) return null;

  const downloadCSV = () => {
    const headers = Object.keys(layer).join(',');
    const values = Object.values(layer).join(',');
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + values;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${layer.layer_name}_metadata.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200 dark:border-gray-700 z-20 flex flex-col transform transition-transform duration-300">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
        <h2 className="font-bold text-gray-900 dark:text-white">Metadata Details</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Layer Name</label>
            <p className="text-lg font-semibold text-brand-600 dark:text-brand-400 break-words">{layer.layer_name}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Site</label>
              <p className="text-gray-800 dark:text-gray-200">{layer.site}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase">Year</label>
              <p className="text-gray-800 dark:text-gray-200">{layer.year}</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Parameter</label>
            <span className="inline-block px-2 py-1 mt-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {layer.parameter}
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Geometry Type</label>
            <p className="text-gray-800 dark:text-gray-200">{layer.geometry}</p>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">CRS</label>
            <p className="font-mono text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 p-1 rounded">{layer.crs}</p>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase">Source</label>
            <p className="text-gray-800 dark:text-gray-200">{layer.source}</p>
          </div>

          <div className="pt-2">
             <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
             <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">{layer.description}</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <button 
          onClick={downloadCSV}
          className="w-full flex justify-center items-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download Metadata
        </button>
      </div>
    </div>
  );
};
