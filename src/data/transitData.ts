export interface BusArrivalInfo {
  busNumber: string;
  routeCode: string;
  destination: string;
  origin: string;
  via: string;
  operator: 'SBS Transit Trunk' | 'SBS Transit Express' | 'SMRT Trunk' | 'Tower Transit' | 'Go-Ahead';
  frequencyPeak: string;
  isFavorite?: boolean;
  arrivals: {
    next: {
      mins: number;
      isArriving: boolean;
      load: 'sea' | 'sda' | 'lsd'; // sea = seats available, sda = standing available, lsd = limited standing (crowded)
      type: 'Double Deck' | 'Single Deck' | 'Bendy';
      feature: 'WAB';
      source: 'LIVE GPS' | 'Telemetry';
      plate: string;
      distanceMeters: number;
      speedKmh: number;
      lastPassed: string;
      currentJunction: string;
    };
    second: {
      mins: number;
      load: 'sea' | 'sda' | 'lsd';
      type: 'Double Deck' | 'Single Deck' | 'Bendy';
      feature: 'WAB';
      source: 'Telemetry' | 'Scheduled';
    };
    third: {
      mins: number;
      load: 'sea' | 'sda' | 'lsd';
      type: 'Double Deck' | 'Single Deck' | 'Bendy';
      feature: 'WAB';
      source: 'Scheduled' | 'Telemetry';
    };
  };
  stops: {
    id: string;
    code: string;
    name: string;
    road: string;
    passed?: boolean;
    isCurrent?: boolean;
    etaMins?: number;
    passedTimeAgo?: string;
    mrtLine?: { code: string; name: string; color: string; textColor?: string };
  }[];
  fullStopsCount: number;
}

export interface BusStop {
  code: string;
  name: string;
  road: string;
  landmark: string;
  distanceMeters: number;
  walkTimeMins: number;
  walkDirections: string;
  mrtLines: { code: string; name: string; bg: string; text: string }[];
  busesAtStop: {
    busNumber: string;
    destination: string;
    type: 'Double Deck' | 'Single Deck';
    feature: 'WAB';
    mins: number | 'Arr';
    load: 'sea' | 'sda' | 'lsd';
  }[];
}

