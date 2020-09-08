import * as React from "react";
import { Canvas } from "./Canvas";
import { useSystemsDBContext, Goal } from "../../../data/SystemsDB";
import { useObservable } from "../../../Utils";
import { Card, Icon, Box, Chip } from "@material-ui/core";
import { Observable } from "rxjs";
import { CanvasNode } from "./CanvasNode";

type GoalProps = {
  goal: Observable<Goal>;
  scale: number;
  selectedGoal?: Goal;
  onClick: (goal: Goal) => void;
};

function GoalView(props: GoalProps) {
  const goal = useObservable(props.goal, null);
  const isSelected = props.selectedGoal?.name === goal?.name;

  if (goal == null) return null;

  return (
    <CanvasNode scale={props.scale}>
      {(bounds) => (
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
              fontSize: 30,
            }}
            className="content"
            dangerouslySetInnerHTML={{ __html: goal.name }}
          ></div>
          <Box display="flex" flexDirection="row" flexWrap="warp">
            {goal.labels.map((label, i) => (
              <Chip size="small" key={i} label={label} />
            ))}
          </Box>
        </Card>
      )}
    </CanvasNode>
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
