import { Observable, BehaviorSubject } from "rxjs";
import { map, take } from "rxjs/operators";
import React from "react";

export const DBContext = React.createContext<Database | null>(null);

export function useDBContext(): Database {
  const result = React.useContext(DBContext);
  if (result == null)
    throw new Error("useDBContext used outside of the context");
  return result;
}
export type Currency = {
  name: string;
  unit: string;
  isTime: boolean;
  isSource: boolean;
  icon: string;
  description: string;
};

export type ExchangeRate = {
  from: Currency;
  to: Currency;
  rate: number;
};

export type Bank = { [key: string]: number };

export class Database {
  private currencies = new BehaviorSubject<Currency[]>([]);
  private exchangeRates = new BehaviorSubject<ExchangeRate[]>([]);
  private bank = new BehaviorSubject<Bank>({});

  addOrUpdateCurrency(currency: Currency) {
    const newValue = [...this.currencies.value];
    const result = newValue.find((x) => x.name === currency.name);
    if (result != null) {
      Object.assign(result, currency);
    } else {
      newValue.push(currency);
    }
    this.currencies.next(newValue);
  }

  bankOf(currency: Currency): Observable<number> {
    return this.bank.pipe(
      map((bank) => {
        return bank[currency.name] ?? 0;
      })
    );
  }

  canSpend(currency: Currency, value: number): Observable<boolean> {
    return this.bankOf(currency).pipe(map((v) => v - value >= 0));
  }

  addToBank(currency: Currency, value: number) {
    this.bank.next({
      ...this.bank.value,
      [currency.name]: Math.max(
        0,
        (this.bank.value[currency.name] ?? 0) + value
      ),
    });
  }

  exchange(exchangeRate: ExchangeRate, value: number) {
    this.canExchange(exchangeRate, value)
      .pipe(take(1))
      .subscribe({
        next: (canExchange) => {
          if (canExchange) {
            const newBank = { ...this.bank.value };
            if (newBank[exchangeRate.from.name] == null) {
              newBank[exchangeRate.from.name] = 0;
            }
            newBank[exchangeRate.from.name] -= value;
            if (newBank[exchangeRate.to.name] == null) {
              newBank[exchangeRate.to.name] = 0;
            }
            newBank[exchangeRate.to.name] += value * exchangeRate.rate;
            this.bank.next(newBank);
          }
        },
      });
  }

  canExchange(exchangeRate: ExchangeRate, value: number): Observable<boolean> {
    return this.bankOf(exchangeRate.from).pipe(map((v) => v >= value));
  }

  removeCurrency(currency: Currency) {
    this.currencies.next(
      this.currencies.value.filter((x) => x.name !== currency.name)
    );
  }

  addOrUpdateExchangeRate(rate: ExchangeRate) {
    const newValue = [...this.exchangeRates.value];
    const result = newValue.find(
      (x) => x.from.name === rate.from.name && x.to.name === rate.to.name
    );
    if (result != null) {
      Object.assign(result, rate);
    } else {
      newValue.push(rate);
    }
    this.exchangeRates.next(newValue);
  }

  removeExchangeRate(rate: ExchangeRate) {
    this.exchangeRates.next(
      this.exchangeRates.value.filter(
        (x) => x.from.name === rate.from.name && x.to.name === rate.to.name
      )
    );
  }

  getCurrencies(): Observable<Currency[]> {
    return this.currencies;
  }

  getExchangeRates(): Observable<ExchangeRate[]> {
    return this.exchangeRates;
  }
}

export function CreateOrGetDefaultDatabase(): Database {
  const db = new Database();

  const jobCoding: Currency = {
    icon: "code",
    description: "all codes related to 8 to 5 codes",
    name: "Job coding",
    isSource: true,
    isTime: true,
    unit: "hr",
  };

  const hobbyCodding: Currency = {
    icon: "code",
    description: "all codes non related to job like open source projects",
    name: "Hobby coding",
    isSource: true,
    isTime: true,
    unit: "hr",
  };

  const game: Currency = {
    icon: "videogame_asset",
    description: "round of any game like Valorant or LoL",
    name: "Game",
    isSource: false,
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

  return db;
}