export const BUS_STOPS: Record<string, BusStop> = {
  '08031': {
    code: '08031',
    name: 'Dhoby Ghaut Stn Exit B',
    road: 'Penang Rd',
    landmark: 'Opposite Plaza Singapura',
    distanceMeters: 140,
    walkTimeMins: 2,
    walkDirections: 'Cross at covered walkway near Exit B',
    mrtLines: [
      { code: 'NS', name: 'North South', bg: '#DC2626', text: '#FFFFFF' },
      { code: 'NE', name: 'North East', bg: '#8F3D93', text: '#FFFFFF' },
      { code: 'CC', name: 'Circle Line', bg: '#FFA900', text: '#000000' },
    ],
    busesAtStop: [
      { busNumber: '147', destination: 'Clementi Int', type: 'Double Deck', feature: 'WAB', mins: 3, load: 'sea' },
      { busNumber: '7', destination: 'Bedok Int', type: 'Single Deck', feature: 'WAB', mins: 5, load: 'sda' },
      { busNumber: '16', destination: 'Bedok via Marine Parade', type: 'Double Deck', feature: 'WAB', mins: 'Arr', load: 'sea' },
      { busNumber: '111', destination: 'Ghim Moh Ter', type: 'Double Deck', feature: 'WAB', mins: 8, load: 'sea' },
      { busNumber: '175', destination: 'Clementi Int', type: 'Single Deck', feature: 'WAB', mins: 14, load: 'lsd' },
    ],
  },
  '08069': {
    code: '08069',
    name: 'Rendezvous Hotel Singapore',
    road: 'Bras Basah Rd',
    landmark: 'Beside Bencoolen MRT Exit A',
    distanceMeters: 380,
    walkTimeMins: 5,
    walkDirections: 'Head east along Bras Basah Rd toward Bencoolen St',
    mrtLines: [
      { code: 'DT21', name: 'Downtown Line', bg: '#0056B3', text: '#FFFFFF' },
      { code: 'CC2', name: 'Circle Line', bg: '#FFA900', text: '#000000' },
    ],
    busesAtStop: [
      { busNumber: '147', destination: 'Clementi Int', type: 'Double Deck', feature: 'WAB', mins: 1, load: 'sea' },
      { busNumber: '65', destination: 'HarbourFront Int', type: 'Double Deck', feature: 'WAB', mins: 4, load: 'sda' },
      { busNumber: '166', destination: 'Clementi Int', type: 'Double Deck', feature: 'WAB', mins: 7, load: 'sea' },
      { busNumber: '857', destination: 'Yishun Int', type: 'Double Deck', feature: 'WAB', mins: 12, load: 'lsd' },
    ],
  },
  '09059': {
    code: '09059',
    name: 'Somerset Stn',
    road: 'Somerset Rd',
    landmark: 'Outside 313@Somerset / Orchard Gateway',
    distanceMeters: 620,
    walkTimeMins: 8,
    walkDirections: 'Walk west down Penang Rd into Somerset corridor',
    mrtLines: [
      { code: 'NS23', name: 'North South', bg: '#DC2626', text: '#FFFFFF' },
    ],
    busesAtStop: [
      { busNumber: '147', destination: 'Clementi Int', type: 'Double Deck', feature: 'WAB', mins: 9, load: 'sea' },
      { busNumber: '143', destination: 'Jurong East Int', type: 'Double Deck', feature: 'WAB', mins: 4, load: 'sda' },
      { busNumber: '7', destination: 'Bedok Int', type: 'Single Deck', feature: 'WAB', mins: 11, load: 'sea' },
      { busNumber: '65', destination: 'HarbourFront Int', type: 'Double Deck', feature: 'WAB', mins: 15, load: 'lsd' },
    ],
  },
  '08137': {
    code: '08137',
    name: 'Orchard Plaza',
    road: 'Orchard Rd',
    landmark: 'Opposite The Centrepoint',
    distanceMeters: 750,
    walkTimeMins: 10,
    walkDirections: 'Head past Orchard Gateway walkway toward Plaza',
    mrtLines: [
      { code: 'NS22', name: 'North South', bg: '#DC2626', text: '#FFFFFF' },
      { code: 'TE14', name: 'Thomson-East Coast', bg: '#9D5B25', text: '#FFFFFF' },
    ],
    busesAtStop: [
      { busNumber: '147', destination: 'Clementi Int', type: 'Double Deck', feature: 'WAB', mins: 13, load: 'sda' },
      { busNumber: '174', destination: 'Boon Lay Int', type: 'Double Deck', feature: 'WAB', mins: 6, load: 'sea' },
      { busNumber: '14', destination: 'Clementi Int', type: 'Single Deck', feature: 'WAB', mins: 8, load: 'lsd' },
    ],
  },
};

