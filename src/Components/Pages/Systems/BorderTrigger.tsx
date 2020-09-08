import React from "react";

type BorderTriggerEvent = {
  state: "entered" | "exited";
};

type TriggerEvent = (e: BorderTriggerEvent) => void;

export function BorderTrigger(props: {
  children: React.ReactNode;
  borderWidth: number;
  style?: React.CSSProperties;
  onTL?: TriggerEvent;
  onT?: TriggerEvent;
  onTR?: TriggerEvent;
  onL?: TriggerEvent;
  onR?: TriggerEvent;
  onBL?: TriggerEvent;
  onB?: TriggerEvent;
  onBR?: TriggerEvent;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  /*
  [ ]---------[ ]
   |           |
   |   child   |
   |           |
  [ ]---------[ ]
  */
  const rowStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
  };
  const cornerStyle: React.CSSProperties = {
    width: props.borderWidth,
    height: props.borderWidth,
  };
  const hLineStyle: React.CSSProperties = {
    flex: 1,
    height: props.borderWidth,
  };
  const vLineStyle: React.CSSProperties = {
    width: props.borderWidth,
  };
  return (
    <div
      style={{
        ...(props.style ?? {}),
        display: "flex",
        flexDirection: "column",
      }}
      onMouseMove={props.onMouseMove}
    >
      <div style={rowStyle}>
        <div
          onMouseEnter={
            props.onTL == null
              ? undefined
              : () => props.onTL!({ state: "entered" })
          }
          onMouseLeave={
            props.onTL == null
              ? undefined
              : () => props.onTL!({ state: "exited" })
          }
          onMouseDown={props.onMouseDown}
          onMouseUp={props.onMouseUp}
          style={{ ...cornerStyle, cursor: "nw-resize" }}
        ></div>
        <div
          onMouseEnter={
            props.onT == null
              ? undefined
              : () => props.onT!({ state: "entered" })
          }
          onMouseLeave={
            props.onT == null
              ? undefined
              : () => props.onT!({ state: "exited" })
          }
          onMouseDown={props.onMouseDown}
          onMouseUp={props.onMouseUp}
          style={{ ...hLineStyle, cursor: "n-resize" }}
        ></div>
        <div
          onMouseEnter={
            props.onTR == null
              ? undefined
              : () => props.onTR!({ state: "entered" })
          }
          onMouseLeave={
            props.onTR == null
              ? undefined
              : () => props.onTR!({ state: "exited" })
          }
          onMouseDown={props.onMouseDown}
          onMouseUp={props.onMouseUp}
          style={{ ...cornerStyle, cursor: "ne-resize" }}
        ></div>
      </div>
      <div style={rowStyle}>
        <div
          onMouseEnter={
            props.onL == null
              ? undefined
              : () => props.onL!({ state: "entered" })
          }
          onMouseLeave={
            props.onL == null
              ? undefined
              : () => props.onL!({ state: "exited" })
          }
          onMouseDown={props.onMouseDown}
          onMouseUp={props.onMouseUp}
          style={{ ...vLineStyle, cursor: "w-resize" }}
        ></div>
        <div>{props.children}</div>
        <div
          onMouseEnter={
            props.onR == null
              ? undefined
              : () => props.onR!({ state: "entered" })
          }
          onMouseLeave={
            props.onR == null
              ? undefined
              : () => props.onR!({ state: "exited" })
          }
          onMouseDown={props.onMouseDown}
          onMouseUp={props.onMouseUp}
          style={{ ...vLineStyle, cursor: "w-resize" }}
        ></div>
      </div>
      <div style={rowStyle}>
        <div
          onMouseEnter={
            props.onBL == null
              ? undefined
              : () => props.onBL!({ state: "entered" })
          }
          onMouseLeave={
            props.onBL == null
              ? undefined
              : () => props.onBL!({ state: "exited" })
          }
          onMouseDown={props.onMouseDown}
          onMouseUp={props.onMouseUp}
          style={{ ...cornerStyle, cursor: "sw-resize" }}
        ></div>
        <div
          onMouseEnter={
            props.onB == null
              ? undefined
              : () => props.onB!({ state: "entered" })
          }
          onMouseLeave={
            props.onB == null
              ? undefined
              : () => props.onB!({ state: "exited" })
          }
          onMouseDown={props.onMouseDown}
          onMouseUp={props.onMouseUp}
          style={{ ...hLineStyle, cursor: "n-resize" }}
        ></div>
        <div
          onMouseEnter={
            props.onBR == null
              ? undefined
              : () => props.onBR!({ state: "entered" })
          }
          onMouseLeave={
            props.onBR == null
              ? undefined
              : () => props.onBR!({ state: "exited" })
          }
          onMouseDown={props.onMouseDown}
          onMouseUp={props.onMouseUp}
          style={{ ...cornerStyle, cursor: "se-resize" }}
        ></div>
      </div>
    </div>
  );
}
