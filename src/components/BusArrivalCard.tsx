import React from 'react';
import { BusArrivalInfo } from '../data/transitData';

interface BusArrivalCardProps {
  busInfo: BusArrivalInfo;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onShare: () => void;
  currentStopName: string;
}

export const BusArrivalCard: React.FC<BusArrivalCardProps> = ({
  busInfo,
  isFavorite,
  onToggleFavorite,
  onShare,
  currentStopName,
}) => {
  const { arrivals } = busInfo;

  // Helpers for load styling
  const getLoadBadge = (load: 'sea' | 'sda' | 'lsd') => {
    switch (load) {
      case 'sea':
        return {
          bg: 'bg-[#ECFDF5]',
          border: 'border-load-seats-available/30',
          text: 'text-load-seats-available',
          label: 'Seats Available',
          dot: 'bg-load-seats-available',
        };
      case 'sda':
        return {
          bg: 'bg-[#FFFBEB]',
          border: 'border-load-standing-available/30',
          text: 'text-load-standing-available',
          label: 'Standing Available',
          dot: 'bg-load-standing-available',
        };
      case 'lsd':
      default:
        return {
          bg: 'bg-[#FEF2F2]',
          border: 'border-load-crowded/30',
          text: 'text-load-crowded',
          label: 'Limited Standing',
          dot: 'bg-load-crowded',
        };
    }
  };

  const nextLoad = getLoadBadge(arrivals.next.load);
  const secondLoad = getLoadBadge(arrivals.second.load);
  const thirdLoad = getLoadBadge(arrivals.third.load);

  // Calculate approximate percentage distance to stop (between 0% and 100%)
  const maxDistance = 2500;
  const progressPercent = Math.min(
    95,
    Math.max(15, Math.round(((maxDistance - arrivals.next.distanceMeters) / maxDistance) * 100))
  );

  return (
    <article className="bg-surface-card rounded-xl border-2 border-primary-container shadow-md overflow-hidden relative">
      {/* Header Banner: Service info & Direction */}
      <div className="bg-surface-container-low p-4 sm:p-5 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          {/* Service Badge */}
          <div className="h-14 w-16 bg-primary text-white rounded-xl flex items-center justify-center font-service-number text-2xl font-bold shadow-xs shrink-0 tracking-tight">
            {busInfo.busNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-primary-fixed text-primary px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase">
                {busInfo.operator}
              </span>
              <span className="text-xs text-text-muted font-mono">Route Code: {busInfo.routeCode}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-headline-md text-text-primary flex items-center gap-2 mt-0.5">
              <span>To {busInfo.destination}</span>
              <span className="material-symbols-outlined text-text-muted text-base">arrow_forward</span>
            </h2>
            <p className="text-xs text-text-muted mt-0.5">Via {busInfo.via}</p>
          </div>
        </div>

        {/* Bookmark / Quick Actions */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={onToggleFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-2 rounded-lg border transition-all active:scale-95 ${
              isFavorite
                ? 'border-amber-400 bg-amber-50 text-amber-600'
                : 'border-border-subtle bg-surface-card text-text-muted hover:text-amber-600 hover:border-amber-300'
            }`}
            title={isFavorite ? 'Saved in Favorites' : 'Add to Favorites'}
          >
            <span className="material-symbols-outlined text-xl" data-filled={isFavorite}>
              bookmark
            </span>
          </button>
          <button
            onClick={onShare}
            aria-label="Share route info"
            className="p-2 rounded-lg border border-border-subtle bg-surface-card text-text-muted hover:text-primary hover:border-primary/40 transition-colors active:scale-95"
            title="Share bus status"
          >
            <span className="material-symbols-outlined text-xl">share</span>
          </button>
        </div>
      </div>

      {/* Real-Time 3-Tier Arrival Countdown */}
      <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1st Arrival: Next Bus */}
        <div className={`${nextLoad.bg} border-2 ${nextLoad.border} rounded-xl p-4 flex flex-col justify-between relative overflow-hidden shadow-2xs`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${nextLoad.text} flex items-center gap-1.5`}>
              <span className={`h-2 w-2 rounded-full ${nextLoad.dot}`}></span>
              Next Bus
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-load-seats-available text-white font-bold tracking-wide">
              {arrivals.next.source}
            </span>
          </div>

          <div>
            <div className={`font-arrival-time text-3xl sm:text-4xl font-bold ${nextLoad.text} tracking-tight flex items-baseline gap-1`}>
              {arrivals.next.isArriving || arrivals.next.mins === 0 ? (
                <span className="animate-pulse">Arr</span>
              ) : (
                <>
                  <span>{arrivals.next.mins}</span>
                  <span className="text-base font-medium">mins</span>
                </>
              )}
            </div>
            <div className={`text-xs font-semibold ${nextLoad.text} mt-0.5`}>
              {nextLoad.label}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-load-seats-available/20 flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1" title={arrivals.next.type}>
              <span className="material-symbols-outlined text-base">directions_bus</span>
              <span className="font-medium text-text-primary">{arrivals.next.type}</span>
            </span>
            <span className="flex items-center gap-1" title="Wheelchair Accessible Bus">
              <span className="material-symbols-outlined text-base text-primary">accessible</span>
              <span className="font-semibold text-text-primary">{arrivals.next.feature}</span>
            </span>
          </div>
        </div>

        {/* 2nd Arrival */}
        <div className={`${secondLoad.bg} border ${secondLoad.border} rounded-xl p-4 flex flex-col justify-between shadow-2xs`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${secondLoad.text} flex items-center gap-1.5`}>
              <span className={`h-2 w-2 rounded-full ${secondLoad.dot}`}></span>
              2nd Bus
            </span>
            <span className="text-[10px] text-text-muted font-medium bg-white/70 px-1.5 py-0.5 rounded">
              {arrivals.second.source}
            </span>
          </div>

          <div>
            <div className={`font-arrival-time text-3xl sm:text-4xl font-bold ${secondLoad.text} tracking-tight flex items-baseline gap-1`}>
              <span>{arrivals.second.mins}</span>
              <span className="text-base font-medium">mins</span>
            </div>
            <div className={`text-xs font-semibold ${secondLoad.text} mt-0.5`}>
              {secondLoad.label}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-load-standing-available/20 flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1" title={arrivals.second.type}>
              <span className="material-symbols-outlined text-base">directions_bus</span>
              <span className="font-medium text-text-primary">{arrivals.second.type}</span>
            </span>
            <span className="flex items-center gap-1" title="Wheelchair Accessible Bus">
              <span className="material-symbols-outlined text-base text-primary">accessible</span>
              <span className="font-semibold text-text-primary">{arrivals.second.feature}</span>
            </span>
          </div>
        </div>

        {/* 3rd Arrival */}
        <div className={`${thirdLoad.bg} border ${thirdLoad.border} rounded-xl p-4 flex flex-col justify-between shadow-2xs`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider ${thirdLoad.text} flex items-center gap-1.5`}>
              <span className={`h-2 w-2 rounded-full ${thirdLoad.dot}`}></span>
              3rd Bus
            </span>
            <span className="text-[10px] text-text-muted font-medium bg-white/70 px-1.5 py-0.5 rounded">
              {arrivals.third.source}
            </span>
          </div>

          <div>
            <div className={`font-arrival-time text-3xl sm:text-4xl font-bold ${thirdLoad.text} tracking-tight flex items-baseline gap-1`}>
              <span>{arrivals.third.mins}</span>
              <span className="text-base font-medium">mins</span>
            </div>
            <div className={`text-xs font-semibold ${thirdLoad.text} mt-0.5`}>
              {thirdLoad.label}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-load-crowded/20 flex items-center justify-between text-xs text-text-muted">
            <span className="flex items-center gap-1" title={arrivals.third.type}>
              <span className="material-symbols-outlined text-base">directions_bus</span>
              <span className="font-medium text-text-primary">{arrivals.third.type}</span>
            </span>
            <span className="flex items-center gap-1" title="Wheelchair Accessible Bus">
              <span className="material-symbols-outlined text-base text-primary">accessible</span>
              <span className="font-semibold text-text-primary">{arrivals.third.feature}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Proximity Track & Live Distance Bar */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5">
        <div className="bg-surface-container-low rounded-xl p-3 sm:p-3.5 border border-border-subtle flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-medium text-text-primary">
              <span className="material-symbols-outlined text-base text-primary">speed</span>
              <span>
                Approaching:{' '}
                <strong className="font-mono text-primary">{arrivals.next.plate}</strong> (~
                {arrivals.next.distanceMeters}m from stop)
              </span>
            </div>
            <span className="text-load-seats-available font-bold font-mono">
              Speed: {arrivals.next.speedKmh} km/h
            </span>
          </div>

          {/* Animated Progress Track */}
          <div className="w-full bg-border-subtle h-2.5 rounded-full overflow-hidden relative">
            <div
              className="bg-primary-container h-full rounded-full transition-all duration-700 ease-out shadow-xs"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[11px] text-text-muted font-mono pt-0.5">
            <span>Passed: {arrivals.next.lastPassed}</span>
            <span className="text-primary font-bold">{arrivals.next.currentJunction}</span>
            <span>Stop: {currentStopName}</span>
          </div>
        </div>
      </div>
    </article>
  );
};