export const BUS_SERVICES_DATA: Record<string, BusArrivalInfo> = {
  '147': {
    busNumber: '147',
    routeCode: '147-1',
    destination: 'Clementi Int',
    origin: 'Hougang Central Int',
    via: 'Chinatown • Outram Park • Buona Vista',
    operator: 'SBS Transit Trunk',
    frequencyPeak: '8–11 mins',
    arrivals: {
      next: {
        mins: 3,
        isArriving: false,
        load: 'sea',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'LIVE GPS',
        plate: 'SBS 3288G',
        distanceMeters: 450,
        speedKmh: 32,
        lastPassed: 'Rendezvous Grand Hotel',
        currentJunction: 'At Penang Rd Junction',
      },
      second: {
        mins: 11,
        load: 'sda',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'Telemetry',
      },
      third: {
        mins: 24,
        load: 'lsd',
        type: 'Single Deck',
        feature: 'WAB',
        source: 'Scheduled',
      },
    },
    stops: [
      {
        id: 'stop-1',
        code: '08069',
        name: 'Rendezvous Hotel Singapore',
        road: 'Bras Basah Rd',
        passed: true,
        passedTimeAgo: 'Departed (2m ago)',
      },
      {
        id: 'stop-2',
        code: '08031',
        name: 'Dhoby Ghaut Stn Exit B',
        road: 'Penang Road • MRT Interchange (North East / North South / Circle Line)',
        isCurrent: true,
        etaMins: 3,
      },
      {
        id: 'stop-3',
        code: '08111',
        name: 'Winsland House',
        road: 'Penang Rd',
        etaMins: 6,
      },
      {
        id: 'stop-4',
        code: '09059',
        name: 'Somerset Stn',
        road: 'Somerset Rd',
        etaMins: 9,
        mrtLine: { code: 'NS23', name: 'North South', color: '#DC2626' },
      },
      {
        id: 'stop-5',
        code: '08137',
        name: 'Orchard Plaza',
        road: 'Orchard Rd',
        etaMins: 13,
      },
    ],
    fullStopsCount: 48,
  },
  '7': {
    busNumber: '7',
    routeCode: '7-1',
    destination: 'Bedok Int',
    origin: 'Clementi Int',
    via: 'Holland Village • Orchard Rd • Bugis • Geylang',
    operator: 'SBS Transit Trunk',
    frequencyPeak: '7–10 mins',
    arrivals: {
      next: {
        mins: 5,
        isArriving: false,
        load: 'sda',
        type: 'Single Deck',
        feature: 'WAB',
        source: 'LIVE GPS',
        plate: 'SBS 6742K',
        distanceMeters: 780,
        speedKmh: 28,
        lastPassed: 'SMU Bras Basah',
        currentJunction: 'Fort Canning Tunnel approach',
      },
      second: {
        mins: 14,
        load: 'sea',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'Telemetry',
      },
      third: {
        mins: 22,
        load: 'sea',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'Scheduled',
      },
    },
    stops: [
      { id: '7-1', code: '08069', name: 'Rendezvous Hotel Singapore', road: 'Bras Basah Rd', passed: true, passedTimeAgo: 'Departed (4m ago)' },
      { id: '7-2', code: '08031', name: 'Dhoby Ghaut Stn Exit B', road: 'Penang Road', isCurrent: true, etaMins: 5 },
      { id: '7-3', code: '08111', name: 'Winsland House', road: 'Penang Rd', etaMins: 8 },
      { id: '7-4', code: '09059', name: 'Somerset Stn', road: 'Somerset Rd', etaMins: 12, mrtLine: { code: 'NS23', name: 'North South', color: '#DC2626' } },
      { id: '7-5', code: '08137', name: 'Orchard Plaza', road: 'Orchard Rd', etaMins: 16 },
    ],
    fullStopsCount: 42,
  },
  '16': {
    busNumber: '16',
    routeCode: '16-1',
    destination: 'Bedok via Marine Parade',
    origin: 'Bukit Merah Int',
    via: 'Great World • Dhoby Ghaut • Tanjong Katong',
    operator: 'SBS Transit Trunk',
    frequencyPeak: '9–12 mins',
    arrivals: {
      next: {
        mins: 0,
        isArriving: true,
        load: 'sea',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'LIVE GPS',
        plate: 'SBS 8891M',
        distanceMeters: 80,
        speedKmh: 14,
        lastPassed: 'At Bay Entrance',
        currentJunction: 'Pulling into Dhoby Ghaut Bay',
      },
      second: {
        mins: 8,
        load: 'sda',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'Telemetry',
      },
      third: {
        mins: 19,
        load: 'sea',
        type: 'Single Deck',
        feature: 'WAB',
        source: 'Scheduled',
      },
    },
    stops: [
      { id: '16-1', code: '08069', name: 'Rendezvous Hotel Singapore', road: 'Bras Basah Rd', passed: true, passedTimeAgo: 'Departed (1m ago)' },
      { id: '16-2', code: '08031', name: 'Dhoby Ghaut Stn Exit B', road: 'Penang Road', isCurrent: true, etaMins: 0 },
      { id: '16-3', code: '08111', name: 'Winsland House', road: 'Penang Rd', etaMins: 4 },
      { id: '16-4', code: '09059', name: 'Somerset Stn', road: 'Somerset Rd', etaMins: 7, mrtLine: { code: 'NS23', name: 'North South', color: '#DC2626' } },
      { id: '16-5', code: '08137', name: 'Orchard Plaza', road: 'Orchard Rd', etaMins: 11 },
    ],
    fullStopsCount: 39,
  },
  '65': {
    busNumber: '65',
    routeCode: '65-1',
    destination: 'HarbourFront Int',
    origin: 'Tampines Int',
    via: 'Bedok Reservoir • MacPherson • Little India • Orchard',
    operator: 'SBS Transit Trunk',
    frequencyPeak: '8–10 mins',
    arrivals: {
      next: {
        mins: 4,
        isArriving: false,
        load: 'sda',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'LIVE GPS',
        plate: 'SBS 3412P',
        distanceMeters: 620,
        speedKmh: 35,
        lastPassed: 'Peace Centre',
        currentJunction: 'Middle Rd / Selegie junction',
      },
      second: {
        mins: 12,
        load: 'sea',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'Telemetry',
      },
      third: {
        mins: 20,
        load: 'lsd',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'Scheduled',
      },
    },
    stops: [
      { id: '65-1', code: '08069', name: 'Rendezvous Hotel Singapore', road: 'Bras Basah Rd', passed: true, passedTimeAgo: 'Departed (3m ago)' },
      { id: '65-2', code: '08031', name: 'Dhoby Ghaut Stn Exit B', road: 'Penang Road', isCurrent: true, etaMins: 4 },
      { id: '65-3', code: '08111', name: 'Winsland House', road: 'Penang Rd', etaMins: 7 },
      { id: '65-4', code: '09059', name: 'Somerset Stn', road: 'Somerset Rd', etaMins: 10, mrtLine: { code: 'NS23', name: 'North South', color: '#DC2626' } },
      { id: '65-5', code: '08137', name: 'Orchard Plaza', road: 'Orchard Rd', etaMins: 14 },
    ],
    fullStopsCount: 52,
  },
  '111': {
    busNumber: '111',
    routeCode: '111-1',
    destination: 'Ghim Moh Ter',
    origin: 'Ghim Moh Ter (Loop)',
    via: 'Commonwealth • Tanglin • Orchard • Dhoby Ghaut',
    operator: 'SBS Transit Trunk',
    frequencyPeak: '10–14 mins',
    arrivals: {
      next: {
        mins: 8,
        isArriving: false,
        load: 'sea',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'LIVE GPS',
        plate: 'SBS 7521T',
        distanceMeters: 1200,
        speedKmh: 30,
        lastPassed: 'Capitol Piazza',
        currentJunction: 'Stamford Rd / Hill St',
      },
      second: {
        mins: 17,
        load: 'sea',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'Telemetry',
      },
      third: {
        mins: 29,
        load: 'sda',
        type: 'Single Deck',
        feature: 'WAB',
        source: 'Scheduled',
      },
    },
    stops: [
      { id: '111-1', code: '08069', name: 'Rendezvous Hotel Singapore', road: 'Bras Basah Rd', passed: true, passedTimeAgo: 'Departed (6m ago)' },
      { id: '111-2', code: '08031', name: 'Dhoby Ghaut Stn Exit B', road: 'Penang Road', isCurrent: true, etaMins: 8 },
      { id: '111-3', code: '08111', name: 'Winsland House', road: 'Penang Rd', etaMins: 11 },
      { id: '111-4', code: '09059', name: 'Somerset Stn', road: 'Somerset Rd', etaMins: 15, mrtLine: { code: 'NS23', name: 'North South', color: '#DC2626' } },
      { id: '111-5', code: '08137', name: 'Orchard Plaza', road: 'Orchard Rd', etaMins: 19 },
    ],
    fullStopsCount: 36,
  },
  '166': {
    busNumber: '166',
    routeCode: '166-1',
    destination: 'Clementi Int',
    origin: 'Ang Mo Kio Int',
    via: 'Thomson • Novena • Dhoby Ghaut • Chinatown • HarbourFront',
    operator: 'SBS Transit Trunk',
    frequencyPeak: '9–12 mins',
    arrivals: {
      next: {
        mins: 6,
        isArriving: false,
        load: 'sea',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'LIVE GPS',
        plate: 'SBS 3980C',
        distanceMeters: 900,
        speedKmh: 33,
        lastPassed: 'Rochor Canal Rd',
        currentJunction: 'Selegie Rd Junction',
      },
      second: {
        mins: 16,
        load: 'sda',
        type: 'Single Deck',
        feature: 'WAB',
        source: 'Telemetry',
      },
      third: {
        mins: 26,
        load: 'sea',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'Scheduled',
      },
    },
    stops: [
      { id: '166-1', code: '08069', name: 'Rendezvous Hotel Singapore', road: 'Bras Basah Rd', passed: true, passedTimeAgo: 'Departed (4m ago)' },
      { id: '166-2', code: '08031', name: 'Dhoby Ghaut Stn Exit B', road: 'Penang Road', isCurrent: true, etaMins: 6 },
      { id: '166-3', code: '08111', name: 'Winsland House', road: 'Penang Rd', etaMins: 9 },
      { id: '166-4', code: '09059', name: 'Somerset Stn', road: 'Somerset Rd', etaMins: 13, mrtLine: { code: 'NS23', name: 'North South', color: '#DC2626' } },
      { id: '166-5', code: '08137', name: 'Orchard Plaza', road: 'Orchard Rd', etaMins: 17 },
    ],
    fullStopsCount: 45,
  },
  '174': {
    busNumber: '174',
    routeCode: '174-1',
    destination: 'Boon Lay Int',
    origin: 'Kampong Bahru Ter',
    via: 'Chinatown • Dhoby Ghaut • Bukit Timah • Jurong East',
    operator: 'SBS Transit Trunk',
    frequencyPeak: '8–12 mins',
    arrivals: {
      next: {
        mins: 7,
        isArriving: false,
        load: 'sda',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'LIVE GPS',
        plate: 'SBS 3201Z',
        distanceMeters: 1050,
        speedKmh: 29,
        lastPassed: 'National Museum',
        currentJunction: 'Fort Canning Road',
      },
      second: {
        mins: 15,
        load: 'sea',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'Telemetry',
      },
      third: {
        mins: 27,
        load: 'lsd',
        type: 'Single Deck',
        feature: 'WAB',
        source: 'Scheduled',
      },
    },
    stops: [
      { id: '174-1', code: '08069', name: 'Rendezvous Hotel Singapore', road: 'Bras Basah Rd', passed: true, passedTimeAgo: 'Departed (5m ago)' },
      { id: '174-2', code: '08031', name: 'Dhoby Ghaut Stn Exit B', road: 'Penang Road', isCurrent: true, etaMins: 7 },
      { id: '174-3', code: '08111', name: 'Winsland House', road: 'Penang Rd', etaMins: 10 },
      { id: '174-4', code: '09059', name: 'Somerset Stn', road: 'Somerset Rd', etaMins: 14, mrtLine: { code: 'NS23', name: 'North South', color: '#DC2626' } },
      { id: '174-5', code: '08137', name: 'Orchard Plaza', road: 'Orchard Rd', etaMins: 18 },
    ],
    fullStopsCount: 56,
  },
  '175': {
    busNumber: '175',
    routeCode: '175-1',
    destination: 'Clementi Int',
    origin: 'Lor 1 Geylang Ter',
    via: 'Bugis • Dhoby Ghaut • Queenstown • West Coast',
    operator: 'SBS Transit Trunk',
    frequencyPeak: '12–15 mins',
    arrivals: {
      next: {
        mins: 14,
        isArriving: false,
        load: 'lsd',
        type: 'Single Deck',
        feature: 'WAB',
        source: 'LIVE GPS',
        plate: 'SBS 2809L',
        distanceMeters: 2100,
        speedKmh: 31,
        lastPassed: 'Bugis Junction',
        currentJunction: 'Middle Road',
      },
      second: {
        mins: 25,
        load: 'sea',
        type: 'Single Deck',
        feature: 'WAB',
        source: 'Telemetry',
      },
      third: {
        mins: 38,
        load: 'sda',
        type: 'Single Deck',
        feature: 'WAB',
        source: 'Scheduled',
      },
    },
    stops: [
      { id: '175-1', code: '08069', name: 'Rendezvous Hotel Singapore', road: 'Bras Basah Rd', passed: true, passedTimeAgo: 'Departed (10m ago)' },
      { id: '175-2', code: '08031', name: 'Dhoby Ghaut Stn Exit B', road: 'Penang Road', isCurrent: true, etaMins: 14 },
      { id: '175-3', code: '08111', name: 'Winsland House', road: 'Penang Rd', etaMins: 17 },
      { id: '175-4', code: '09059', name: 'Somerset Stn', road: 'Somerset Rd', etaMins: 21, mrtLine: { code: 'NS23', name: 'North South', color: '#DC2626' } },
      { id: '175-5', code: '08137', name: 'Orchard Plaza', road: 'Orchard Rd', etaMins: 26 },
    ],
    fullStopsCount: 46,
  },
  '857': {
    busNumber: '857',
    routeCode: '857-1',
    destination: 'Yishun Int',
    origin: 'Yishun Int (Loop via Suntec)',
    via: 'Khatib • Lentor • CTE • Jalan Besar • Dhoby Ghaut',
    operator: 'Tower Transit',
    frequencyPeak: '6–9 mins',
    arrivals: {
      next: {
        mins: 2,
        isArriving: false,
        load: 'sda',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'LIVE GPS',
        plate: 'SG 5431D',
        distanceMeters: 310,
        speedKmh: 34,
        lastPassed: 'SMU Li Ka Shing',
        currentJunction: 'Bencoolen Junction',
      },
      second: {
        mins: 9,
        load: 'sea',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'Telemetry',
      },
      third: {
        mins: 17,
        load: 'sea',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'Scheduled',
      },
    },
    stops: [
      { id: '857-1', code: '08069', name: 'Rendezvous Hotel Singapore', road: 'Bras Basah Rd', passed: true, passedTimeAgo: 'Departed (1m ago)' },
      { id: '857-2', code: '08031', name: 'Dhoby Ghaut Stn Exit B', road: 'Penang Road', isCurrent: true, etaMins: 2 },
      { id: '857-3', code: '08111', name: 'Winsland House', road: 'Penang Rd', etaMins: 5 },
      { id: '857-4', code: '09059', name: 'Somerset Stn', road: 'Somerset Rd', etaMins: 8, mrtLine: { code: 'NS23', name: 'North South', color: '#DC2626' } },
      { id: '857-5', code: '08137', name: 'Orchard Plaza', road: 'Orchard Rd', etaMins: 12 },
    ],
    fullStopsCount: 40,
  },
  '14': {
    busNumber: '14',
    routeCode: '14-1',
    destination: 'Clementi Int',
    origin: 'Bedok Int',
    via: 'East Coast • Mountbatten • Orchard • Holland Village',
    operator: 'SBS Transit Trunk',
    frequencyPeak: '8–12 mins',
    arrivals: {
      next: {
        mins: 5,
        isArriving: false,
        load: 'sea',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'LIVE GPS',
        plate: 'SBS 3658S',
        distanceMeters: 740,
        speedKmh: 27,
        lastPassed: 'Singapore Art Museum',
        currentJunction: 'Bras Basah / Bencoolen St',
      },
      second: {
        mins: 13,
        load: 'sda',
        type: 'Single Deck',
        feature: 'WAB',
        source: 'Telemetry',
      },
      third: {
        mins: 23,
        load: 'lsd',
        type: 'Double Deck',
        feature: 'WAB',
        source: 'Scheduled',
      },
    },
    stops: [
      { id: '14-1', code: '08069', name: 'Rendezvous Hotel Singapore', road: 'Bras Basah Rd', passed: true, passedTimeAgo: 'Departed (3m ago)' },
      { id: '14-2', code: '08031', name: 'Dhoby Ghaut Stn Exit B', road: 'Penang Road', isCurrent: true, etaMins: 5 },
      { id: '14-3', code: '08111', name: 'Winsland House', road: 'Penang Rd', etaMins: 8 },
      { id: '14-4', code: '09059', name: 'Somerset Stn', road: 'Somerset Rd', etaMins: 12, mrtLine: { code: 'NS23', name: 'North South', color: '#DC2626' } },
      { id: '14-5', code: '08137', name: 'Orchard Plaza', road: 'Orchard Rd', etaMins: 16 },
    ],
    fullStopsCount: 50,
  },
};

