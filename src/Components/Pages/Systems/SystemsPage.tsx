import * as React from "react";
import { Canvas } from "./Canvas";
import { useSystemsDBContext, Goal } from "../../../data/SystemsDB";
import { useObservable } from "../../../Utils";
import { GoalView } from "./GoalView";
import { Card, IconButton, Icon, Tooltip } from "@material-ui/core";

export function SystemsPage() {
  const db = useSystemsDBContext();
  const scale = useObservable(() => db.getZoomLevel(), 1);
  const goals = useObservable(() => db.getGoalsWithKey(), []);

  const [selectedGoal, setSelectedGoal] = React.useState<Goal | undefined>();

  return (
    <>
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
            goalKey={key}
            selectedGoal={selectedGoal}
          />
        ))}
      </Canvas>

      <Card
        elevation={10}
        style={{
          position: "absolute",
          top: 70,
          left: 20,
          opacity: 0.7,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Tooltip title="Add Goal">
          <IconButton
            onClick={() => {
              const goalName = prompt("Enter goal name");
              if (goalName == null) return;
              const goal: Goal = {
                labels: [],
                name: goalName,
                bounds: {
                  left: -db.config.value.cameraPosition.x,
                  top: -db.config.value.cameraPosition.y,
                  height: 300,
                  width: 400
                },
              };
              db.createGoal(goal);
            }}
          >
            <Icon>{"add"}</Icon>
          </IconButton>
        </Tooltip>
      </Card>
    </>
  );
}
