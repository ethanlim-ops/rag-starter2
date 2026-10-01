import React, { useState } from 'react';
import { BusStop } from '../data/transitData';

interface StopOverviewProps {
  stop: BusStop;
  onOpenMapDirections: () => void;
  onOpenStopSelector: () => void;
}

export const StopOverview: React.FC<StopOverviewProps> = ({
  stop,
  onOpenMapDirections,
  onOpenStopSelector,
}) => {
  const [imgLoaded, setImgLoaded] = useState(true);

  // Map image hotlink provided by user
  const mapImageUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCVzEKnfULGV9hR0iwobrgj72JURHV7tAYEOae71HzUTfyspfKX7BX2OOQo7St1WC1Cs0wxFF1POqozciTSr21KP0k7zum74yOqgb6xbKvlLLIrXOWzUBNNSd1Hq2kO1rHKWTI7viKLEXXkBXwJIeCemAAkyjm_xK4-MwJpzzFEMaIl_XyuQS1XLO10UET6rBPqIzFJY7FKeJQpUZCjGMCIUDuP2RMLtZkjGoQ5mDpS6Ohh1FHEKlJJ';

  return (
    <div className="bg-surface-card rounded-xl p-5 md:p-6 border border-border-subtle shadow-xs flex flex-col gap-4">
      {/* Stop Title & Code */}
      <div className="flex items-start justify-between">
        <div>
          <span className="px-2 py-0.5 bg-primary-fixed text-primary font-bold text-xs rounded tracking-wide">
            Stop Code: {stop.code}
          </span>
          <h3 className="text-xl font-bold font-headline-md text-text-primary mt-1">
            {stop.name}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            {stop.landmark} • {stop.road}
          </p>
        </div>
        <button
          onClick={onOpenStopSelector}
          className="h-10 w-10 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-primary shrink-0 transition-colors shadow-2xs"
          title="Switch Bus Stop"
        >
          <span className="material-symbols-outlined">tune</span>
        </button>
      </div>

      {/* Walking Distance Badge */}
      <div className="p-3 bg-surface-container-low rounded-xl border border-border-subtle flex items-center gap-3">
        <div className="h-9 w-9 rounded-lg bg-surface-card flex items-center justify-center text-load-seats-available shadow-xs shrink-0">
          <span className="material-symbols-outlined">directions_walk</span>
        </div>
        <div>
          <div className="text-xs text-text-primary font-bold">
            {stop.distanceMeters}m • ~{stop.walkTimeMins} mins walk
          </div>
          <p className="text-xs text-text-muted">{stop.walkDirections}</p>
        </div>
      </div>

      {/* Train Interchanges Connected */}
      <div>
        <span className="text-[11px] font-semibold text-text-muted block mb-1.5 uppercase tracking-wider">
          Connected Train Lines
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {stop.mrtLines.map((line) => (
            <span
              key={line.code}
              className="px-2 py-1 text-xs font-bold rounded shadow-2xs"
              style={{ backgroundColor: line.bg, color: line.text }}
            >
              {line.code} {line.name}
            </span>
          ))}
        </div>
      </div>

      {/* Mini Map Snapshot */}
      <div
        onClick={onOpenMapDirections}
        className="relative rounded-xl overflow-hidden border border-border-subtle group cursor-pointer shadow-2xs transition-transform active:scale-99"
        title="Click to view interactive walking directions & area map"
      >
        {imgLoaded ? (
          <img
            src={mapImageUrl}
            alt="Singapore transit map near stop"
            referrerPolicy="no-referrer"
            onError={() => setImgLoaded(false)}
            className="w-full h-36 object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-36 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
            <div className="text-center">
              <span className="material-symbols-outlined text-3xl text-primary mb-1">map</span>
              <p className="text-xs font-semibold text-text-primary">Dhoby Ghaut / Orchard Map</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3">
          <span className="text-white text-xs font-bold flex items-center gap-1.5 drop-shadow-sm">
            <span className="material-symbols-outlined text-sm">navigation</span>
            <span>Walking directions from your location</span>
          </span>
        </div>
      </div>
    </div>
  );
};
