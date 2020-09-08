import React from "react";
import { fromEvent, BehaviorSubject } from "rxjs";
import { debounceTime, take, skip } from "rxjs/operators";
import { makeStyles } from "@material-ui/styles";
import { Config, useSystemsDBContext } from "../../../data/SystemsDB";

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

export function Canvas(props: React.Props<{}>) {
  const containerRef = React.useRef<HTMLDivElement>();
  const innerRef = React.useRef<HTMLDivElement>();
  const db = useSystemsDBContext();
  const styles = useStyles({});
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const isHoldingMouseMiddleButton = useIsHoldinMouseKey(1);
  const [, setScale] = React.useState(1);
  const config = React.useMemo<Config>(() => db.config.value, [db]);

  const updateDbConfig = React.useCallback(() => {
    db.config.next(config);
  }, [db.config, config]);

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

  React.useEffect(() => {
    // skip default value and wait for server value
    const sub = db.config.pipe(skip(1), take(1)).subscribe({
      next: (v) => {
        config.cameraPosition = v.cameraPosition;
        config.zoomLevel = v.zoomLevel;
        updateInnerRefStyle(false);
      },
    });
    return () => sub.unsubscribe();
  }, [db, config, updateInnerRefStyle]);

  // on space reset zoom to 1
  React.useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      const SPACE_KEY_CODE = 32;
      if (e.keyCode === SPACE_KEY_CODE) {
        config.zoomLevel = 1;
        updateInnerRefStyle(true);
        updateDbConfig();
      }
    };
    window.document.addEventListener("keyup", onKeyUp);
    return () => window.document.removeEventListener("keyup", onKeyUp);
  }, [updateInnerRefStyle, config, updateDbConfig]);

  // zoom
  React.useEffect(() => {
    const _doUpdateScale = new BehaviorSubject(null);
    const sub = _doUpdateScale.pipe(debounceTime(100)).subscribe({
      next: () => setScale(config.zoomLevel),
    });
    const onMouseWheel = (e: WheelEvent) => {
      config.zoomLevel = Math.max(0.1, config.zoomLevel + e.deltaY * -0.0005);
      updateDbConfig();
      updateInnerRefStyle(true);
      _doUpdateScale.next(null);
    };
    window.document.addEventListener("wheel", onMouseWheel);
    return () => {
      window.document.removeEventListener("wheel", onMouseWheel);
      sub.unsubscribe();
    };
  }, [updateInnerRefStyle, config, updateDbConfig]);

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
      updateDbConfig();
      // we directly update innerRef attribute because of performance resaons
      updateInnerRefStyle();
    };
    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [
    isHoldingMouseMiddleButton,
    innerRef,
    updateInnerRefStyle,
    config,
    updateDbConfig,
  ]);

  // setup width and height
  React.useLayoutEffect(() => {
    const calculateAndUpdateSize = () => {
      if (containerRef.current == null) throw new Error("Unhandled situtation");
      const height =
        window.innerHeight - containerRef.current.getBoundingClientRect().top;
      const width = window.innerWidth;
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
      id="canvas"
      style={{
        width: size.width,
        height: size.height,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div ref={innerRef as any} className={styles.innerContainer}>
        {props.children}
      </div>
    </div>
  );
}
