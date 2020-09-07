import * as React from "react";
import { fromEvent, BehaviorSubject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import Draggable from "react-draggable";
import { makeStyles } from "@material-ui/styles";
import { Position, Config } from "../../../data/SystemsDB";
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

function calculateTransform({ zoomLevel, cameraPosition }: Config): string {
  return `transform:translate(${cameraPosition.x}px,${cameraPosition.y}px) scale(${zoomLevel})`;
}

export function SystemsPage() {
  const containerRef = React.useRef<HTMLDivElement>();
  const innerRef = React.useRef<HTMLDivElement>();
  const styles = useStyles({});
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const isHoldingMouseMiddleButton = useIsHoldinMouseKey(1);
  const [scale, setScale] = React.useState(1);
  const config = React.useMemo<Config>(
    () => ({
      cameraPosition: {
        x: 0,
        y: 0,
      },
      zoomLevel: 1,
    }),
    []
  );

  const updateInnerRefStyle = React.useCallback(
    (animate: boolean = false) => {
      if (innerRef.current == null)
        throw new Error("Unhandled situtation innerRef cannot be null here");
      let value = calculateTransform(config);
      const ANIMATION = ";transition: transform 100ms";
      if (animate) {
        innerRef.current.setAttribute(
          "style",
          innerRef.current.style + ANIMATION
        );
        value += ANIMATION;
      }

      innerRef.current.setAttribute("style", value);
    },
    [innerRef, config]
  );

  // on space reset zoom to 1
  React.useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      const SPACE_KEY_CODE = 32;
      if (e.keyCode === SPACE_KEY_CODE) {
        config.zoomLevel = 1;
        updateInnerRefStyle(true);
      }
    };
    window.document.addEventListener("keyup", onKeyUp);
    return () => window.document.removeEventListener("keyup", onKeyUp);
  }, [updateInnerRefStyle, config]);

  // zoom
  React.useEffect(() => {
    const _doUpdateScale = new BehaviorSubject(null);
    const sub = _doUpdateScale.pipe(debounceTime(100)).subscribe({
      next: () => setScale(config.zoomLevel),
    });
    const onMouseWheel = (e: WheelEvent) => {
      config.zoomLevel = Math.max(0.1, config.zoomLevel + e.deltaY * -0.0005);
      console.log(config);
      updateInnerRefStyle(true);
      _doUpdateScale.next(null);
    };
    window.document.addEventListener("wheel", onMouseWheel);
    return () => {
      window.document.removeEventListener("wheel", onMouseWheel);
      sub.unsubscribe();
    };
  }, [updateInnerRefStyle]);

  React.useLayoutEffect(() => {
    if (!isHoldingMouseMiddleButton) {
      document.body.style.cursor = "default";
      return;
    } else {
      document.body.style.cursor = "move";
    }

    const onMouseMove = (e: MouseEvent) => {
      config.cameraPosition.x += e.movementX;
      config.cameraPosition.y += e.movementY;
      // we directly update innerRef attribute because of performance resaons
      updateInnerRefStyle();
    };
    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [isHoldingMouseMiddleButton, innerRef, updateInnerRefStyle]);

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
      <div ref={innerRef as any} className={styles.innerContainer}>
        <Draggable
          handle=".handle"
          defaultPosition={{ x: 0, y: 0 }}
          scale={scale}
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
