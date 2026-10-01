import React from 'react';
import { BusStop } from '../data/transitData';

interface AllBusesAtStopProps {
  stop: BusStop;
  selectedBus: string;
  onSelectBus: (bus: string) => void;
}

export const AllBusesAtStop: React.FC<AllBusesAtStopProps> = ({
  stop,
  selectedBus,
  onSelectBus,
}) => {
  const getBadgeStyle = (load: 'sea' | 'sda' | 'lsd') => {
    switch (load) {
      case 'sea':
        return {
          bg: 'bg-load-seats-available',
          text: 'text-load-seats-available',
          label: 'Seats Avail',
        };
      case 'sda':
        return {
          bg: 'bg-load-standing-available',
          text: 'text-load-standing-available',
          label: 'Standing',
        };
      case 'lsd':
      default:
        return {
          bg: 'bg-load-crowded',
          text: 'text-load-crowded',
          label: 'Crowded',
        };
    }
  };

  return (
    <div className="bg-surface-card rounded-xl p-5 md:p-6 border border-border-subtle shadow-xs flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
        <div>
          <h3 className="font-headline-md text-lg sm:text-xl font-bold text-text-primary">
            All Buses at Stop
          </h3>
          <p className="text-xs text-text-muted mt-0.5">Real-time incoming countdowns</p>
        </div>
        <span className="px-2 py-1 rounded bg-surface-container font-mono text-xs font-bold text-primary">
          {stop.busesAtStop.length} Services
        </span>
      </div>

      {/* Service List */}
      <div className="flex flex-col gap-2.5" role="list" aria-label="Buses at this stop">
        {stop.busesAtStop.map((bus) => {
          const isSelected = selectedBus === bus.busNumber;
          const badge = getBadgeStyle(bus.load);
          const isArr = bus.mins === 'Arr' || bus.mins === 0;

          return (
            <button
              key={bus.busNumber}
              onClick={() => onSelectBus(bus.busNumber)}
              className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all active:scale-98 ${
                isSelected
                  ? 'bg-primary-fixed/25 border-2 border-primary-container shadow-xs ring-1 ring-primary/20'
                  : 'bg-surface-container-low/70 border border-border-subtle hover:border-primary/50 hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-11 rounded-lg flex items-center justify-center font-service-number text-lg font-bold shrink-0 shadow-2xs ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'bg-surface-card text-primary border-2 border-primary'
                  }`}
                >
                  {bus.busNumber}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-text-primary">
                    {bus.destination}
                  </div>
                  <div className="text-[11px] text-text-muted">
                    {bus.type} • {bus.feature}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div
                  className={`px-2.5 py-1 ${badge.bg} text-white text-xs font-bold rounded font-arrival-time shadow-2xs ${
                    isArr ? 'animate-pulse' : ''
                  }`}
                >
                  {isArr ? 'Arr' : `${bus.mins} min`}
                </div>
                <div className={`text-[10px] ${badge.text} font-semibold mt-0.5`}>
                  {badge.label}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Capacity Legend */}
      <div className="mt-1 pt-3 border-t border-border-subtle flex flex-col gap-1.5 text-[11px] text-text-muted">
        <span className="font-bold text-text-primary uppercase tracking-wider text-[10px]">
          Load Legend:
        </span>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-load-seats-available font-semibold">
            <span className="h-2 w-2 rounded-full bg-load-seats-available"></span> Seats Available
          </span>
          <span className="flex items-center gap-1.5 text-load-standing-available font-semibold">
            <span className="h-2 w-2 rounded-full bg-load-standing-available"></span> Standing Avail
          </span>
          <span className="flex items-center gap-1.5 text-load-crowded font-semibold">
            <span className="h-2 w-2 rounded-full bg-load-crowded"></span> Crowded
          </span>
        </div>
      </div>
    </div>
  );
};
