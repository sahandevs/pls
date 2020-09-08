import * as React from "react";

import Draggable from "react-draggable";
import { Rect } from "../../../data/SystemsDB";
import { BorderTrigger } from "./BorderTrigger";

export function CanvasNode(props: {
  children: (bounds: Rect) => React.ReactNode;
  scale: number;
}) {
  const isHoldingBorder = React.useRef(false);
  const containerRef = React.useRef<HTMLDivElement>();
  const [bounds, setBounds] = React.useState<Rect>(() => ({
    width: 100,
    height: 100,
    left: 50,
    top: 50,
  }));
  const lastBorderState = React.useRef<
    "tl" | "t" | "tr" | "l" | "r" | "br" | "b" | "bl" | "none"
  >("none");

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isHoldingBorder.current) return;
      const movementX = e.movementX * props.scale;
      const movementY = e.movementY * props.scale;
      const update = (calculate: (c: Rect) => Rect) => {
        setBounds((c) => {
          const result = calculate(c);
          return {
            ...result,
            width: Math.max(result.width, 100),
            height: Math.max(result.height, 70),
          };
        });
      };
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
  }, [isHoldingBorder, lastBorderState, props.scale]);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isHoldingBorder.current = true;
  };
  return (
    <Draggable
      handle=".handle"
      position={{ x: bounds.left, y: bounds.top }}
      onStop={(e, d) => {
        setBounds((c) => ({
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
