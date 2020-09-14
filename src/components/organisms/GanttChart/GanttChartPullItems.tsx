import React, { useState} from "react";
import { throttle } from "lodash";
import { GanttChartConfigType, GanttChartDataType } from "../../../types";
import {
  getAllStartFields,
  getArrayFieldById,
  getALLEndPositionItem,
  getAllTaskWithItemInDependencies,
} from "../../../utils/ganttChart";
import { maxNumber, minNumber } from "../../../utils/other";



export type GanttChartPullItemsType = {
  rightPullEvent: (id: string, value: number) => void;
  leftPullEvent: (id: string, value: number) => void;
  config: GanttChartConfigType;
  getStatusDragMode: (st: boolean) => void;
  allTask: GanttChartDataType;
};
export type mouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;
export type touchEvent = React.TouchEvent<HTMLDivElement>;

export const mouseEventHandler = (fn: (e: mouseEvent | touchEvent) => void) => (
  e: mouseEvent | touchEvent
) => {
  e.persist();
  e.preventDefault();
  fn(e);
};

export const neededUpdatePosition = (position: number, step: number) =>
  position >= step;

const getPositionX = (e:mouseEvent|touchEvent)=>{
  if(e.type === 'touchstart' || e.type === 'touchend' || e.type==='touchmove' ){
    return (e as touchEvent).touches[0].clientX;
  }
  return (e as mouseEvent).clientX;
};

export const createDraggableObject = (e: mouseEvent | touchEvent) => {
  const target = e.target as HTMLDivElement;
  return {
    id: target.dataset.id,
    posX: getPositionX(e),
    duration: target.dataset.duration,
    start: target.dataset.start,
  };
};

export const GanttChartPullItems: React.FC<GanttChartPullItemsType> = ({
  children,
  rightPullEvent,
  leftPullEvent,
  config,
  getStatusDragMode,
  allTask,
}) => {
  const [dragObject, setDragObject] = useState<any>(null);
  const [dragMode, setDragMode] = useState<"leftPull" | "rightPull" | null>(
    null
  );
  const [minStartPosition, setStartPosition] = useState(0);
  const [maxEndPosition, setMaxPosition] = useState(0);


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

  const mouseDownTouchStartEventHandler = (e: mouseEvent | touchEvent) => {
    const target = e.target as HTMLElement;
    const type = (e.target as HTMLElement).dataset.type;

    if (type === "rightPull" || type === "leftPull") {
      setDragObject(createDraggableObject(e));
      setDragMode(type);
      getStatusDragMode(true);
      setStartPosition(
        minNumber(
          getAllStartFields(
            getArrayFieldById(allTask, "dependencies", target!.dataset!.id!)
          )
        ) || config.maxDay
      );
      setMaxPosition(
        maxNumber(
          getALLEndPositionItem(
            getAllTaskWithItemInDependencies(allTask, target!.dataset!.id!)
          )
        ) || 0
      );
    }
  };

  const mouseUpTouchEndEventHandler = () => {
    setDragObject(null);
    setDragMode(null);
    getStatusDragMode(false);
  };

  const isPullRight = (e: mouseEvent | touchEvent) =>
    neededUpdatePosition(getPositionX(e) - dragObject.posX, config.dayStep);
  const isPullLeft = (e: mouseEvent | touchEvent) =>
    neededUpdatePosition(dragObject.posX - getPositionX(e), config.dayStep);

  const mouseMoveTouchMove = (e: mouseEvent|touchEvent) => {
    if (!dragObject || !dragMode) return;
    switch (dragMode) {
      case "rightPull": {
        if (isPullLeft(e)) {
          if (dragObject.duration === 1) return;
          pullEvent.rightHandlePullLeft();
        }
        if (isPullRight(e)) {
          if (
            minStartPosition - (+dragObject.duration + +dragObject.start) ==
            0
          )
            return;
          pullEvent.rightHandlePullRight();
        }
        break;
      }
      case "leftPull": {
        if (isPullLeft(e)) {
          if (+dragObject.start - maxEndPosition == 0) return;
          pullEvent.leftHandlePullLeft();
        }
        if (isPullRight(e)) {
          if (dragObject.duration === 1) return;
          pullEvent.leftHandlePullRight();
        }
        break;
      }
      default:
        return;
    }
  };
  return (
    <div
      style={{ cursor: dragMode ? "ew-resize" : "auto" }}
      onMouseDown={mouseDownTouchStartEventHandler}
      onMouseUp={mouseUpTouchEndEventHandler}
      onMouseMove={mouseEventHandler(throttle(mouseMoveTouchMove, 10))}

      onTouchStart={mouseDownTouchStartEventHandler}
      onTouchEnd={mouseUpTouchEndEventHandler}
      onTouchMove={mouseEventHandler(throttle(mouseMoveTouchMove, 10))}
    >
      {children}
    </div>
  );
};
