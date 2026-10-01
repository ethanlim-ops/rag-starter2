import React from 'react';
import { BusArrivalInfo } from '../data/transitData';

interface RouteProgressionProps {
  busInfo: BusArrivalInfo;
  onViewFullRoute: () => void;
  onSetAlarm: () => void;
}

export const RouteProgression: React.FC<RouteProgressionProps> = ({
  busInfo,
  onViewFullRoute,
  onSetAlarm,
}) => {
  return (
    <section className="bg-surface-card rounded-xl p-5 md:p-6 border border-border-subtle shadow-xs flex flex-col gap-4">
      {/* Header & Capacity Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border-subtle">
        <div>
          <h3 className="text-xl font-bold font-headline-md text-text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">linear_scale</span>
            <span>Live Route Progression: Bus {busInfo.busNumber}</span>
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Showing immediate past, active, and upcoming transit sequence
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-load-seats-available"></span> Seats
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-load-standing-available"></span> Standing
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-load-crowded"></span> Crowded
          </span>
        </div>
      </div>

      {/* Vertical Timeline Visualization */}
      <div className="relative pl-6 sm:pl-8 py-2 flex flex-col gap-5">
        {/* Connecting Background Trunk Line */}
        <div className="absolute left-[17px] sm:left-[21px] top-4 bottom-4 w-1 bg-border-subtle rounded-full"></div>
        {/* Highlighted Traversed Section */}
        <div className="absolute left-[17px] sm:left-[21px] top-4 h-[115px] w-1 bg-primary rounded-full"></div>

        {/* Dynamic Stops */}
        {busInfo.stops.map((stop, idx) => {
          // Stop 1: Passed stop
          if (stop.passed) {
            return (
              <div key={stop.id} className="relative flex items-start gap-4 opacity-75">
                <div className="absolute -left-[23px] sm:-left-[27px] mt-1 h-3.5 w-3.5 rounded-full bg-primary border-2 border-white ring-2 ring-primary/30 z-10"></div>
                <div className="flex-1 bg-surface-container-low/60 p-3 rounded-lg border border-border-subtle flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-text-primary">{stop.name}</div>
                    <div className="text-[11px] font-mono text-text-muted">
                      Stop {stop.code} • {stop.road}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-text-muted">{stop.passedTimeAgo}</span>
                </div>
              </div>
            );
          }

          // Active Bus Indicator before the current stop
          if (stop.isCurrent) {
            return (
              <React.Fragment key={stop.id}>
                {/* Active Bus Indicator Pinned to Line */}
                <div className="relative flex items-center gap-3 my-[-4px]">
                  <div className="absolute -left-[30px] sm:-left-[34px] z-20">
                    <div className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md ring-4 ring-primary-fixed pulse-animation">
                      <span className="material-symbols-outlined text-sm">directions_bus</span>
                    </div>
                  </div>
                  <div className="ml-4 py-1 px-3 bg-primary-fixed text-primary text-xs font-bold rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                    <span>Bus {busInfo.arrivals.next.plate} En Route</span>
                    <span>•</span>
                    <span>ETA {busInfo.arrivals.next.mins} mins</span>
                  </div>
                </div>

                {/* CURRENT USER STOP (Highlighted) */}
                <div className="relative flex items-start gap-4">
                  <div className="absolute -left-[27px] sm:-left-[31px] mt-0.5 h-5 w-5 rounded-full bg-white border-4 border-primary ring-4 ring-primary-container/20 z-10"></div>
                  <div className="flex-1 bg-primary-fixed/20 p-4 rounded-xl border-2 border-primary-container shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded uppercase tracking-wide">
                          You Are Here
                        </span>
                        <span className="font-service-number text-xs text-primary font-bold">
                          Stop {stop.code}
                        </span>
                      </div>
                      <div className="font-headline-md text-lg sm:text-xl font-bold text-text-primary mt-1">
                        {stop.name}
                      </div>
                      <div className="text-xs text-text-muted mt-0.5">{stop.road}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1.5 bg-load-seats-available text-white font-bold rounded-lg text-sm text-center shadow-2xs whitespace-nowrap">
                        {busInfo.arrivals.next.mins === 0 ? 'Arriving Now' : `Arriving in ${busInfo.arrivals.next.mins}m`}
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          }

          // Upcoming stops
          return (
            <div key={stop.id} className="relative flex items-start gap-4">
              {stop.mrtLine ? (
                <div className="absolute -left-[25px] sm:-left-[29px] mt-1 h-4 w-4 rounded-full bg-white border-2 border-primary-container ring-2 ring-primary-fixed z-10 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                </div>
              ) : (
                <div className="absolute -left-[23px] sm:-left-[27px] mt-1 h-3.5 w-3.5 rounded-full bg-white border-2 border-slate-400 z-10"></div>
              )}

              <div className="flex-1 bg-surface-card p-3 rounded-lg border border-border-subtle flex items-center justify-between hover:bg-surface-container-low transition-colors">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-text-primary">{stop.name}</span>
                    {stop.mrtLine && (
                      <span
                        className="px-1.5 py-0.5 text-white text-[9px] font-bold rounded tracking-wide"
                        style={{ backgroundColor: stop.mrtLine.color }}
                      >
                        {stop.mrtLine.code}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-text-muted">
                    Stop {stop.code} • {stop.road}
                  </div>
                </div>
                <span className="text-xs font-medium text-text-muted">
                  Estimated {stop.etaMins}m
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions inside Tracker */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border-subtle text-xs">
        <span className="text-text-muted">
          Service runs every {busInfo.frequencyPeak} during peak commute.
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onViewFullRoute}
            className="px-3 py-1.5 rounded-lg border border-border-subtle font-semibold text-text-primary hover:bg-surface-container-low active:scale-95 transition-all shadow-2xs"
          >
            View Full {busInfo.fullStopsCount}-Stop Route
          </button>
          <button
            onClick={onSetAlarm}
            className="px-3 py-1.5 rounded-lg bg-primary text-white font-semibold hover:bg-transit-purple-deep active:scale-95 transition-all shadow-2xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">alarm</span>
            <span>Set Arrival Alarm</span>
          </button>
        </div>
      </div>
    </section>
  );
};
