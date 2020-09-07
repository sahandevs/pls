import * as React from "react";

import Draggable from "react-draggable";
import { Canvas } from "./Canvas";
import { useSystemsDBContext, Goal } from "../../../data/SystemsDB";
import { useObservable } from "../../../Utils";
import { Card } from "@material-ui/core";
import { Observable } from "rxjs";

type GoalProps = {
  goal: Observable<Goal>;
  scale: number;
  selectedGoal?: Goal;
  onClick: (goal: Goal) => void;
};

function GoalView(props: GoalProps) {
  const goal = useObservable(props.goal, null);
  const isSelected = props.selectedGoal?.name === goal?.name;
  const isHoldingBorder = React.useRef(false);
  const [size, setSize] = React.useState(() => ({
    width: goal?.bounds?.width ?? 100,
    height: goal?.bounds?.height ?? 100,
  }));

  if (goal == null) return null;

  const onMouseEnterBorder = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const canvas = document.getElementById("canvas")!;
    const canvasSize = canvas.getBoundingClientRect();
    const mousePosInCanvasY = e.pageY - canvasSize.top;
    // TODO: support camera change
    // if mouse pos is between top and bottom we should use w-resize
    if (
      mousePosInCanvasY > goal.bounds.top &&
      goal.bounds.top + goal.bounds.height > mousePosInCanvasY
    ) {
      document.body.style.cursor = "w-resize";
    } else {
      document.body.style.cursor = "n-resize";
    }
  };

  const onMouseLeaveBorder = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    document.body.style.cursor = "default";
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isHoldingBorder.current = true;
    console.log("test");
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    isHoldingBorder.current = false;
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.persist();
    if (!isHoldingBorder.current) return;
    setSize((c) => ({
      width: c.width + e.movementX,
      height: c.height + e.movementY,
    }));
  };

  return (
    <Draggable
      handle=".handle"
      defaultPosition={{ x: goal.bounds.left, y: goal.bounds.top }}
      scale={props.scale}
      disabled={!isSelected}
      onStart={(e) => {
        // stops parent from receiving event
        e.stopPropagation();
      }}
    >
      <div
        style={{
          borderColor: "transparent",
          borderStyle: "solid",
          borderWidth: 5,
          position: "absolute",
          padding: 2,
        }}
        onMouseEnter={onMouseEnterBorder}
        onMouseLeave={onMouseLeaveBorder}
     
        onMouseMove={onMouseMove}
      >
        <Card
          onClick={() => props.onClick(goal)}
          className="handle"
          elevation={4}
          variant={isSelected ? "elevation" : "outlined"}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          style={{
            padding: 5,
            width: size.width,
            height: size.height,
            userSelect: "none",
          }}
        >
          {goal.name}
        </Card>
      </div>
    </Draggable>
  );
}

export function SystemsPage() {
  const db = useSystemsDBContext();
  const scale = useObservable(() => db.getZoomLevel(), 1);
  const goals = useObservable(() => db.getGoalsWithKey(), []);

  const [selectedGoal, setSelectedGoal] = React.useState<Goal | undefined>();

  return (
    <Canvas>
      {goals.map(([goal, key]) => (
        <GoalView
          key={key}
          goal={goal}
          scale={scale}
          onClick={(goal) => {
            if (selectedGoal == null) {
              setSelectedGoal(goal);
            } else {
              setSelectedGoal(undefined);
            }
          }}
          selectedGoal={selectedGoal}
        />
      ))}
    </Canvas>
  );
}
