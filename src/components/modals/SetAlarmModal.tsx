import React, { useState } from 'react';

interface SetAlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  busNumber: string;
  stopName: string;
  onAlarmSet: (stopsAway: number) => void;
  activeAlarm: number | null;
  onCancelAlarm: () => void;
}

export const SetAlarmModal: React.FC<SetAlarmModalProps> = ({
  isOpen,
  onClose,
  busNumber,
  stopName,
  onAlarmSet,
  activeAlarm,
  onCancelAlarm,
}) => {
  const [selectedStops, setSelectedStops] = useState<number>(activeAlarm || 2);
  const [isPlayingTestSound, setIsPlayingTestSound] = useState(false);

  if (!isOpen) return null;

  // Synthesize realistic transit chime sound using Web Audio API
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const now = audioCtx.currentTime;

      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.setValueAtTime(880, now + 0.15); // A5

      osc2.frequency.setValueAtTime(587.33, now);
      osc2.frequency.setValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.6);
      osc2.stop(now + 0.6);

      setIsPlayingTestSound(true);
      setTimeout(() => setIsPlayingTestSound(false), 600);
    } catch {
      // AudioContext unavailable or restricted
    }
  };

  const handleSave = () => {
    onAlarmSet(selectedStops);
    playChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-card rounded-2xl w-full max-w-md shadow-2xl border border-border-subtle overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-surface-container-low border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">alarm</span>
            </div>
            <div>
              <h3 className="font-headline-md text-base font-bold text-text-primary">
                Bus Arrival Alarm
              </h3>
              <p className="text-xs text-text-muted">
                Bus {busNumber} approaching {stopName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text-primary rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-text-muted">
            We will alert you with a chime when Bus {busNumber} is approaching your stop.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text-primary uppercase tracking-wider block">
              Notify Me When:
            </label>

            <button
              type="button"
              onClick={() => setSelectedStops(1)}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                selectedStops === 1
                  ? 'border-primary bg-primary-fixed/20 text-primary font-bold'
                  : 'border-border-subtle bg-white text-text-primary hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="text-xs font-bold">1 stop away (~2 mins)</div>
                <div className="text-[11px] text-text-muted">Best if you are already at the stop</div>
              </div>
              <span className="material-symbols-outlined text-lg">
                {selectedStops === 1 ? 'radio_button_checked' : 'radio_button_unchecked'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedStops(2)}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                selectedStops === 2
                  ? 'border-primary bg-primary-fixed/20 text-primary font-bold'
                  : 'border-border-subtle bg-white text-text-primary hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="text-xs font-bold">2 stops away (~5 mins) (Recommended)</div>
                <div className="text-[11px] text-text-muted">Gives you time to walk to the shelter</div>
              </div>
              <span className="material-symbols-outlined text-lg">
                {selectedStops === 2 ? 'radio_button_checked' : 'radio_button_unchecked'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedStops(3)}
              className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                selectedStops === 3
                  ? 'border-primary bg-primary-fixed/20 text-primary font-bold'
                  : 'border-border-subtle bg-white text-text-primary hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="text-xs font-bold">3 stops away (~8 mins)</div>
                <div className="text-[11px] text-text-muted">Early wake-up or wrapping up nearby shopping</div>
              </div>
              <span className="material-symbols-outlined text-lg">
                {selectedStops === 3 ? 'radio_button_checked' : 'radio_button_unchecked'}
              </span>
            </button>
          </div>

          {/* Test Sound Button */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={playChime}
              className={`text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle ${
                isPlayingTestSound ? 'bg-primary-fixed text-primary' : 'bg-slate-50 text-text-primary hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-base">volume_up</span>
              <span>{isPlayingTestSound ? 'Playing Chime...' : 'Test Sound Chime'}</span>
            </button>
            <span className="text-[11px] text-text-muted">Volume follows device</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-surface-container-low border-t border-border-subtle flex items-center justify-between">
          {activeAlarm ? (
            <button
              onClick={() => {
                onCancelAlarm();
                onClose();
              }}
              className="text-xs text-red-600 font-semibold hover:underline"
            >
              Cancel Alarm
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-text-muted hover:text-text-primary rounded-lg"
            >
              Dismiss
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-transit-purple-deep active:scale-95 transition-all shadow-xs"
            >
              Activate Alarm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
