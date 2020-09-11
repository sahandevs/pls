import * as React from "react";
import { useSystemsDBContext, toKey } from "../../../data/SystemsDB";
import { getBoxToBoxArrow } from "perfect-arrows";
import { useObservable } from "../../../Utils";
type ConnectionProps = {};

export function ConnectionsView(props: ConnectionProps) {
  const db = useSystemsDBContext();
  const connections = useObservable(() => db.getConnectionsWithKeys(), []);
  return (
    <svg
      style={{
        width: "100%",
        overflow: "visible",
        height: "100%",
      }}
      stroke="#000"
      fill="#000"
      strokeWidth={3}
    >
      {connections.map(([connection, key]) => (
        <ConnectionView
          fromGoalKey={connection.from}
          toGoalKey={connection.to}
          key={key}
        />
      ))}
    </svg>
  );
}

function ConnectionView({
  fromGoalKey,
  toGoalKey,
}: {
  fromGoalKey: string;
  toGoalKey: string;
}) {
  const db = useSystemsDBContext();
  const from = useObservable(
    () => db.getGoalWithKey(fromGoalKey),
    db.getGoalInitialValue(fromGoalKey)
  );
  const to = useObservable(
    () => db.getGoalWithKey(toGoalKey),
    db.getGoalInitialValue(toGoalKey)
  );
  const [sx, sy, cx, cy, ex, ey, ae,] = getBoxToBoxArrow(
    from.bounds.left,
    from.bounds.top,
    from.bounds.width + 20,
    from.bounds.height + 20,
    to.bounds.left,
    to.bounds.top ,
    to.bounds.width + 20,
    to.bounds.height + 20, {
      bow: 0.1
    }
  );

  const endAngleAsDegrees = ae * (180 / Math.PI);
  console.log(sx, sy);
  return (
    <>
      <circle cx={sx} cy={sy} r={4} />
      <path
        d={`M${sx},${sy} Q${cx},${cy} ${ex},${ey}`}
        fill="none"
        onClick={() => {
          const isConfirmed = window.confirm(
            "Are you sure you want to delete this connection?"
          );
          if (!isConfirmed) return;
          db.deleteConnection(toKey({ from: fromGoalKey, to: toGoalKey }));
        }}
      />
      <polygon
        points="0,-6 12,0, 0,6"
        transform={`translate(${ex},${ey}) rotate(${endAngleAsDegrees})`}
      />
    </>
  );
}
