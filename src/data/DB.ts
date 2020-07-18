export type Currency = {
  name: string;
  unit: string;
  isTime: boolean;
  isGeneratable: boolean;
  icon: string;
  description: string;
};

export type ExhangeRate = {
  from: Currency;
  to: Currency;
  rate: number;
};

export class Database {
  private currencies: Currency[] = [];
  private exhangeRates: ExhangeRate[] = [];

  addOrUpdateCurrency(currency: Currency) {
    const result = this.currencies.find(x => x === currency);
    if (result != null) {
      Object.assign(result, currency);
    } else {
      this.currencies.push(currency);
    }
  }

  removeCurrency(currency: Currency) {
    this.currencies = this.currencies.filter((x) => x !== currency);
  }

  addOrUpdateExchangeRate(rate: ExhangeRate) {
    const result = this.exhangeRates.find(x => x === rate);
    if (result != null) {
      Object.assign(result, rate);
    } else {
      this.exhangeRates.push(rate);
    }
  }

  removeExchangeRate(rate: ExhangeRate) {
    this.exhangeRates = this.exhangeRates.filter((x) => x !== rate);
  }
}

export function CreateOrGetDefaultDatabase(): Database {
  const db = new Database();

  const jobCoding: Currency = {
    icon: "code",
    description: "all codes related to 8 to 5 codes",
    name: "Job coding",
    isGeneratable: true,
    isTime: true,
    unit: "hr",
  };

  const hobbyCodding: Currency = {
    icon: "code",
    description: "all codes non related to job like open source projects",
    name: "Hobby coding",
    isGeneratable: true,
    isTime: true,
    unit: "hr",
  };

  const game: Currency = {
    icon: "videogame_asset",
    description: "round of any game like Valorant or LoL",
    name: "Game",
    isGeneratable: false,
    isTime: false,
    unit: "round",
  };

  db.addOrUpdateCurrency(jobCoding);
  db.addOrUpdateCurrency(hobbyCodding);
  db.addOrUpdateCurrency(game);

  db.addOrUpdateExchangeRate({
    from: jobCoding,
    to: game,
    rate: 2,
  });

  db.addOrUpdateExchangeRate({
    from: hobbyCodding,
    to: game,
    rate: 1,
  });

  return new Database();
}
