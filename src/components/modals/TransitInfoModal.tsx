import React from 'react';

interface TransitInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: 'conditions' | 'fares' | 'safety';
}

export const TransitInfoModal: React.FC<TransitInfoModalProps> = ({
  isOpen,
  onClose,
  topic,
}) => {
  if (!isOpen) return null;

  const content = {
    conditions: {
      title: 'Conditions of Carriage',
      subtitle: 'SBS Transit Public Bus Transport Bylaws',
      body: (
        <div className="space-y-3 text-xs text-text-muted leading-relaxed">
          <p>
            1. All commuters are required to tap their contactless CEPAS card or contactless bank
            card upon boarding and alighting to ensure accurate distance-based fare calculation.
          </p>
          <p>
            2. Priority seats are designated for the elderly, expectant mothers, passengers with
            infants, and persons with disabilities.
          </p>
          <p>
            3. Bulky luggage and personal mobility devices (PMDs) must comply with LTA size regulations
            (maximum dimensions: 120cm × 70cm × 40cm) and not obstruct the bus gangway.
          </p>
          <p>4. Food and drink consumption is strictly prohibited on all SBS Transit vehicles.</p>
        </div>
      ),
    },
    fares: {
      title: 'Singapore Bus Fare Matrix',
      subtitle: 'Distance-Based Through-Fare System (LTA / PTC)',
      body: (
        <div className="space-y-3 text-xs text-text-muted leading-relaxed">
          <p>
            Bus and train fares in Singapore are calculated seamlessly based on total journey distance,
            allowing up to 5 transfers within a 45-minute window without re-incurring boarding charges.
          </p>
          <div className="border border-border-subtle rounded-xl overflow-hidden mt-3">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low font-bold text-text-primary">
                <tr>
                  <th className="p-2.5">Distance (km)</th>
                  <th className="p-2.5">Card Fare (Adult)</th>
                  <th className="p-2.5">Student / Senior</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle bg-white font-mono">
                <tr>
                  <td className="p-2.5">Up to 3.2 km</td>
                  <td className="p-2.5">$1.09</td>
                  <td className="p-2.5">$0.48 / $0.68</td>
                </tr>
                <tr>
                  <td className="p-2.5">3.3 – 10.2 km</td>
                  <td className="p-2.5">$1.45 – $1.78</td>
                  <td className="p-2.5">$0.58 – $0.80</td>
                </tr>
                <tr>
                  <td className="p-2.5">10.3 – 20.2 km</td>
                  <td className="p-2.5">$1.89 – $2.19</td>
                  <td className="p-2.5">$0.85 – $0.98</td>
                </tr>
                <tr>
                  <td className="p-2.5">&gt; 20.2 km (Max)</td>
                  <td className="p-2.5">$2.37</td>
                  <td className="p-2.5">$1.04</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    },
    safety: {
      title: 'Transit Police & Passenger Safety',
      subtitle: 'Emergency Protocols & Assistance',
      body: (
        <div className="space-y-3 text-xs text-text-muted leading-relaxed">
          <p>
            SBS Transit works closely with the Singapore Police Force Public Transport Security
            Command (TransCom) to ensure commuter safety across the transit network.
          </p>
          <div className="bg-surface-container-low p-3.5 rounded-xl border border-border-subtle space-y-2">
            <div className="font-bold text-text-primary">Emergency Contacts:</div>
            <div className="flex justify-between">
              <span>Police Emergency:</span>
              <strong className="text-primary font-mono">999</strong>
            </div>
            <div className="flex justify-between">
              <span>SBS Transit 24/7 Hotline:</span>
              <strong className="text-primary font-mono">1800-287-2727</strong>
            </div>
            <div className="flex justify-between">
              <span>TransCom Patrol SMS:</span>
              <strong className="text-primary font-mono">71999</strong>
            </div>
          </div>
        </div>
      ),
    },
  }[topic];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-card rounded-2xl w-full max-w-lg shadow-2xl border border-border-subtle overflow-hidden">
        <div className="p-5 bg-surface-container-low border-b border-border-subtle flex items-center justify-between">
          <div>
            <h3 className="font-headline-md text-base font-bold text-text-primary">
              {content.title}
            </h3>
            <p className="text-xs text-text-muted">{content.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text-primary rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-5">{content.body}</div>

        <div className="p-4 bg-surface-container-low border-t border-border-subtle flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-transit-purple-deep"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
