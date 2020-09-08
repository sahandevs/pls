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
  const updateManager = React.useMemo<UpdateManager>(
    () => ({
      sendUpdate: (v) =>
        db.updateGoalWithKey(props.goalKey, (current) => ({
          ...current,
          bounds: v,
        })),
      initial: db.getGoalInitialValue(props.goalKey).bounds,
      updates: props.goal.pipe(map((v) => v.bounds)),
    }),
    [props.goalKey, db, props.goal]
  );
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
            display: "flex",
            flexDirection: "column",
            userSelect: "none",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Icon className="handle">{"drag_handle"}</Icon>
            <Icon
              style={{ cursor: "pointer" }}
              onClick={() => {
                const isConfirmed = window.confirm(
                  "Are you sure you want to delete this goal?"
                );
                if (!isConfirmed) return;
                db.deleteGoal(props.goalKey);
              }}
            >
              {"delete"}
            </Icon>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "baseline",
              fontSize: 30,
              alignSelf: "center",
              cursor: "pointer",
            }}
            className="content"
            onClick={() => {
              const newName = prompt("Enter goal name", goal.name);
              if (newName == null) return;
              db.updateGoalWithKey(props.goalKey, (c) => ({
                ...c,
                name: newName,
              }));
            }}
            dangerouslySetInnerHTML={{ __html: goal.name }}
          ></div>
          <Box display="flex" flexDirection="row" flexWrap="warp">
            {goal.labels.map((label, i) => (
              <Chip
                onClick={() => {
                  const isConfirmed = window.confirm(
                    "Are you sure you want to delete this label?"
                  );
                  if (!isConfirmed) return;
                  db.updateGoalWithKey(props.goalKey, (c) => ({
                    ...c,
                    labels: c.labels.filter((x) => x !== label),
                  }));
                }}
                style={{ margin: 3 }}
                size="small"
                key={i}
                label={label}
              />
            ))}
            <Chip
              onClick={() => {
                const labelValue = prompt("Enter label text");
                if (labelValue == null) return;
                db.updateGoalWithKey(props.goalKey, (c) => ({
                  ...c,
                  labels: [...c.labels, labelValue],
                }));
              }}
              style={{ margin: 3, cursor: "pointer" }}
              size="small"
              color="primary"
              label={"+"}
            />
          </Box>
        </Card>
      )}
    </CanvasNode>
  );
}
