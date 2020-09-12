import React, { useState } from "react";
import { throttle } from "lodash";
import { GanttChartConfigType } from "../../../types";

export type GanttChartPullItemsType = {
  rightPullEvent: (id: string, value: number) => void;
  leftPullEvent: (id: string, value: number) => void;
  config: GanttChartConfigType;
};
export type mouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

export const mouseEventHandler = (fn: (e: mouseEvent) => void) => (
  e: mouseEvent
) => {
  e.preventDefault();
  fn(e);
};

export const neededUpdatePosition = (position: number, step: number) =>
  position >= step;

export const createDraggableObject = (e: mouseEvent) => {
  const target = e.target as HTMLDivElement;
  return {
    id: target.dataset.id,
    posX: e.clientX,
    duration: target.dataset.duration,
    start: target.dataset.start,
  };
};

export const GanttChartPullItems: React.FC<GanttChartPullItemsType> = ({
  children,
  rightPullEvent,
  leftPullEvent,
  config,
}) => {
  const [dragObject, setDragObject] = useState<any>(null);
  const [dragMode, setDragMode] = useState<"leftPull" | "rightPull" | null>(
    null
  );

  const pullEvent = {
    leftHandlePullRight: () => {
      leftPullEvent(dragObject.id, +dragObject.start + 1);
      rightPullEvent(dragObject.id, +dragObject.duration - 1);
      setDragObject({
        ...dragObject,
        posX: +dragObject.posX + config.dayStep,
        start: +dragObject.start + 1,
        duration: +dragObject.duration - 1,
      });
    },
    leftHandlePullLeft: () => {
      leftPullEvent(dragObject.id, +dragObject.start - 1);
      rightPullEvent(dragObject.id, +dragObject.duration + 1);
      setDragObject({
        ...dragObject,
        posX: +dragObject.posX - config.dayStep,
        start: +dragObject.start - 1,
        duration: +dragObject.duration + 1,
      });
    },
    rightHandlePullRight: () => {
      rightPullEvent(dragObject.id, +dragObject.duration + 1);
      setDragObject({
        ...dragObject,
        posX: +dragObject.posX + config.dayStep,
        duration: +dragObject.duration + 1,
      });
    },
    rightHandlePullLeft: () => {
      rightPullEvent(dragObject.id, +dragObject.duration - 1);
      setDragObject({
        ...dragObject,
        posX: +dragObject.posX - config.dayStep,
        duration: +dragObject.duration - 1,
      });
    },
  };

  return (
    <div
      style={{ cursor: dragMode ? "ew-resize" : "auto" }}
      onMouseDown={mouseEventHandler((e) => {
        const type = (e.target as HTMLElement).dataset.type;
        if (type === "rightPull" || type === "leftPull") {
          setDragObject(createDraggableObject(e));
          setDragMode(type);
        }
      })}
      onMouseUp={() => {
        setDragObject(null);
        setDragMode(null);
      }}
      onMouseMove={mouseEventHandler(
        throttle((e) => {
          if (dragObject === null) return;
          if (
            dragMode === "leftPull" &&
            neededUpdatePosition(dragObject.posX - e.clientX, config.dayStep)
          ) {
            pullEvent.leftHandlePullLeft();
          }
          if (
            dragMode === "leftPull" &&
            neededUpdatePosition(e.clientX - dragObject.posX, config.dayStep)
          ) {
            pullEvent.leftHandlePullRight();
          }
          if (
            dragMode === "rightPull" &&
            neededUpdatePosition(e.clientX - dragObject.posX, config.dayStep)
          ) {
            pullEvent.rightHandlePullRight();
          }
          if (
            dragMode === "rightPull" &&
            neededUpdatePosition(dragObject.posX - e.clientX, config.dayStep)
          ) {
            pullEvent.rightHandlePullLeft();
          }
        }, 10)
      )}
    >
      {children}
    </div>
  );
};
