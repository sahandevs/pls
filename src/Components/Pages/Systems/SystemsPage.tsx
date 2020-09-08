import * as React from "react";

import Draggable from "react-draggable";
import { Canvas } from "./Canvas";
import { useSystemsDBContext, Goal, Rect } from "../../../data/SystemsDB";
import { useObservable } from "../../../Utils";
import { Card, Icon, Box, Chip } from "@material-ui/core";
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
  const containerRef = React.useRef<HTMLDivElement>();
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
          <Card
            onClick={() => props.onClick(goal)}
            elevation={4}
            variant={isSelected ? "elevation" : "outlined"}
            style={{
              padding: 5,
              width: bounds.width,
              height: bounds.height,
              userSelect: "none",
            }}
          >
            <Icon className="handle">{"drag_handle"}</Icon>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "baseline",
                fontSize: 30
              }}
              className="content"
              dangerouslySetInnerHTML={{ __html: goal.name }}
            ></div>
            <Box display="flex" flexDirection="row" flexWrap="warp">
              {(goal.labels.map((label, i) => (
                <Chip size="small" key={i} label={label}/>
              )))}
            </Box>
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
