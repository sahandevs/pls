import { Observable } from "rxjs";
import React from "react";
export function useObservable<T>(
  obs: Observable<T> | (() => Observable<T>),
  defaultValue: T
): T {
  const [value, setValue] = React.useState(defaultValue);
  React.useEffect(() => {
    const _obs = typeof obs === "function" ? obs() : obs;
    const sub = _obs.subscribe({
      next: (v) => {
        setValue(v);
      },
    });
    return () => sub.unsubscribe();
  }, [obs]);

  return value;
}

export function getOrAskUser(key: string): string {
  let value = localStorage.getItem(key);
  if (value == null) {
    value = prompt(key) ?? "";
    localStorage.setItem(key, value);
  }
  return value;
}