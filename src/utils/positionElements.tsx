import { mixTouchEvent, mouseEvent, touchEvent } from "../types";

export const getPositionEvent = (
  e: mixTouchEvent,
  axis: "clientX" | "clientY",
  touchNumber: number = 0
) => {
  if (
    e.type === "touchstart" ||
    e.type === "touchend" ||
    e.type === "touchmove"
  ) {
    return (e as touchEvent).touches[touchNumber][axis];
  }
  return (e as mouseEvent)[axis];
};

export const createDraggableObject = (e: mixTouchEvent) => {
  const target = e.target as HTMLDivElement;
  return {
    isDoc:target.dataset.task ==='false',
    id: target.dataset.id,
    posX: +getPositionEvent(e,'clientX',0),
    duration: parseInt(target.dataset.duration!),
    start: parseInt(target.dataset.start!),
  };
};
