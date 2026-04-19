import type { DropPosition } from "./types.js";

export function calculateDropPosition(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number } | null,
): DropPosition {
  if (!rect) return "center";
  const normX = (clientX - rect.left) / rect.width;
  const normY = (clientY - rect.top) / rect.height;
  const threshold = 0.3;
  const dL = normX;
  const dR = 1 - normX;
  const dT = normY;
  const dB = 1 - normY;
  const min = Math.min(dL, dR, dT, dB);
  if (min > threshold) return "center";
  if (min === dL) return "left";
  if (min === dR) return "right";
  if (min === dT) return "top";
  return "bottom";
}
