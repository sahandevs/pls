import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { map, take, skip, distinct, debounceTime } from "rxjs/operators";
import React from "react";

export const PLSDBContext = React.createContext<PLSDatabase | null>(null);
const firebase = (window as any).firebase;
export function usePLSDBContext(): PLSDatabase {
  const result = React.useContext(PLSDBContext);
  if (result == null)
    throw new Error("useDBContext used outside of the context");
  return result;
}

type Id = string;

export type Currency = {
  id: Id;
  name: string;
  unit: string;
  isSource: boolean;
  icon: string;
};

export type ExchangeRate = {
  from: Id;
  to: Id;
  rate: number;
};

export type Bank = { [key: string]: number };

type V1DB = {
  currencies: {
    name: string;
    unit: string;
    isTime: boolean;
    isSource: boolean;
    icon: string;
    description: string;
  }[];
  exchangeRates: {
    from: Currency;
    to: Currency;
    rate: number;
  }[];
  bank: { [key: string]: number };
};

type DB = {
  currencies: Currency[];
  exchangeRates: ExchangeRate[];
  bank: Bank;
  version: "2";
};

type DBs = V1DB | DB;

export class PLSDatabase {
  constructor() {
    combineLatest([
      this.bank.pipe(skip(1), distinct()),
      this.exchangeRates.pipe(skip(1), distinct()),
      this.currencies.pipe(skip(1), distinct()),
    ])
      .pipe(debounceTime(1000))
      .subscribe({ next: () => this.save() });
  }

  private currencies = new BehaviorSubject<Currency[]>([]);
  private exchangeRates = new BehaviorSubject<ExchangeRate[]>([]);
  private bank = new BehaviorSubject<Bank>({});

  addOrUpdateCurrency(currency: Currency) {
    const newValue = [...this.currencies.value];
    const result = newValue.find((x) => x.id === currency.id);
    if (result != null) {
      Object.assign(result, currency);
    } else {
      newValue.push(currency);
    }
    this.currencies.next(newValue);
  }

  get version(): DB["version"] {
    return "2";
  }

  getCurrency(id: Id): Currency | undefined {
    return this.currencies.value.find((x) => x.id === id);
  }

  bankOf(currency: Id): Observable<number> {
    return this.bank.pipe(
      map((bank) => {
        return bank[currency] ?? 0;
      })
    );
  }

  canSpend(currency: Currency, value: number): Observable<boolean> {
    return this.bankOf(currency.id).pipe(map((v) => v - value >= 0));
  }

  addToBank(currency: Currency, value: number) {
    this.bank.next({
      ...this.bank.value,
      [currency.id]: Math.max(
        0,
        (this.bank.value[currency.id] ?? 0) + value
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
            if (newBank[exchangeRate.from] == null) {
              newBank[exchangeRate.from] = 0;
            }
            newBank[exchangeRate.from] -= value;
            if (newBank[exchangeRate.to] == null) {
              newBank[exchangeRate.to] = 0;
            }
            newBank[exchangeRate.to] += value * exchangeRate.rate;
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
      this.currencies.value.filter((x) => x.id !== currency.id)
    );
  }

  addOrUpdateExchangeRate(rate: ExchangeRate) {
    const newValue = [...this.exchangeRates.value];
    const result = newValue.find(
      (x) => x.from === rate.from && x.to === rate.to
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
        (x) => x.from !== rate.from || x.to !== rate.to
      )
    );
  }

  getCurrencies(): Observable<Currency[]> {
    return this.currencies;
  }

  getExchangeRates(): Observable<ExchangeRate[]> {
    return this.exchangeRates;
  }

  dbRef: any;

  loadFromFirebase(uid: string) {
    firebase
      .firestore()
      .enablePersistence()
      .then((x) => console.log("OK enablePersistence", x))
      .catch((err) => console.error("NOK enablePersistence", err));
    this.dbRef = firebase.database().ref(`sync_data/${uid}`);
    console.log(this.dbRef);
    this.dbRef.on("value", (s: any) => {
      const result = JSON.parse(s.val() ?? "{}") as DBs;
      const db = migrateDb(result);
      this.currencies.next(db.currencies);
      this.exchangeRates.next(db.exchangeRates);
      this.bank.next(db.bank);
      console.log("Updating");
    });
  }

  backup() {
    const result = {
      currencies: this.currencies.value,
      exchangeRates: this.exchangeRates.value,
      bank: this.bank.value,
    };
    let data = JSON.stringify(result);
    localStorage.setItem("__backup_PLSDB", data);
    console.log("Backup", data);
  }

  floorAllBanks() {
    let bank: Bank = JSON.parse(JSON.stringify(this.bank.value));
    for (const key of Object.keys(bank)) {
      bank[key] = Math.floor(bank[key]);
    }
    this.bank.next(bank);
  }

  restoreBackup() {
    let data = localStorage.getItem("__backup_PLSDB");
    console.log("Restoring backup");
    this.dbRef.set(data);
  }

  save() {
    const result = {
      currencies: this.currencies.value,
      exchangeRates: this.exchangeRates.value,
      bank: this.bank.value,
      version: "2"
    };
    this.dbRef.set(JSON.stringify(result));
    console.log("Saving");
  }
}

export function CreateOrGetDefaultPLSDatabase(): PLSDatabase {
  const db = new PLSDatabase();
  (window as any).pls = db;
  return db;
}

export function newUuid(): string {
  return window.URL.createObjectURL(new Blob([])).split("/").pop()!;
}

function migrateDb(dbs: DBs): DB {
  if (dbs["version"] != null && dbs["version"] === "2") {
    return dbs as DB;
  }
  const old_db = dbs as V1DB;
  const new_db: DB = {
    bank: {},
    currencies: [],
    exchangeRates: [],
    version: "2",
  };
  const name_to_id: { [name: string]: string } = {};
  for (const c of old_db.currencies) {
    const id = newUuid();
    name_to_id[c.name] = id;
    new_db.currencies.push({
      icon: c.icon,
      id: id,
      isSource: c.isSource,
      name: c.name,
      unit: c.unit,
    });
  }

  for (const e of old_db.exchangeRates) {
    new_db.exchangeRates.push({
      from: name_to_id[e.from.name],
      to: name_to_id[e.to.name],
      rate: e.rate,
    });
  }

  for (const key of Object.keys(old_db.bank)) {
    new_db.bank[name_to_id[key]] = old_db.bank[key];
  }

  return new_db;
}
