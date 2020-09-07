import * as React from "react";
import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { distinct, map } from "rxjs/operators";

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
  private goals = new BehaviorSubject<BehaviorSubject<Goal>[]>([]);
  private connections = new BehaviorSubject<BehaviorSubject<Connection>[]>([]);
  private systems = new BehaviorSubject<BehaviorSubject<System>[]>([]);
  private config = new BehaviorSubject({
    zoomLevel: 1,
    cameraPosition: { x: 0, y: 0 },
  });

  constructor() {
    const testGoal1 = new BehaviorSubject({
      name: "This is a test goal",
      bounds: {
        height: 300,
        width: 100,
        left: 300,
        top: 300,
      },
      labels: ["Label1"],
    });
    this.goals.next([testGoal1]);
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
  } //

  getGoalsWithKey(): Observable<[Observable<Goal>, string][]> {
    return this.goals.pipe(map((x) => x.map((y) => [y, toKey(y.value)])));
  }

  getConnectionsWithKeys(): Observable<[Observable<Connection>, string][]> {
    return this.connections.pipe(map((x) => x.map((y) => [y, toKey(y.value)])));
  }

  getSystemGoals(_system: System): Observable<Observable<Goal>[]> {
    const sysSubject = this.systems.value.find(
      (x) => x.value.name === _system.name
    );
    if (sysSubject == null) throw new Error("System not found");
    throw combineLatest(sysSubject, this.goals).pipe(
      map(([system]) => {
        return this.goals.value.filter((x) =>
          isBoundAinY(x.value.bounds, system.bounds)
        );
      })
    );
  }
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
