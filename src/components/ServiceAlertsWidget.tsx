import React from 'react';

interface ServiceAlertsWidgetProps {
  onViewAlerts: () => void;
}

export const ServiceAlertsWidget: React.FC<ServiceAlertsWidgetProps> = ({ onViewAlerts }) => {
  return (
    <div
      onClick={onViewAlerts}
      className="bg-surface-card rounded-xl p-4 border border-border-subtle shadow-xs flex items-start gap-3 hover:border-primary/40 transition-colors cursor-pointer group"
      title="Click to see all transit advisories"
    >
      <div className="h-8 w-8 rounded-lg bg-surface-container text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
        <span className="material-symbols-outlined text-lg">info</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-text-primary">Road Works: Orchard Rd</div>
          <span className="text-[10px] text-primary font-semibold flex items-center">
            Details
            <span className="material-symbols-outlined text-xs">chevron_right</span>
          </span>
        </div>
        <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
          Expect slight 3–5 min delay near Dhoby Ghaut / Bencoolen corridor due to off-peak road
          resurfacing.
        </p>
      </div>
    </div>
  );
};
