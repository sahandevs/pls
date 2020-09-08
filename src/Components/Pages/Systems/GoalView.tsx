import * as React from "react";
import { Card, Icon, Box, Chip } from "@material-ui/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CanvasNode, UpdateManager } from "./CanvasNode";
import { Goal, useSystemsDBContext } from "../../../data/SystemsDB";
import { useObservable } from "../../../Utils";

type GoalProps = {
  goal: Observable<Goal>;
  goalKey: string;
  scale: number;
  selectedGoal?: Goal;
  onClick: (goal: Goal) => void;
};

export function GoalView(props: GoalProps) {
  const goal = useObservable(props.goal, null);
  const isSelected = props.selectedGoal?.name === goal?.name;
  const db = useSystemsDBContext();
  const updateManager = React.useMemo<UpdateManager>(() => ({
    sendUpdate: (v) => db.updateGoalWithKey(props.goalKey, (current) => ({...current, bounds: v})),
    initial: db.getGoalInitialValue(props.goalKey).bounds,
    updates: props.goal.pipe(map(v => v.bounds))
  }), [props.goalKey, db, props.goal]);
  if (goal == null) return null;

  return (
    <CanvasNode updateManager={updateManager} scale={props.scale}>
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
