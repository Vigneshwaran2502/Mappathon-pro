import React from 'react';

interface TimeControllerProps {
  years: number[];
  currentYear: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onYearChange: (year: number) => void;
  onClose: () => void;
}

export const TimeController: React.FC<TimeControllerProps> = ({ 
  years, currentYear, isPlaying, onPlayPause, onYearChange, onClose 
}) => {
  const currentIndex = years.indexOf(currentYear);

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl z-[1000] w-96 border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
           <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           Temporal Controller
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onPlayPause}
          className={`flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full focus:outline-none transition-all duration-200 transform active:scale-95 ${isPlaying ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-brand-100 text-brand-600 hover:bg-brand-200'}`}
          title={isPlaying ? "Pause Animation" : "Play Animation"}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
          )}
        </button>

        <div className="flex-1 relative pt-1">
           <input 
             type="range" 
             min={0} 
             max={years.length - 1} 
             value={currentIndex === -1 ? 0 : currentIndex} 
             onChange={(e) => onYearChange(years[parseInt(e.target.value)])}
             className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-brand-600"
           />
           <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400 font-mono select-none">
             <span>{years[0]}</span>
             {years.length > 2 && <span>...</span>}
             <span>{years[years.length - 1]}</span>
           </div>
           
           {/* Current Year Indicator */}
           <div 
             className="absolute -top-6 left-0 transform -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-2 py-1 rounded shadow pointer-events-none transition-all duration-300"
             style={{ left: `${(currentIndex / (years.length - 1)) * 100}%` }}
           >
             {currentYear}
           </div>
        </div>
      </div>
    </div>
  );
};