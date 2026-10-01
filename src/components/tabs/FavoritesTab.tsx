import React from 'react';
import { BUS_SERVICES_DATA } from '../../data/transitData';

interface FavoritesTabProps {
  favorites: string[];
  onSelectBus: (bus: string) => void;
  onRemoveFavorite: (bus: string) => void;
  onSwitchToServices: () => void;
}

export const FavoritesTab: React.FC<FavoritesTabProps> = ({
  favorites,
  onSelectBus,
  onRemoveFavorite,
  onSwitchToServices,
}) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="bg-surface-card rounded-xl p-5 border border-border-subtle shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-headline-md text-text-primary">
            Saved Bus Services & Stored Stops
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Quick-access your daily commute buses and monitor live countdowns.
          </p>
        </div>
        <button
          onClick={onSwitchToServices}
          className="px-3.5 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-transit-purple-deep flex items-center gap-1.5 shadow-2xs"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Add More Routes</span>
        </button>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-surface-card rounded-xl p-12 border border-dashed border-border-subtle text-center">
          <div className="h-12 w-12 rounded-full bg-surface-container text-primary flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-2xl">bookmark_border</span>
          </div>
          <h4 className="font-bold text-base text-text-primary">No Favorite Routes Yet</h4>
          <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
            Click the bookmark icon on any bus card or browse the directory to pin your frequently
            used buses here.
          </p>
          <button
            onClick={onSwitchToServices}
            className="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-transit-purple-deep"
          >
            Browse Bus Services
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((busNumber) => {
            const service = BUS_SERVICES_DATA[busNumber];
            if (!service) return null;

            return (
              <div
                key={busNumber}
                className="bg-surface-card rounded-xl p-5 border border-border-subtle shadow-xs flex flex-col justify-between gap-4 hover:border-primary/50 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-14 rounded-xl bg-primary text-white flex items-center justify-center font-service-number text-xl font-bold shadow-2xs">
                        {service.busNumber}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-primary px-1.5 py-0.5 rounded bg-primary-fixed inline-block">
                          {service.operator}
                        </div>
                        <h4 className="font-bold text-sm text-text-primary mt-1">
                          To {service.destination}
                        </h4>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveFavorite(busNumber)}
                      className="p-1.5 text-amber-500 hover:text-red-500 rounded-lg transition-colors"
                      title="Remove from favorites"
                    >
                      <span className="material-symbols-outlined text-lg" data-filled="true">
                        bookmark
                      </span>
                    </button>
                  </div>

                  {/* Quick Timing Preview */}
                  <div className="mt-4 p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-text-muted block">
                        Next Bus
                      </span>
                      <span className="font-arrival-time text-xl font-bold text-load-seats-available">
                        {service.arrivals.next.mins === 0
                          ? 'Arriving'
                          : `${service.arrivals.next.mins} mins`}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-text-muted block">
                        2nd Bus
                      </span>
                      <span className="font-arrival-time text-base font-bold text-load-standing-available">
                        {service.arrivals.second.mins} mins
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
                  <span className="text-xs text-text-muted">Peak: {service.frequencyPeak}</span>
                  <button
                    onClick={() => onSelectBus(busNumber)}
                    className="px-3.5 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-transit-purple-deep flex items-center gap-1 shadow-2xs"
                  >
                    <span>Track Now</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
