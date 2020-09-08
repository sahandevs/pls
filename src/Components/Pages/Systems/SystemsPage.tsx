import * as React from "react";
import { Canvas } from "./Canvas";
import { useSystemsDBContext, Goal } from "../../../data/SystemsDB";
import { useObservable } from "../../../Utils";
import { GoalView } from "./GoalView";

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
