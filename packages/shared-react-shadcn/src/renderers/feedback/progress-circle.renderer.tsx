import { useUpdates } from "@statewalker/shared-react/hooks";
import type { ProgressCircleView } from "@statewalker/shared-views";

const sizeMap = { S: 24, M: 32, L: 48 };

export function ProgressCircleRenderer({
  model,
}: {
  model: ProgressCircleView;
}) {
  useUpdates(model.onUpdate);

  const size = sizeMap[model.size] ?? 32;
  const strokeWidth = size <= 24 ? 2 : 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const range = model.maxValue - model.minValue;
  const pct =
    model.isIndeterminate || range === 0
      ? 0.25
      : ((model.value ?? 0) - model.minValue) / range;
  const offset = circumference * (1 - pct);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={model.isIndeterminate ? "animate-spin" : ""}
      aria-label="Progress"
      role="img"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-secondary"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-primary"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}
