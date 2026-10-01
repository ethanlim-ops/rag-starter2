import React from 'react';
import { BusStop } from '../../data/transitData';

interface MapDirectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stop: BusStop;
}

export const MapDirectionsModal: React.FC<MapDirectionsModalProps> = ({
  isOpen,
  onClose,
  stop,
}) => {
  if (!isOpen) return null;

  const mapImageUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCVzEKnfULGV9hR0iwobrgj72JURHV7tAYEOae71HzUTfyspfKX7BX2OOQo7St1WC1Cs0wxFF1POqozciTSr21KP0k7zum74yOqgb6xbKvlLLIrXOWzUBNNSd1Hq2kO1rHKWTI7viKLEXXkBXwJIeCemAAkyjm_xK4-MwJpzzFEMaIl_XyuQS1XLO10UET6rBPqIzFJY7FKeJQpUZCjGMCIUDuP2RMLtZkjGoQ5mDpS6Ohh1FHEKlJJ';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-card rounded-2xl w-full max-w-xl shadow-2xl border border-border-subtle overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-surface-container-low border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">navigation</span>
            </div>
            <div>
              <h3 className="font-headline-md text-base font-bold text-text-primary">
                Walking Directions to {stop.name}
              </h3>
              <p className="text-xs text-text-muted">
                {stop.distanceMeters}m • ~{stop.walkTimeMins} min walk • Covered Walkway
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text-primary rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Map Snapshot */}
        <div className="relative h-60 w-full overflow-hidden border-b border-border-subtle">
          <img
            src={mapImageUrl}
            alt="Singapore transit map near Dhoby Ghaut"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-border-subtle shadow-xs text-xs font-bold text-primary flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-load-seats-available animate-ping"></span>
            <span>Live Pedestrian Wayfinding</span>
          </div>
        </div>

        {/* Steps */}
        <div className="p-5 space-y-3 max-h-64 overflow-y-auto">
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              1
            </div>
            <div className="text-xs">
              <div className="font-bold text-text-primary">Exit Dhoby Ghaut MRT Concourse</div>
              <p className="text-text-muted mt-0.5">Take Exit B towards Plaza Singapura and Penang Road.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              2
            </div>
            <div className="text-xs">
              <div className="font-bold text-text-primary">Proceed along the Covered Walkway</div>
              <p className="text-text-muted mt-0.5">Walk 90 metres straight past the Atrium @ Orchard entrance.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-load-seats-available text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              3
            </div>
            <div className="text-xs">
              <div className="font-bold text-text-primary">Arrive at Bus Shelter 08031</div>
              <p className="text-text-muted mt-0.5">
                Bus shelter is right by Penang Road with barrier-free ramp accessibility.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-surface-container-low border-t border-border-subtle flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-transit-purple-deep"
          >
            Close Directions
          </button>
        </div>
      </div>
    </div>
  );
};
