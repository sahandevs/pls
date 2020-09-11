import * as React from "react";
import { Canvas } from "./Canvas";
import { useSystemsDBContext, Goal, System } from "../../../data/SystemsDB";
import { useObservable } from "../../../Utils";
import { GoalView } from "./GoalView";
import { Card, IconButton, Icon, Tooltip } from "@material-ui/core";
import { SystemView } from "./SystemView";
import { ConnectionsView } from "./ConnectionsView";

export function SystemsPage() {
  const db = useSystemsDBContext();
  const scale = useObservable(() => db.getZoomLevel(), 1);
  const goals = useObservable(() => db.getGoalsWithKey(), []);
  const systems = useObservable(() => db.getSystemsWithKey(), []);
  const [
    isInCreateConnectionMode,
    setIsInCreateConnectionMode,
  ] = React.useState(false);

  const [selectedFirstGoal, setSelectedFirstGoal] = React.useState<
    Goal | undefined
  >();

  return (
    <>
      <Canvas>
        {systems.map(([system, key]) => (
          <SystemView key={key} system={system} scale={scale} systemKey={key} />
        ))}

        {goals.map(([goal, key]) => (
          <GoalView
            key={key}
            goal={goal}
            scale={scale}
            onClick={(goal) => {
              if (!isInCreateConnectionMode) return;
              if (selectedFirstGoal == null) {
                setSelectedFirstGoal(goal);
              } else {
                db.createConnection({
                  from: selectedFirstGoal,
                  to: goal,
                });
                setSelectedFirstGoal(undefined);
                setIsInCreateConnectionMode(false);
              }
            }}
            goalKey={key}
            selectedGoal={selectedFirstGoal}
          />
        ))}
        <ConnectionsView />
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
                  width: 400,
                },
              };
              db.createGoal(goal);
            }}
          >
            <Icon>{"add"}</Icon>
          </IconButton>
        </Tooltip>

        <Tooltip title="Add System">
          <IconButton
            onClick={() => {
              const systemName = prompt("Enter system name");
              if (systemName == null) return;
              const system: System = {
                name: systemName,
                labels: [],
                bounds: {
                  left: -db.config.value.cameraPosition.x,
                  top: -db.config.value.cameraPosition.y,
                  height: 300,
                  width: 400,
                },
              };
              db.createSystem(system);
            }}
          >
            <Icon>{"add"}</Icon>
          </IconButton>
        </Tooltip>

        <Tooltip title="Toggle Connection creation">
          <IconButton
            onClick={() => {
              if (isInCreateConnectionMode) {
                setSelectedFirstGoal(undefined);
                setIsInCreateConnectionMode(false);
              } else {
                setIsInCreateConnectionMode(true);
              }
            }}
          >
            <Icon color={isInCreateConnectionMode ? "secondary" : "inherit"}>
              {"trending_flat"}
            </Icon>
          </IconButton>
        </Tooltip>
      </Card>
    </>
  );
}
