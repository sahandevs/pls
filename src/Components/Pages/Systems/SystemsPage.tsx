import * as React from "react";

import Draggable from "react-draggable";
import { Canvas } from "./Canvas";
import { useSystemsDBContext, Goal, Rect } from "../../../data/SystemsDB";
import { useObservable } from "../../../Utils";
import { Card, Icon } from "@material-ui/core";
import { Observable } from "rxjs";
import { BorderTrigger } from "./BorderTrigger";

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
  const [bounds, setBounds] = React.useState<Rect>(() => ({
    width: goal?.bounds?.width ?? 100,
    height: goal?.bounds?.height ?? 100,
    left: 50,
    top: 50,
  }));
  const lastBorderState = React.useRef<
    "tl" | "t" | "tr" | "l" | "r" | "br" | "b" | "bl" | "none"
  >("none");

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isHoldingBorder.current) return;
      const movementX = e.movementX;
      const movementY = e.movementY;
      if (lastBorderState.current === "r")
        setBounds((c) => ({
          ...c,
          width: c.width + movementX,
        }));
      if (lastBorderState.current === "br")
        setBounds((c) => ({
          ...c,
          width: c.width + movementX,
          height: c.height + movementY,
        }));
      if (lastBorderState.current === "b")
        setBounds((c) => ({
          ...c,
          height: c.height + movementY,
        }));
        if (lastBorderState.current === "bl")
        setBounds((c) => ({
          ...c,
          width: c.width + -movementX,
          left: c.left + movementX,
          height: c.height + movementY,
        }));
        if (lastBorderState.current === "l")
        setBounds((c) => ({
          ...c,
          width: c.width + -movementX,
          left: c.left + movementX,
        }));
        if (lastBorderState.current === "tl")
        setBounds((c) => ({
          ...c,
          width: c.width + -movementX,
          top: c.top + movementY,
          left: c.left + movementX,
          height: c.height + -movementY,
        }));
        if (lastBorderState.current === "t")
        setBounds((c) => ({
          ...c,
          top: c.top + movementY,
          height: c.height + -movementY,
        }));
        if (lastBorderState.current === "tr")
        setBounds((c) => ({
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
  }, [isHoldingBorder, lastBorderState]);

  if (goal == null) return null;

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
          left:  d.x,
          top: d.y,
        }));
      
      }
        
      }
      scale={props.scale}
    >
      <div style={{ position: "absolute" }}>
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
          <Card
            onClick={() => props.onClick(goal)}
            elevation={4}
            variant={isSelected ? "elevation" : "outlined"}
            style={{
              padding: 5,
              width: bounds.width,
              height: bounds.height,
              userSelect: "none"
            }}
          >
            <Icon className="handle">{"drag_handle"}</Icon>
            {goal.name}
          </Card>
        </BorderTrigger>
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
