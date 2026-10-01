import React, { useState } from 'react';
import { BusArrivalInfo } from '../../data/transitData';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  busInfo: BusArrivalInfo;
  stopName: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  busInfo,
  stopName,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `Bus ${busInfo.busNumber} to ${busInfo.destination} is arriving in ${busInfo.arrivals.next.mins} mins at ${stopName}. Track live on SBS Transit Live!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-card rounded-2xl w-full max-w-md shadow-2xl border border-border-subtle overflow-hidden">
        <div className="p-5 bg-surface-container-low border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">share</span>
            </div>
            <div>
              <h3 className="font-headline-md text-base font-bold text-text-primary">
                Share Live Arrival
              </h3>
              <p className="text-xs text-text-muted">Bus {busInfo.busNumber} • {stopName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text-primary rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="p-4 rounded-xl bg-surface-bright border border-border-subtle text-xs text-text-primary leading-relaxed font-mono">
            {shareText}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 py-2.5 px-4 bg-primary text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-transit-purple-deep active:scale-95 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-base">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Arrival Info'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
