import * as React from "react";
import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";
import Draggable from "react-draggable";
import { makeStyles } from "@material-ui/styles";
import { Position } from "../../../data/SystemsDB";
const useStyles = makeStyles({
  rootContainer: {
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  innerContainer: {
    // TODO: max everything width + padding
    width: "100%",
    // TODO: max everyhing height + padding
    height: "100%",
    backgroundColor: "purple",
    position: "relative",
  },
});

function useIsHoldinMouseKey(keyCode: number): boolean {
  const [isDown, setIsDown] = React.useState(false);
  React.useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === keyCode) setIsDown(true);
    };
    const onMouseUp = (e: MouseEvent) => {
      if (e.button === keyCode) setIsDown(false);
    };
    window.document.addEventListener("mousedown", onMouseDown);
    window.document.addEventListener("mouseup", onMouseUp);
    return () => {
      window.document.removeEventListener("mousedown", onMouseDown);
      window.document.removeEventListener("mouseup", onMouseUp);
    };
  }, [keyCode]);
  return isDown;
}

export function SystemsPage() {
  const containerRef = React.useRef<HTMLDivElement>();
  const innerRef = React.useRef<HTMLDivElement>();
  const styles = useStyles({});
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const isHoldingMouseMiddleButton = useIsHoldinMouseKey(1);
  const cameraPos = React.useMemo<Position>(() => ({
    x: 0,
    y: 0,
  }), []);

  React.useLayoutEffect(() => {
    if (!isHoldingMouseMiddleButton) {
      document.body.style.cursor = "default";
      return;
    } else {
      document.body.style.cursor = "move";
    }
    
    const onMouseMove = (e: MouseEvent) => {
      cameraPos.x += e.movementX;
      cameraPos.y += e.movementY;
      // we directly update innerRef attribute because of performance resaons
      if (innerRef.current == null)
        throw new Error("Unhandled situtation innerRef cannot be null here");
      innerRef.current.setAttribute("style", `transform:translate(${cameraPos.x}px,${cameraPos.y}px)`)
    };
    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [isHoldingMouseMiddleButton, innerRef, cameraPos]);

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
      className={styles.rootContainer}
      style={{
        width: size.width,
        height: size.height,
        backgroundColor: "blue",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        ref={innerRef as any}
        className={styles.innerContainer}
      >
        <Draggable
          handle=".handle"
          defaultPosition={{ x: 0, y: 0 }}
          scale={1}
          onStart={(e) => {
            // stops parent from receiving event
            e.stopPropagation();
          }}
        >
          <div
            className="handle"
            style={{
              backgroundColor: "red",
              width: 50,
              height: 50,
              position: "absolute",
              left: -50,
              top: 5,
            }}
          >
            {"test"}
          </div>
        </Draggable>
      </div>
    </div>
  );
}