// Complete route stops for "View Full 48-Stop Route" modal
export const FULL_ROUTE_STOPS_147 = [
  { seq: 1, code: '64009', name: 'Hougang Central Int', road: 'Hougang Ctrl', stage: 'Departed', isInterchange: true },
  { seq: 2, code: '64541', name: 'Blk 831', road: 'Hougang Ave 10', stage: 'Departed' },
  { seq: 3, code: '64531', name: 'Blk 838', road: 'Hougang Ave 10', stage: 'Departed' },
  { seq: 4, code: '64441', name: 'Opp Hougang Plaza', road: 'Upper Serangoon Rd', stage: 'Departed' },
  { seq: 5, code: '64381', name: 'Blk 465A', road: 'Upper Serangoon Rd', stage: 'Departed' },
  { seq: 6, code: '64331', name: 'The Midtown', road: 'Upper Serangoon Rd', stage: 'Departed' },
  { seq: 7, code: '64221', name: 'Opp Serangoon Pk', road: 'Upper Serangoon Rd', stage: 'Departed' },
  { seq: 8, code: '63081', name: 'Kovan Stn Exit B', road: 'Upper Serangoon Rd', stage: 'Departed', mrt: 'NE13' },
  { seq: 9, code: '63071', name: 'The Helping Hand', road: 'Upper Serangoon Rd', stage: 'Departed' },
  { seq: 10, code: '63061', name: 'Aft Upp Serangoon Shop Ctr', road: 'Upper Serangoon Rd', stage: 'Departed' },
  { seq: 11, code: '63041', name: 'Aft Sunshine Pk', road: 'Upper Serangoon Rd', stage: 'Departed' },
  { seq: 12, code: '66181', name: 'Serangoon Stn Exit C', road: 'Upper Serangoon Rd', stage: 'Departed', mrt: 'NE12/CC13' },
  { seq: 13, code: '66161', name: 'Opp Upp Serangoon Tech Pk', road: 'Upper Serangoon Rd', stage: 'Departed' },
  { seq: 14, code: '66151', name: 'Woodleigh Stn Exit A', road: 'Upper Serangoon Rd', stage: 'Departed', mrt: 'NE11' },
  { seq: 15, code: '60111', name: 'Potong Pasir Stn Exit B', road: 'Upper Serangoon Rd', stage: 'Departed', mrt: 'NE10' },
  { seq: 16, code: '60091', name: 'Sant Ritz', road: 'Upper Serangoon Rd', stage: 'Departed' },
  { seq: 17, code: '60081', name: 'Marr Thoma Ch', road: 'Upper Serangoon Rd', stage: 'Departed' },
  { seq: 18, code: '60071', name: 'Boon Keng Stn / Blk 102', road: 'Serangoon Rd', stage: 'Departed', mrt: 'NE9' },
  { seq: 19, code: '60051', name: 'Kwong Wai Shiu Hosp', road: 'Serangoon Rd', stage: 'Departed' },
  { seq: 20, code: '60031', name: 'Sri Srinivasa Perumal Tp', road: 'Serangoon Rd', stage: 'Departed' },
  { seq: 21, code: '07211', name: 'Farrer Park Stn Exit G', road: 'Serangoon Rd', stage: 'Departed', mrt: 'NE8' },
  { seq: 22, code: '07119', name: 'Tekka Ctr', road: 'Serangoon Rd', stage: 'Departed', mrt: 'NE7/DT12' },
  { seq: 23, code: '07011', name: 'Selegie Ctr', road: 'Selegie Rd', stage: 'Departed' },
  { seq: 24, code: '08079', name: 'Peace Ctr', road: 'Middle Rd', stage: 'Departed' },
  { seq: 25, code: '08069', name: 'Rendezvous Hotel Singapore', road: 'Bras Basah Rd', stage: 'Just Passed (2m ago)', isNear: true },
  { seq: 26, code: '08031', name: 'Dhoby Ghaut Stn Exit B', road: 'Penang Rd', stage: 'Arriving in 3m (YOU ARE HERE)', isCurrent: true, mrt: 'NS24/NE6/CC1' },
  { seq: 27, code: '08111', name: 'Winsland House', road: 'Penang Rd', stage: 'Upcoming (6m)' },
  { seq: 28, code: '09059', name: 'Somerset Stn', road: 'Somerset Rd', stage: 'Upcoming (9m)', mrt: 'NS23' },
  { seq: 29, code: '08137', name: 'Orchard Plaza', road: 'Orchard Rd', stage: 'Upcoming (13m)' },
  { seq: 30, code: '09037', name: 'Orchard Stn / Tangs', road: 'Orchard Rd', stage: 'Upcoming (16m)', mrt: 'NS22/TE14' },
  { seq: 31, code: '09022', name: 'Opp Paterson Lodge', road: 'Paterson Rd', stage: 'Upcoming (20m)' },
  { seq: 32, code: '06011', name: 'River Valley Primary Sch', road: 'River Valley Rd', stage: 'Upcoming (24m)' },
  { seq: 33, code: '06029', name: 'Great World Stn Exit 2', road: 'Kim Seng Rd', stage: 'Upcoming (27m)', mrt: 'TE15' },
  { seq: 34, code: '06071', name: 'Havelock Stn Exit 3', road: 'Havelock Rd', stage: 'Upcoming (31m)', mrt: 'TE16' },
  { seq: 35, code: '06159', name: 'Apollo Ctr', road: 'Havelock Rd', stage: 'Upcoming (35m)' },
  { seq: 36, code: '05019', name: 'Chinatown Stn Exit E', road: 'Eu Tong Sen St', stage: 'Upcoming (39m)', mrt: 'NE4/DT19' },
  { seq: 37, code: '05022', name: 'Pearl\'s Ctr', road: 'Eu Tong Sen St', stage: 'Upcoming (43m)' },
  { seq: 38, code: '05039', name: 'Outram Park Stn Exit 7', road: 'Eu Tong Sen St', stage: 'Upcoming (47m)', mrt: 'EW16/NE3/TE17' },
  { seq: 39, code: '10041', name: 'Blk 140', road: 'Jalan Bukit Merah', stage: 'Upcoming (51m)' },
  { seq: 40, code: '10061', name: 'Blk 201', road: 'Jalan Bukit Merah', stage: 'Upcoming (55m)' },
  { seq: 41, code: '10109', name: 'Aft Alexandra Hosp', road: 'Alexandra Rd', stage: 'Upcoming (59m)' },
  { seq: 42, code: '11019', name: 'Queenstown Stn Exit A', road: 'Commonwealth Ave', stage: 'Upcoming (64m)', mrt: 'EW19' },
  { seq: 43, code: '11129', name: 'Commonwealth Stn Exit B', road: 'Commonwealth Ave', stage: 'Upcoming (69m)', mrt: 'EW20' },
  { seq: 44, code: '11199', name: 'Buona Vista Stn Exit C', road: 'Commonwealth Ave', stage: 'Upcoming (74m)', mrt: 'EW21/CC22' },
  { seq: 45, code: '12111', name: 'Dover Stn Exit A', road: 'Commonwealth Ave West', stage: 'Upcoming (79m)', mrt: 'EW22' },
  { seq: 46, code: '17189', name: 'Singapore Polytechnic', road: 'Commonwealth Ave West', stage: 'Upcoming (83m)' },
  { seq: 47, code: '17179', name: 'Blk 329', road: 'Clementi Ave 2', stage: 'Upcoming (87m)' },
  { seq: 48, code: '17009', name: 'Clementi Int', road: 'Clementi Ave 3', stage: 'Terminus (92m)', isTerminus: true, mrt: 'EW23' },
];

export const INITIAL_FAVORITES = ['147', '7', '65'];

export const SERVICE_ALERTS = [
  {
    id: 'alert-1',
    title: 'Road Works: Orchard Rd',
    description: 'Expect slight 3–5 min delay near Dhoby Ghaut / Bencoolen corridor due to off-peak road resurfacing.',
    severity: 'info',
    impactedServices: ['147', '7', '16', '65', '111', '174', '175', '857'],
  },
  {
    id: 'alert-2',
    title: 'Diversion Notice: Chinatown Spring Festival',
    description: 'Services 147 and 166 will divert via New Bridge Rd on Saturday 18:00 to 23:59.',
    severity: 'warning',
    impactedServices: ['147', '166'],
  },
];
