import * as React from "react";
import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { distinct, map, skip, debounceTime } from "rxjs/operators";

const firebase = (window as any).firebase;
export const SystemsDBContext = React.createContext<SystemsDB | null>(null);
export function useSystemsDBContext(): SystemsDB {
  const result = React.useContext(SystemsDBContext);
  if (result == null)
    throw new Error("useDBContext used outside of the context");
  return result;
}

export type Goal = {
  name: string;
  labels: string[];
  bounds: Rect;
};

export type Connection = {
  from: string;
  to: string;
};

export type Rect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type System = {
  name: string;
  labels: string[];
  bounds: Rect;
};

export type Position = { x: number; y: number };

export type Config = {
  zoomLevel: number;
  cameraPosition: Position;
};

export function toKey(obj: Goal | Connection | System): string {
  if (obj["name"] != null) return obj["name"];
  return obj["from"] + ":" + obj["to"];
}

export class SystemsDB {
  private _forceUpdate = new BehaviorSubject(null);
  private goals = new BehaviorSubject<BehaviorSubject<Goal>[]>([]);
  private connections = new BehaviorSubject<BehaviorSubject<Connection>[]>([]);
  private systems = new BehaviorSubject<BehaviorSubject<System>[]>([]);
  config = new BehaviorSubject({
    zoomLevel: 1,
    cameraPosition: { x: 0, y: 0 },
  });

  constructor() {
    combineLatest(
      this.goals.pipe(
        skip(1),
        map((x) => JSON.stringify(x.map((x) => x.value))),
        distinct()
      ),
      this.connections.pipe(
        skip(1),
        map((x) => JSON.stringify(x.map((x) => x.value))),
        distinct()
      ),
      this.systems.pipe(
        skip(1),
        map((x) => JSON.stringify(x.map((x) => x.value))),
        distinct()
      ),
      this.config.pipe(
        skip(1),
        map((x) => JSON.stringify(x)),
        distinct()
      ),
      this._forceUpdate
    )
      .pipe(debounceTime(1000))
      .subscribe({ next: () => this.save() });
  }

  getGoalInitialValue(key: string): Goal {
    const result = this.goals.value.find((x) => toKey(x.value) === key)?.value;
    if (result == null) throw new Error("goal not found");
    return result;
  }

  updateGoalWithKey(key: string, updated: (current: Goal) => Goal) {
    const result = this.goals.value.find((x) => toKey(x.value) === key);
    if (result == null) throw new Error("goal not found");
    const newValue = updated(result.value);
    if (
      this.goals.value.find((x) => toKey(x.value) === toKey(newValue) && x !== result) != null
    ) {
      alert("There is already another goal with this name");
      return;
    } else {
      result.next(newValue);
      this._forceUpdate.next(null);
    }
  }

  deleteGoal(key: string) {
    this.goals.next(this.goals.value.filter(x => toKey(x.value) !== key));
    // TODO: update connections
  }

  getZoomLevel(): Observable<number> {
    return this.config.pipe(
      distinct(),
      map((x) => x.zoomLevel)
    );
  }

  getCameraPosition(): Observable<Position> {
    return this.config.pipe(
      distinct(),
      map((x) => x.cameraPosition)
    );
  }

  getGoalsWithKey(): Observable<[Observable<Goal>, string][]> {
    return this.goals.pipe(map((x) => x.map((y) => [y, toKey(y.value)])));
  }

  getConnectionsWithKeys(): Observable<[Observable<Connection>, string][]> {
    return this.connections.pipe(map((x) => x.map((y) => [y, toKey(y.value)])));
  }

  getSystemGoals(_system: System): Observable<Observable<Goal>[]> {
    const sysSubject = this.systems.value.find(
      (x) => toKey(x.value) === toKey(_system)
    );
    if (sysSubject == null) throw new Error("System not found");
    // TODO: this implementation doesn't work when a goal itself moves
    return combineLatest(sysSubject, this.goals).pipe(
      map(([system]) => {
        return this.goals.value.filter((x) =>
          isBoundAinY(x.value.bounds, system.bounds)
        );
      })
    );
  }

