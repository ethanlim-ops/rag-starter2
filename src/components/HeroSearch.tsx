import React, { useState } from 'react';
import { BusStop } from '../data/transitData';

interface HeroSearchProps {
  currentStop: BusStop;
  selectedBus: string;
  onSelectBus: (bus: string) => void;
  onOpenStopSelector: () => void;
  quickSelectBuses: string[];
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  currentStop,
  selectedBus,
  onSelectBus,
  onOpenStopSelector,
  quickSelectBuses,
}) => {
  const [searchValue, setSearchValue] = useState(selectedBus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSelectBus(searchValue.trim().toUpperCase());
    }
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl p-5 md:p-6 border border-border-subtle shadow-xs flex flex-col gap-4">
      {/* Header & Proximity Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline-lg text-text-primary tracking-tight">
            Live Singapore Bus Arrival
          </h1>
          <p className="text-text-muted text-sm mt-0.5">
            Real-time SBS Transit arrival telemetry, passenger capacity, and vehicle accessibility.
          </p>
        </div>

        {/* Proximity Badge (Interactive - allows switching stops) */}
        <button
          onClick={onOpenStopSelector}
          className="group flex items-center gap-2.5 bg-surface-container-low hover:bg-surface-container border border-border-subtle px-3 py-2 rounded-xl text-left self-start md:self-auto transition-all active:scale-98 shadow-2xs"
          title="Click to change active bus stop"
        >
          <div className="h-8 w-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-lg" data-filled="true">
              pin_drop
            </span>
          </div>
          <div>
            <div className="text-xs text-text-primary font-bold flex items-center gap-1.5">
              <span>{currentStop.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-white font-mono rounded text-primary border border-border-subtle">
                {currentStop.code}
              </span>
              <span className="material-symbols-outlined text-sm text-text-muted group-hover:text-primary transition-colors">
                expand_more
              </span>
            </div>
            <p className="text-xs text-text-muted">
              {currentStop.distanceMeters}m away • ~{currentStop.walkTimeMins} min walk via {currentStop.road}
            </p>
          </div>
        </button>
      </div>

      {/* Prominent Search Bar Input */}
      <form onSubmit={handleSubmit} className="relative flex items-center mt-1">
        <div className="absolute left-4 flex items-center pointer-events-none text-primary">
          <span className="material-symbols-outlined text-2xl">directions_bus</span>
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Enter bus service number (e.g. 147, 65, 7, 190)..."
          className="w-full h-14 pl-12 pr-32 rounded-xl border-2 border-border-subtle focus:border-primary-container focus:ring-4 focus:ring-primary-fixed/30 bg-surface-bright text-xl md:text-2xl font-service-number text-text-primary placeholder:text-text-muted/60 transition-all outline-none"
        />
        <div className="absolute right-2 flex items-center gap-1.5">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg font-semibold text-xs md:text-sm flex items-center gap-1.5 hover:bg-transit-purple-deep active:scale-95 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-base">search</span>
            <span>Track Bus</span>
          </button>
        </div>
      </form>

      {/* Quick Chip Bus Filters */}
      <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs text-text-muted whitespace-nowrap uppercase tracking-wider font-semibold">
          Quick Select:
        </span>
        <div className="flex items-center gap-2">
          {quickSelectBuses.map((bus) => {
            const isActive = selectedBus === bus;
            return (
              <button
                key={bus}
                onClick={() => {
                  setSearchValue(bus);
                  onSelectBus(bus);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-service-number font-bold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-xs ring-2 ring-primary/20'
                    : 'bg-surface-container-low text-text-primary hover:bg-surface-container border border-border-subtle'
                }`}
              >
                {bus}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
