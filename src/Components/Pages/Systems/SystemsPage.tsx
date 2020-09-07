import * as React from "react";
import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";

export function SystemsPage() {
  const containerRef = React.useRef<HTMLDivElement>();
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  // setup width and height
  React.useLayoutEffect(() => {
    const calculateAndUpdateSize = () => {
      if (containerRef.current == null) throw new Error("Unhandled situtation");
      const height =
        window.innerHeight - containerRef.current.getBoundingClientRect().top;
      const width = window.innerWidth;
      console.log("update", { height, width });
      setSize({ height, width });
    };
    calculateAndUpdateSize();
    const sub = fromEvent(window, "resize")
      .pipe(debounceTime(50))
      .subscribe({ next: () => calculateAndUpdateSize() });

    return () => sub.unsubscribe();
  }, [containerRef]);

  return (
    <div
      ref={containerRef as any}
      style={{ width: size.width, height: size.height }}
    ></div>
  );
}