  dbRef: any;

  loadFromFirebase(uid: string) {
    this.dbRef = firebase.database().ref(`systems/${uid}`);
    this.dbRef.on("value", (s: any) => {
      console.log("Updating Systems");
      const result = JSON.parse(s.val() ?? "{}");
      const goals: Goal[] = result["goals"] ?? [];
      const systems: System[] = result["systems"] ?? [];
      const connections: Connection[] = result["connections"] ?? [];
      const config: Config = result["config"] ?? {
        zoomLevel: 1,
        cameraPosition: { x: 0, y: 0 },
      };
      if (JSON.stringify(config) !== JSON.stringify(this.config.value))
        this.config.next(config);
      updateFromDiff(this.goals, goals);
      updateFromDiff(this.systems, systems);
      updateFromDiff(this.connections, connections);
    });
  }

  save() {
    const result = {
      goals: this.goals.value.map((x) => x.value),
      systems: this.systems.value.map((x) => x.value),
      connections: this.connections.value.map((x) => x.value),
      config: this.config.value,
    };
    const data = JSON.stringify(result);
    this.dbRef.set(data);
    console.log("Saving Systems");
  }
}

type SystesmDBEntities = System | Goal | Connection;

function updateFromDiff<T extends SystesmDBEntities>(
  old: BehaviorSubject<BehaviorSubject<T>[]>,
  _new: T[]
) {
  const indexedOldTargets: {
    [key: string]: BehaviorSubject<T>;
  } = {};
  const oldTargets = old.value.map((v) => {
    indexedOldTargets[toKey(v.value)] = v;
    return v.value;
  });

  const targetsDiff = findDiff(oldTargets, _new);
  const targetUpdateResult: BehaviorSubject<T>[] = [
    ...targetsDiff.newAdded.map((x) => new BehaviorSubject(x)),
  ];
  targetsDiff.existed.forEach((item) => {
    const _subject = indexedOldTargets[toKey(item)];
    targetUpdateResult.push(_subject);
    if (JSON.stringify(_subject.value) !== JSON.stringify(item)) {
      _subject.next(item);
    }
  });
  old.next(targetUpdateResult);
}

function findDiff<T extends SystesmDBEntities>(
  _olds: T[],
  news: T[]
): {
  newAdded: T[];
  deleted: T[];
  existed: T[];
} {
  const newAdded: T[] = [];
  const existed: T[] = [];
  outer: for (const _new of news) {
    for (const _old of _olds) {
      if (toKey(_old) === toKey(_new)) {
        existed.push(_new);
        continue outer;
      }
    }
    newAdded.push(_new);
  }
  const deleted = _olds.filter(
    (x) => !existed.map((x) => toKey(x)).includes(toKey(x))
  );

  return {
    newAdded,
    deleted,
    existed,
  };
}

if (process.env.NODE_ENV === "development") {
  // TODO: add these to test
  const _win = window as any;
  const connSet1: any[] = [
    {
      name: "a",
      labels: ["test1"],
    },
    {
      name: "b",
    },
    {
      name: "c",
    },
  ];
  const connSet2: any[] = [
    {
      name: "a",
      labels: [],
    },

    {
      name: "c",
    },
    {
      name: "k",
    },
  ];
  _win.findDiff = () => findDiff(connSet1, connSet2);
}

function isBoundAinY(a: Rect, b: Rect): boolean {
  if (a.left >= b.left) return false;
  if (a.top <= b.top) return false;
  if (a.left + a.width >= b.left + b.width) return false;
  if (a.top + a.height >= b.height + b.height) return false;

  return true;
}

export function CreateOrGetDefaultSystemsDatabase(): SystemsDB {
  const db = new SystemsDB();
  return db;
}
