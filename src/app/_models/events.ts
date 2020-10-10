export class EventType {
  eventType: {
    id: number;
    name: string;
  };
  marketCount: number;
}

export class Competition {
  competition: {
    id: string;
    name: string;
  };
  marketCount: number;
  competitionRegion: string;
}

export class Event {
  event: {
    id: number;
    name: string;
    countryCode: string;
    timezone: string;
    openDate: Date;
  };
  marketCount: number;
}

export class Market {
  marketId: string;
  marketName: string;
  totalMatched: number;
}

export class MarketOdd {
  marketId: string;
  isMarketDataDelayed: boolean;
  status: string;
  isInplay: boolean;
  inplay: boolean;
  numberOfRunners: number;
  numberOfActiveRunners: number;
  lastMatchTime: Date;
  totalMatched: number;
  runners: Runner[];
}

export class Runner {
  selectionId: number;
  status: string;
  lastPriceTraded: number;
  totalMatched: number;
  ex: {
    availableToBack: Odd[];
    availableToLay: Odd[];
  };
}

export class Odd {
  price: number;
  size: number;
}
