import * as React from "react";

import Draggable from "react-draggable";
import { Canvas } from "./Canvas";
import { useSystemsDBContext } from "../../../data/SystemsDB";
import { useObservable } from "../../../Utils";

export function SystemsPage() {
  const db = useSystemsDBContext();
  const scale = useObservable(() => db.getZoomLevel(), 1);
  return (
    <Canvas>
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
    </Canvas>
  );
}
