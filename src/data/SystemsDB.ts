import * as React from "react";
import { Observable } from "rxjs";

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
  private goals: Goal[] = [];
  private connections: Connection[] = [];
  private systems: System[] = [];
  private config: Config = {
    zoomLevel: 1,
    cameraPosition: {x:0, y:0},
  };

  getZoomLevel(): Observable<number> {
    throw new Error("Not implemented");
  }

  getCameraPosition(): Observable<Position> {
    throw new Error("Not implemented");
  }

  getGoals(): Observable<Observable<Goal>[]> {
    throw new Error("Not implemented");
  }

  getConnections(): Observable<Observable<Connection>[]> {
    throw new Error("Not implemented");
  }

  getSystemParent(system: System): Observable<System | undefined> {
    throw new Error("Not implemented");
  }

  getSystemGoals(system: System): Observable<Observable<Goal>[]> {
    throw new Error("Not implemented");
  }
}

export function CreateOrGetDefaultSystemsDatabase(): SystemsDB {
  const db = new SystemsDB();
  return db;
}
