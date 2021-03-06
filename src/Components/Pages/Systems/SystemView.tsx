import * as React from "react";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { CanvasNode, UpdateManager } from "./CanvasNode";
import { System, useSystemsDBContext } from "../../../data/SystemsDB";
import { useObservable } from "../../../Utils";
import { Icon } from "@material-ui/core";

type SystemProps = {
  system: Observable<System>;
  systemKey: string;
  scale: number;
  onClick?: (system: System) => void;
};

export function SystemView(props: SystemProps) {
  const system = useObservable(props.system, null);
  const db = useSystemsDBContext();
  const positionRef = React.useRef<HTMLParagraphElement>();
  const systemGoals = useObservable(
    () => db.getSystemGoals(props.systemKey),
    []
  );
  const updateManager = React.useMemo<UpdateManager>(
    () => ({
      sendUpdate: (v) =>
        db.updateSystemWithKey(props.systemKey, (current) => ({
          ...current,
          bounds: v,
        })),
      initial: db.getSystemInitialValue(props.systemKey).bounds,
      updates: props.system.pipe(
        map((v) => v.bounds),
        tap((x) => {
          if (positionRef.current != null) {
            const _pos = `${x.left.toFixed(2)}, ${x.top.toFixed(2)}`;
            const _bounds = `w${x.width.toFixed()}h${x.height.toFixed()}`;
            positionRef.current.innerText = `${_pos} ${_bounds};`;
          }
        })
      ),
    }),
    [props.systemKey, db, props.system]
  );
  if (system == null) return null;
  const borderColor = "rgba(0,0,0,0.6)";
  const systemNameBorder = `${borderColor} dashed`;
  return (
    <CanvasNode updateManager={updateManager} scale={props.scale}>
      {(bounds) => (
        <div
          onClick={() => props.onClick != null && props.onClick(system)}
          style={{
            padding: 5,
            width: bounds.width,
            height: bounds.height,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderColor: borderColor,
            borderWidth: 2,
            borderStyle: "dashed",
            borderRadius: 5,
            borderTopLeftRadius: 0,
            pointerEvents: "visible",
          }}
        >
          <Icon className="handle">{"drag_handle"}</Icon>
          <Icon
            style={{ cursor: "pointer", position: "absolute", left: 50 }}
            onClick={() => {
              const isConfirmed = window.confirm(
                "Are you sure you want to delete this system?"
              );
              if (!isConfirmed) return;
              db.deleteSystem(props.systemKey);
            }}
          >
            {"delete"}
          </Icon>
          <p
            style={{ position: "absolute", bottom: 0, left: 15 }}
          >{`${systemGoals.length} Goals`}</p>
          <div
            style={{
              position: "absolute",
              top: -38,
              fontSize: "25pt",
              paddingLeft: 5,
              paddingRight: 5,
              left: 10,
              borderLeft: systemNameBorder,
              borderTop: systemNameBorder,
              borderRight: systemNameBorder,
              borderWidth: 2,
            }}
            onClick={() => {
              const newName = prompt("Enter system name", system.name);
              if (newName == null) return;
              db.updateSystemWithKey(props.systemKey, (c) => ({
                ...c,
                name: newName,
              }));
            }}
            dangerouslySetInnerHTML={{ __html: system.name }}
          ></div>
          <p
            ref={positionRef as any}
            style={{ position: "absolute", bottom: 0, right: 20, opacity: 0.5 }}
          ></p>
        </div>
      )}
    </CanvasNode>
  );
}
