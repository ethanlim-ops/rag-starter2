import React, { useState, useEffect, useCallback } from 'react';
import { TopNavBar } from './components/TopNavBar';
import { HeroSearch } from './components/HeroSearch';
import { BusArrivalCard } from './components/BusArrivalCard';
import { RouteProgression } from './components/RouteProgression';
import { StopOverview } from './components/StopOverview';
import { AllBusesAtStop } from './components/AllBusesAtStop';
import { ServiceAlertsWidget } from './components/ServiceAlertsWidget';

// Tabs
import { BusServicesTab } from './components/tabs/BusServicesTab';
import { JourneyPlannerTab } from './components/tabs/JourneyPlannerTab';
import { FavoritesTab } from './components/tabs/FavoritesTab';

// Modals
import { FullRouteModal } from './components/modals/FullRouteModal';
import { SetAlarmModal } from './components/modals/SetAlarmModal';
import { ShareModal } from './components/modals/ShareModal';
import { StopSelectorModal } from './components/modals/StopSelectorModal';
import { MapDirectionsModal } from './components/modals/MapDirectionsModal';
import { PreferencesModal } from './components/modals/PreferencesModal';
import { NotificationsModal } from './components/modals/NotificationsModal';
import { TransitInfoModal } from './components/modals/TransitInfoModal';

// API Service
import { fetchBusArrivals, LTABusArrivalResponse } from './services/ltaApi';

