import React, { useState } from 'react';

interface JourneyPlannerTabProps {
  onTrackBus: (bus: string) => void;
}

export const JourneyPlannerTab: React.FC<JourneyPlannerTabProps> = ({ onTrackBus }) => {
  const [origin, setOrigin] = useState('Dhoby Ghaut Stn Exit B');
  const [destination, setDestination] = useState('Clementi Int');

  const popularLocations = [
    'Dhoby Ghaut Stn Exit B',
    'Clementi Int',
    'Bedok Int',
    'Somerset Stn',
    'HarbourFront Int',
    'Yishun Int',
  ];

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Route Query Card */}
      <div className="bg-surface-card rounded-xl p-5 border border-border-subtle shadow-xs">
        <h2 className="text-xl font-bold font-headline-md text-text-primary mb-1">
          Singapore Journey Planner
        </h2>
        <p className="text-xs text-text-muted mb-4">
          Find the fastest SBS Transit direct bus connections and MRT transfers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5 relative">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1">
              Origin
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-primary text-lg">
                trip_origin
              </span>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border-subtle bg-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="md:col-span-1 flex justify-center pt-5">
            <button
              onClick={handleSwap}
              className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary transition-colors"
              title="Swap origin and destination"
            >
              <span className="material-symbols-outlined text-lg">swap_vert</span>
            </button>
          </div>

          <div className="md:col-span-6 relative">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block mb-1">
              Destination
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-load-seats-available text-lg">
                location_on
              </span>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border-subtle bg-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Quick Location Chips */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border-subtle overflow-x-auto pb-1">
          <span className="text-xs text-text-muted whitespace-nowrap">Popular hubs:</span>
          {popularLocations.map((loc) => (
            <button
              key={loc}
              onClick={() => setDestination(loc)}
              className="text-xs px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-text-primary whitespace-nowrap border border-border-subtle"
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Routes */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted">
          Recommended Itineraries
        </h3>

        {/* Option 1: Direct Bus 147 */}
        <div className="bg-surface-card rounded-xl p-5 border-2 border-primary-container shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-load-seats-available text-white text-[11px] font-bold rounded">
                FASTEST DIRECT
              </span>
              <span className="text-xs text-text-muted">No transfers required</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-11 bg-primary text-white rounded-lg flex items-center justify-center font-service-number text-base font-bold shadow-2xs">
                147
              </div>
              <div>
                <h4 className="font-bold text-sm text-text-primary">
                  SBS Transit 147 (To Clementi Int)
                </h4>
                <p className="text-xs text-text-muted">
                  Board at Dhoby Ghaut Stn Exit B • 22 stops • ~36 mins
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0">
            <div className="text-right">
              <div className="font-arrival-time text-xl font-bold text-primary">36 mins</div>
              <div className="text-[11px] text-text-muted">Fare: $1.78 (Adult)</div>
            </div>
            <button
              onClick={() => onTrackBus('147')}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-transit-purple-deep active:scale-95 transition-all shadow-xs"
            >
              Track Bus 147
            </button>
          </div>
        </div>

        {/* Option 2: Direct Bus 166 */}
        <div className="bg-surface-card rounded-xl p-5 border border-border-subtle shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-surface-container font-mono text-[11px] font-bold text-text-muted rounded">
                ALTERNATIVE
              </span>
              <span className="text-xs text-text-muted">Via Alexandra & Dover</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-11 bg-surface-card border-2 border-primary text-primary rounded-lg flex items-center justify-center font-service-number text-base font-bold">
                166
              </div>
              <div>
                <h4 className="font-bold text-sm text-text-primary">
                  SBS Transit 166 (To Clementi Int)
                </h4>
                <p className="text-xs text-text-muted">
                  Board at Rendezvous Hotel • 26 stops • ~42 mins
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0">
            <div className="text-right">
              <div className="font-arrival-time text-xl font-bold text-text-primary">42 mins</div>
              <div className="text-[11px] text-text-muted">Fare: $1.86 (Adult)</div>
            </div>
            <button
              onClick={() => onTrackBus('166')}
              className="px-4 py-2 bg-surface-container-low hover:bg-primary hover:text-white text-primary text-xs font-bold rounded-lg transition-all"
            >
              Track Bus 166
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
