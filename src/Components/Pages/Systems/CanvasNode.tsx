import * as React from "react";

import Draggable from "react-draggable";
import { Rect } from "../../../data/SystemsDB";
import { BorderTrigger } from "./BorderTrigger";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { useForceUpdate } from "../../../Utils";

export type UpdateManager = {
  updates: Observable<Rect>;
  sendUpdate: (e: Rect) => void;
  initial: Rect;
};

export function CanvasNode(props: {
  children: (bounds: Rect) => React.ReactNode;
  scale: number;
  updateManager: UpdateManager;
}) {
  const isHoldingBorder = React.useRef(false);
  const containerRef = React.useRef<HTMLDivElement>();
  const bounds = React.useMemo<Rect>(() => props.updateManager.initial, [
    props.updateManager,
  ]);
  const forceRefresh = useForceUpdate();
  const lastBorderState = React.useRef<
    "tl" | "t" | "tr" | "l" | "r" | "br" | "b" | "bl" | "none"
  >("none");

  const update = React.useCallback(
    (calculate: (c: Rect) => Rect) => {
      const result = calculate(bounds);
      const filteredResult = {
        ...result,
        width: Math.max(result.width, 100),
        height: Math.max(result.height, 70),
      };
      Object.assign(bounds, filteredResult);
      forceRefresh();
      setTimeout(() => props.updateManager.sendUpdate(bounds), 50);
    },
    [bounds, forceRefresh, props.updateManager]
  );

  React.useEffect(() => {
    const sub = props.updateManager.updates
      .pipe(
        filter(
          (x) =>
            x.width !== bounds.width ||
            x.height !== bounds.height ||
            x.top !== bounds.top ||
            x.left !== bounds.left
        )
      )
      .subscribe({
        next: (v) => update(() => v),
      });
    return () => sub.unsubscribe();
  }, [props.updateManager, bounds, update]);

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isHoldingBorder.current) return;
      const movementX = e.movementX * props.scale;
      const movementY = e.movementY * props.scale;

      if (lastBorderState.current === "r")
        update((c) => ({
          ...c,
          width: c.width + movementX,
        }));
      if (lastBorderState.current === "br")
        update((c) => ({
          ...c,
          width: c.width + movementX,
          height: c.height + movementY,
        }));
      if (lastBorderState.current === "b")
        update((c) => ({
          ...c,
          height: c.height + movementY,
        }));
      if (lastBorderState.current === "bl")
        update((c) => ({
          ...c,
          width: c.width + -movementX,
          left: c.left + movementX,
          height: c.height + movementY,
        }));
      if (lastBorderState.current === "l")
        update((c) => ({
          ...c,
          width: c.width + -movementX,
          left: c.left + movementX,
        }));
      if (lastBorderState.current === "tl")
        update((c) => ({
          ...c,
          width: c.width + -movementX,
          top: c.top + movementY,
          left: c.left + movementX,
          height: c.height + -movementY,
        }));
      if (lastBorderState.current === "t")
        update((c) => ({
          ...c,
          top: c.top + movementY,
          height: c.height + -movementY,
        }));
      if (lastBorderState.current === "tr")
        update((c) => ({
          ...c,
          width: c.width + movementX,
          top: c.top + movementY,
          height: c.height + -movementY,
        }));
    };
    const onMouseUp = (e: MouseEvent) => {
      isHoldingBorder.current = false;
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isHoldingBorder, lastBorderState, props.scale, update]);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isHoldingBorder.current = true;
  };
  return (
    <Draggable
      handle=".handle"
      position={{ x: bounds.left, y: bounds.top }}
      onStop={(e, d) => {
        update((c) => ({
          ...c,
          left: d.x,
          top: d.y,
        }));
      }}
      scale={props.scale}
    >
      <div ref={containerRef as any} style={{ position: "absolute" }}>
        <BorderTrigger
          onMouseDown={onMouseDown}
          borderWidth={10}
          onL={() =>
            !isHoldingBorder.current && (lastBorderState.current = "l")
          }
          onR={() =>
            !isHoldingBorder.current && (lastBorderState.current = "r")
          }
          onTL={() =>
            !isHoldingBorder.current && (lastBorderState.current = "tl")
          }
          onT={() =>
            !isHoldingBorder.current && (lastBorderState.current = "t")
          }
          onTR={() =>
            !isHoldingBorder.current && (lastBorderState.current = "tr")
          }
          onBL={() =>
            !isHoldingBorder.current && (lastBorderState.current = "bl")
          }
          onB={() =>
            !isHoldingBorder.current && (lastBorderState.current = "b")
          }
          onBR={() =>
            !isHoldingBorder.current && (lastBorderState.current = "br")
          }
        >
          {props.children(bounds)}
        </BorderTrigger>
      </div>
    </Draggable>
  );
}