// Data
import {
  BUS_STOPS,
  BUS_SERVICES_DATA,
  BusStop,
  INITIAL_FAVORITES,
  BusArrivalInfo,
} from './data/transitData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'nearby' | 'services' | 'planner' | 'favorites'>('nearby');
  const [selectedBusNumber, setSelectedBusNumber] = useState<string>('147');
  const [currentStop, setCurrentStop] = useState<BusStop>(BUS_STOPS['08031']);
  const [refreshInterval, setRefreshInterval] = useState<number>(20); // 20s as specified in LTA v3 docs
  const [refreshSeconds, setRefreshSeconds] = useState<number>(20);
  const [isDetectingGPS, setIsDetectingGPS] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [apiSource, setApiSource] = useState<'lta_datamall_v3' | 'simulated_fallback'>('simulated_fallback');
  const [dynamicBusData, setDynamicBusData] = useState<Record<string, BusArrivalInfo>>(BUS_SERVICES_DATA);

  // Favorites state persisted to localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sbs_transit_favorites');
      return saved ? JSON.parse(saved) : INITIAL_FAVORITES;
    } catch {
      return INITIAL_FAVORITES;
    }
  });

  // Alarm state
  const [activeAlarm, setActiveAlarm] = useState<number | null>(null);

  // Display Preferences
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  // Modal States
  const [fullRouteOpen, setFullRouteOpen] = useState(false);
  const [alarmModalOpen, setAlarmModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [stopSelectorOpen, setStopSelectorOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [transitInfoTopic, setTransitInfoTopic] = useState<'conditions' | 'fares' | 'safety' | null>(null);

  // Quick select buses
  const quickSelectBuses = ['147', '65', '7', '166', '174', '857', '14'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Sync favorites with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sbs_transit_favorites', JSON.stringify(favorites));
    } catch {
      // Storage restricted
    }
  }, [favorites]);

  const toggleFavorite = useCallback((bus: string) => {
    setFavorites((prev) => {
      if (prev.includes(bus)) {
        showToast(`Removed Bus ${bus} from favorites`);
        return prev.filter((b) => b !== bus);
      } else {
        showToast(`Added Bus ${bus} to favorites`);
        return [...prev, bus];
      }
    });
  }, []);

  // Fetch live bus arrivals from /api/bus-arrival
  const loadArrivalData = useCallback(async (stopCode: string) => {
    try {
      const res = await fetchBusArrivals(stopCode);
      setApiSource(res.source);

      if (res.Services && res.Services.length > 0) {
        setDynamicBusData((prev) => {
          const nextMap = { ...prev };
          res.Services.forEach((srv) => {
            const num = srv.ServiceNo;
            const current = nextMap[num] || prev[num];
            if (current && srv.NextBus) {
              const nextMins = srv.NextBus.minsToArrival ?? 3;
              const nextLoad = (srv.NextBus.Load?.toLowerCase() || 'sea') as 'sea' | 'sda' | 'lsd';
              const nextType = srv.NextBus.Type === 'DD' ? 'Double Deck' : 'Single Deck';

              const secondMins = srv.NextBus2?.minsToArrival ?? (nextMins + 8);
              const secondLoad = (srv.NextBus2?.Load?.toLowerCase() || 'sda') as 'sea' | 'sda' | 'lsd';
              const secondType = srv.NextBus2?.Type === 'DD' ? 'Double Deck' : 'Single Deck';

              const thirdMins = srv.NextBus3?.minsToArrival ?? (secondMins + 12);
              const thirdLoad = (srv.NextBus3?.Load?.toLowerCase() || 'lsd') as 'sea' | 'sda' | 'lsd';
              const thirdType = srv.NextBus3?.Type === 'DD' ? 'Double Deck' : 'Single Deck';

              nextMap[num] = {
                ...current,
                arrivals: {
                  ...current.arrivals,
                  next: {
                    ...current.arrivals.next,
                    mins: nextMins,
                    isArriving: nextMins <= 1,
                    load: nextLoad,
                    type: nextType,
                    source: res.source === 'lta_datamall_v3' ? 'LIVE GPS' : 'Telemetry',
                  },
                  second: {
                    ...current.arrivals.second,
                    mins: secondMins,
                    load: secondLoad,
                    type: secondType,
                    source: 'Telemetry',
                  },
                  third: {
                    ...current.arrivals.third,
                    mins: thirdMins,
                    load: thirdLoad,
                    type: thirdType,
                    source: 'Scheduled',
                  },
                },
              };
            }
          });
          return nextMap;
        });

        // Also update currentStop.busesAtStop countdowns
        setCurrentStop((prevStop) => {
          const updatedBuses = prevStop.busesAtStop.map((b) => {
            const match = res.Services.find((s) => s.ServiceNo === b.busNumber);
            if (match && match.NextBus) {
              const busType: 'Double Deck' | 'Single Deck' =
                match.NextBus.Type === 'DD' ? 'Double Deck' : 'Single Deck';
              return {
                ...b,
                mins: match.NextBus.minsToArrival === 0 ? ('Arr' as const) : match.NextBus.minsToArrival || b.mins,
                load: (match.NextBus.Load?.toLowerCase() || b.load) as 'sea' | 'sda' | 'lsd',
                type: busType,
              };
            }
            return b;
          });
          return {
            ...prevStop,
            busesAtStop: updatedBuses,
          };
        });
      }
    } catch (err) {
      console.warn('Could not sync with /api/bus-arrival:', err);
    }
  }, []);

  // Sync on stop change
  useEffect(() => {
    loadArrivalData(currentStop.code);
  }, [currentStop.code, loadArrivalData]);

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshSeconds((prev) => {
        if (prev <= 1) {
          loadArrivalData(currentStop.code);
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [refreshInterval, currentStop.code, loadArrivalData]);

  const handleManualRefresh = () => {
    setRefreshSeconds(refreshInterval);
    loadArrivalData(currentStop.code);
    showToast(
      apiSource === 'lta_datamall_v3'
        ? 'Synchronized with live LTA DataMall v3'
        : 'Arrival times refreshed via /api/bus-arrival'
    );
  };

  // Detect GPS Nearest Stop simulation
  const handleDetectGPS = () => {
    setIsDetectingGPS(true);
    setTimeout(() => {
      setIsDetectingGPS(false);
      setCurrentStop(BUS_STOPS['08031']);
      showToast('GPS: Closest stop confirmed as Dhoby Ghaut Stn Exit B (140m)');
      setStopSelectorOpen(false);
    }, 1200);
  };

  // Active bus info fallback
  const activeBusInfo =
    dynamicBusData[selectedBusNumber] ||
    dynamicBusData['147'] ||
    BUS_SERVICES_DATA['147'];

  return (
    <div
      className={`min-h-screen flex flex-col bg-background text-text-primary ${
        highContrast ? 'contrast-125' : ''
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="material-symbols-outlined text-load-seats-available text-base">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Alarm Active Badge Banner if set */}
      {activeAlarm && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-xs">
          <span className="material-symbols-outlined text-sm">alarm_on</span>
          <span>
            Active Arrival Alarm: Bus {selectedBusNumber} alert armed ({activeAlarm} stops away)
          </span>
          <button
            onClick={() => {
              setActiveAlarm(null);
              showToast('Arrival alarm cancelled');
            }}
            className="underline ml-2 hover:opacity-80 font-bold"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Top Navigation Bar */}
      <TopNavBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        currentStopName={`${currentStop.name.split(' ')[0]} / Orchard`}
        refreshSeconds={refreshSeconds}
        onRefresh={handleManualRefresh}
        onDetectStop={handleDetectGPS}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenPreferences={() => setPreferencesOpen(true)}
        unreadAlertsCount={2}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col gap-5">
        {/* If user is in Nearby Stops Tab (Default live view) */}
        {currentTab === 'nearby' && (
          <>
            {/* Hero Search & Geolocation Context Module */}
            <HeroSearch
              currentStop={currentStop}
              selectedBus={selectedBusNumber}
              onSelectBus={(bus) => {
                if (BUS_SERVICES_DATA[bus]) {
                  setSelectedBusNumber(bus);
                  showToast(`Tracking live arrivals for Bus ${bus}`);
                } else {
                  showToast(`Bus ${bus} is not currently near Dhoby Ghaut corridor`);
                  setSelectedBusNumber(bus);
                }
              }}
              onOpenStopSelector={() => setStopSelectorOpen(true)}
              quickSelectBuses={quickSelectBuses}
            />

            {/* Main Content Grid: 8 Columns Live Arrival & Route, 4 Columns Multi-service Stop Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Primary Arrival & Route Column (8 Cols) */}
              <div className="lg:col-span-8 flex flex-col gap-5">
                {/* Hero Bus Arrival Card */}
                <BusArrivalCard
                  busInfo={activeBusInfo}
                  isFavorite={favorites.includes(activeBusInfo.busNumber)}
                  onToggleFavorite={() => toggleFavorite(activeBusInfo.busNumber)}
                  onShare={() => setShareModalOpen(true)}
                  currentStopName={currentStop.name}
                />

                {/* Interactive Route Progression */}
                <RouteProgression
                  busInfo={activeBusInfo}
                  onViewFullRoute={() => setFullRouteOpen(true)}
                  onSetAlarm={() => setAlarmModalOpen(true)}
                />
              </div>

              {/* Right Column: Nearest Stop Context & All Services at this Stop (4 Cols) */}
              <aside className="lg:col-span-4 flex flex-col gap-5">
                {/* Stop Overview Card */}
                <StopOverview
                  stop={currentStop}
                  onOpenMapDirections={() => setMapModalOpen(true)}
                  onOpenStopSelector={() => setStopSelectorOpen(true)}
                />

                {/* All Buses at Stop */}
                <AllBusesAtStop
                  stop={currentStop}
                  selectedBus={selectedBusNumber}
                  onSelectBus={(bus) => {
                    setSelectedBusNumber(bus);
                    showToast(`Switched tracking to Bus ${bus}`);
                  }}
                />

                {/* Service Alerts Widget */}
                <ServiceAlertsWidget
                  onViewAlerts={() => setNotificationsOpen(true)}
                />
              </aside>
            </div>
          </>
        )}

        {/* Tab 2: Bus Services Directory */}
        {currentTab === 'services' && (
          <BusServicesTab
            onSelectBus={(bus) => {
              setSelectedBusNumber(bus);
              setCurrentTab('nearby');
              showToast(`Tracking live arrivals for Bus ${bus}`);
            }}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {/* Tab 3: Journey Planner */}
        {currentTab === 'planner' && (
          <JourneyPlannerTab
            onTrackBus={(bus) => {
              setSelectedBusNumber(bus);
              setCurrentTab('nearby');
              showToast(`Tracking Bus ${bus} route`);
            }}
          />
        )}

        {/* Tab 4: Favorites */}
        {currentTab === 'favorites' && (
          <FavoritesTab
            favorites={favorites}
            onSelectBus={(bus) => {
              setSelectedBusNumber(bus);
              setCurrentTab('nearby');
              showToast(`Tracking live arrivals for Bus ${bus}`);
            }}
            onRemoveFavorite={toggleFavorite}
            onSwitchToServices={() => setCurrentTab('services')}
          />
        )}
      </main>

      {/* Mobile Quick Navigation Footer */}
      <nav
        className="md:hidden bg-surface-container-lowest border-t border-border-subtle sticky bottom-0 z-40 px-4 py-2 flex items-center justify-around shadow-lg"
        aria-label="Mobile Navigation"
      >
        <button
          onClick={() => setCurrentTab('nearby')}
          className={`flex flex-col items-center gap-0.5 ${
            currentTab === 'nearby' ? 'text-primary font-bold' : 'text-text-muted hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-xl" data-filled={currentTab === 'nearby'}>
            near_me
          </span>
          <span className="text-[10px]">Nearby</span>
        </button>

        <button
          onClick={() => setCurrentTab('services')}
          className={`flex flex-col items-center gap-0.5 ${
            currentTab === 'services' ? 'text-primary font-bold' : 'text-text-muted hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-xl">directions_bus</span>
          <span className="text-[10px]">Routes</span>
        </button>

        <button
          onClick={() => setCurrentTab('planner')}
          className={`flex flex-col items-center gap-0.5 ${
            currentTab === 'planner' ? 'text-primary font-bold' : 'text-text-muted hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-xl">map</span>
          <span className="text-[10px]">Planner</span>
        </button>

        <button
          onClick={() => setCurrentTab('favorites')}
          className={`flex flex-col items-center gap-0.5 ${
            currentTab === 'favorites' ? 'text-primary font-bold' : 'text-text-muted hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-xl" data-filled={currentTab === 'favorites'}>
            bookmark
          </span>
          <span className="text-[10px]">Saved</span>
        </button>
      </nav>

      {/* Civic Footer Information */}
      <footer className="bg-surface-container-lowest border-t border-border-subtle py-6 px-4 md:px-8 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="font-bold text-primary">SBS Transit Live Direct</span>
            <span>•</span>
            <span>Data synchronized with Land Transport Authority (LTA) Datamall API</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTransitInfoTopic('conditions')}
              className="hover:underline hover:text-primary transition-colors"
            >
              Conditions of Carriage
            </button>
            <button
              onClick={() => setTransitInfoTopic('fares')}
              className="hover:underline hover:text-primary transition-colors"
            >
              Fare Matrix
            </button>
            <button
              onClick={() => setTransitInfoTopic('safety')}
              className="hover:underline hover:text-primary transition-colors"
            >
              Transit Police & Safety
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <FullRouteModal
        isOpen={fullRouteOpen}
        onClose={() => setFullRouteOpen(false)}
        busNumber={activeBusInfo.busNumber}
        destination={activeBusInfo.destination}
      />

      <SetAlarmModal
        isOpen={alarmModalOpen}
        onClose={() => setAlarmModalOpen(false)}
        busNumber={activeBusInfo.busNumber}
        stopName={currentStop.name}
        onAlarmSet={(stops) => {
          setActiveAlarm(stops);
          showToast(`Alarm set for Bus ${activeBusInfo.busNumber} (${stops} stops away)`);
        }}
        activeAlarm={activeAlarm}
        onCancelAlarm={() => {
          setActiveAlarm(null);
          showToast('Arrival alarm cancelled');
        }}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        busInfo={activeBusInfo}
        stopName={currentStop.name}
      />

      <StopSelectorModal
        isOpen={stopSelectorOpen}
        onClose={() => setStopSelectorOpen(false)}
        currentStopCode={currentStop.code}
        onSelectStop={(stop) => {
          setCurrentStop(stop);
          showToast(`Stop switched to ${stop.name}`);
        }}
        onDetectGPS={handleDetectGPS}
        isDetecting={isDetectingGPS}
      />

      <MapDirectionsModal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        stop={currentStop}
      />

      <PreferencesModal
        isOpen={preferencesOpen}
        onClose={() => setPreferencesOpen(false)}
        refreshInterval={refreshInterval}
        onSetRefreshInterval={(sec) => {
          setRefreshInterval(sec);
          setRefreshSeconds(sec);
          showToast(`Auto-refresh interval set to ${sec}s`);
        }}
        soundAlertsEnabled={soundAlertsEnabled}
        onToggleSoundAlerts={() => setSoundAlertsEnabled(!soundAlertsEnabled)}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
      />

      <NotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onSelectBus={(bus) => {
          setSelectedBusNumber(bus);
          setCurrentTab('nearby');
          showToast(`Switched to Bus ${bus}`);
        }}
      />

      <TransitInfoModal
        isOpen={transitInfoTopic !== null}
        onClose={() => setTransitInfoTopic(null)}
        topic={transitInfoTopic || 'conditions'}
      />
    </div>
  );
}
