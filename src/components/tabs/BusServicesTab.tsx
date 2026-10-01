import React, { useState } from 'react';
import { BUS_SERVICES_DATA } from '../../data/transitData';

interface BusServicesTabProps {
  onSelectBus: (bus: string) => void;
  favorites: string[];
  onToggleFavorite: (bus: string) => void;
}

export const BusServicesTab: React.FC<BusServicesTabProps> = ({
  onSelectBus,
  favorites,
  onToggleFavorite,
}) => {
  const [search, setSearch] = useState('');
  const [operatorFilter, setOperatorFilter] = useState<'All' | 'SBS Transit' | 'Tower Transit'>('All');

  const services = Object.values(BUS_SERVICES_DATA).filter((srv) => {
    const matchesSearch =
      srv.busNumber.toLowerCase().includes(search.toLowerCase()) ||
      srv.destination.toLowerCase().includes(search.toLowerCase()) ||
      srv.via.toLowerCase().includes(search.toLowerCase()) ||
      srv.origin.toLowerCase().includes(search.toLowerCase());

    const matchesOperator =
      operatorFilter === 'All' || srv.operator.includes(operatorFilter);

    return matchesSearch && matchesOperator;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Search & Filter Header */}
      <div className="bg-surface-card rounded-xl p-5 border border-border-subtle shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-headline-md text-text-primary">
            Singapore Bus Services Directory
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Search trunk, feeder, and express routes across the island network.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(['All', 'SBS Transit', 'Tower Transit'] as const).map((op) => (
            <button
              key={op}
              onClick={() => setOperatorFilter(op)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                operatorFilter === op
                  ? 'bg-primary text-white shadow-2xs'
                  : 'bg-surface-container-low text-text-muted hover:text-text-primary border border-border-subtle'
              }`}
            >
              {op}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-3.5 text-primary text-xl">
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by service number, destination or corridor (e.g. 147, Chinatown, Orchard)..."
          className="w-full h-12 pl-12 pr-4 rounded-xl border border-border-subtle bg-white text-sm focus:outline-none focus:border-primary shadow-xs"
        />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const isFav = favorites.includes(service.busNumber);
          return (
            <div
              key={service.busNumber}
              className="bg-surface-card rounded-xl p-4 border border-border-subtle shadow-xs flex flex-col justify-between gap-3 hover:border-primary/50 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-14 rounded-xl bg-primary text-white flex items-center justify-center font-service-number text-xl font-bold shadow-2xs">
                      {service.busNumber}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary-fixed text-primary">
                        {service.operator}
                      </span>
                      <h4 className="font-bold text-sm text-text-primary mt-1">
                        To {service.destination}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleFavorite(service.busNumber)}
                    className="p-1.5 text-text-muted hover:text-amber-500 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg" data-filled={isFav}>
                      bookmark
                    </span>
                  </button>
                </div>

                <div className="mt-3 text-xs text-text-muted">
                  <span className="font-semibold text-text-primary">From:</span> {service.origin}
                </div>
                <div className="text-xs text-text-muted mt-0.5">
                  <span className="font-semibold text-text-primary">Via:</span> {service.via}
                </div>
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                <span className="text-[11px] text-text-muted">
                  Peak: <strong className="text-text-primary">{service.frequencyPeak}</strong>
                </span>

                <button
                  onClick={() => onSelectBus(service.busNumber)}
                  className="px-3 py-1.5 bg-surface-container-low hover:bg-primary hover:text-white text-primary text-xs font-bold rounded-lg transition-all flex items-center gap-1 group-hover:bg-primary group-hover:text-white"
                >
                  <span>Track Bus</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
