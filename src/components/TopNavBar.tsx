import React from 'react';

interface TopNavBarProps {
  currentTab: 'nearby' | 'services' | 'planner' | 'favorites';
  onSelectTab: (tab: 'nearby' | 'services' | 'planner' | 'favorites') => void;
  currentStopName: string;
  refreshSeconds: number;
  onRefresh: () => void;
  onDetectStop: () => void;
  onOpenNotifications: () => void;
  onOpenPreferences: () => void;
  unreadAlertsCount?: number;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentTab,
  onSelectTab,
  currentStopName,
  refreshSeconds,
  onRefresh,
  onDetectStop,
  onOpenNotifications,
  onOpenPreferences,
  unreadAlertsCount = 2,
}) => {
  return (
    <header className="bg-surface-container-lowest border-b border-border-subtle shadow-xs sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 md:px-8 h-16 w-full max-w-7xl mx-auto">
        {/* Brand & Status Group */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onSelectTab('nearby')}
            className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          >
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-2xl" data-filled="true">
                directions_bus
              </span>
            </div>
            <div>
              <span className="text-xl font-bold font-headline-md text-primary tracking-tight block">
                SBS Transit Live
              </span>
            </div>
          </button>

          {/* GPS Proximity Indicator Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-full border border-border-subtle">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-load-seats-available opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-load-seats-available"></span>
            </span>
            <span className="text-xs text-text-muted">
              Location: <span className="font-semibold text-text-primary">{currentStopName}</span> • Accurate to 10m
            </span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          <button
            onClick={() => onSelectTab('nearby')}
            className={`font-semibold text-sm pb-1 flex items-center gap-1.5 transition-colors duration-150 ${
              currentTab === 'nearby'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-muted hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-lg" data-filled={currentTab === 'nearby'}>
              near_me
            </span>
            <span>Nearby Stops</span>
          </button>

          <button
            onClick={() => onSelectTab('services')}
            className={`font-semibold text-sm pb-1 transition-colors duration-150 ${
              currentTab === 'services'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-muted hover:text-primary'
            }`}
          >
            <span>Bus Services</span>
          </button>

          <button
            onClick={() => onSelectTab('planner')}
            className={`font-semibold text-sm pb-1 transition-colors duration-150 ${
              currentTab === 'planner'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-muted hover:text-primary'
            }`}
          >
            <span>Journey Planner</span>
          </button>

          <button
            onClick={() => onSelectTab('favorites')}
            className={`font-semibold text-sm pb-1 transition-colors duration-150 ${
              currentTab === 'favorites'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-muted hover:text-primary'
            }`}
          >
            <span>Favorites</span>
          </button>
        </nav>

        {/* Trailing Actions & Primary Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle bg-white hover:bg-surface-container-low active:scale-95 transition-all text-text-muted hover:text-primary text-xs font-semibold shadow-2xs"
            title="Refresh arrivals now"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            <span className="hidden sm:inline">
              Refresh (<span className="font-mono tabular-nums">{refreshSeconds}s</span>)
            </span>
          </button>

          <button
            onClick={onDetectStop}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-white text-xs font-semibold hover:bg-primary active:scale-95 transition-all shadow-xs"
            title="Detect Nearest Stop via GPS"
          >
            <span className="material-symbols-outlined text-base">my_location</span>
            <span>Detect Nearest Stop</span>
          </button>

          <button
            onClick={onOpenNotifications}
            aria-label="Notifications & Advisories"
            className="relative p-2 text-text-muted hover:text-primary rounded-lg transition-colors active:scale-95 hover:bg-surface-container-low"
            title="Transit Advisories & Road Works"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-transit-red-accent ring-2 ring-white"></span>
            )}
          </button>

          <button
            onClick={onOpenPreferences}
            aria-label="Display Preferences"
            className="p-2 text-text-muted hover:text-primary rounded-lg transition-colors active:scale-95 hover:bg-surface-container-low"
            title="Customise live tracking preferences"
          >
            <span className="material-symbols-outlined text-xl">tune</span>
          </button>
        </div>
      </div>
    </header>
  );
};
