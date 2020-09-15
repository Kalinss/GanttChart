import React, { useState } from "react";
import { throttle } from "lodash";
import {
  GanttChartConfigType,
  GanttChartDataType,
  mixTouchEvent,
  pullEvent,
} from "../../../types";
import {
  getALLEndPositionItem,
  getAllDependenciesItemsById,
  getAllStartPositionItems,
  getAllTaskWithItemInDependencies,
  getArrayFieldById,
  getAllObjectInDataById,
} from "../../../utils/ganttChart";
import { maxNumber, minNumber } from "../../../utils/other";
import {
  createDraggableObject,
  getPositionEvent,
} from "../../../utils/positionElements";
import { compose } from "lodash/fp";

export type GanttChartPullItemsType = {
  rightPullEvent: (id: string, value: number) => void;
  leftPullEvent: (id: string, value: number) => void;
  config: GanttChartConfigType;
  getStatusDragMode: (st: boolean) => void;
  allTask: GanttChartDataType;
};

export const mouseEventHandler = (fn: (e: mixTouchEvent) => void) => (
  e: mixTouchEvent
) => {
  e.persist();
  e.preventDefault();
  fn(e);
};

export const neededUpdatePosition = (position: number, step: number) =>
  position >= step;

export const maxPositionByParentItems = (
  data: GanttChartDataType,
  idTargetItem: string
) => {
  return compose(
    maxNumber,
    getALLEndPositionItem,
    getAllTaskWithItemInDependencies(idTargetItem)
  )(data);
};

export const isConfront = (pos1: number, pos2: number) => pos1 - pos2 === 0;

export const minPositionByDependenciesItems = (
  data: GanttChartDataType,
  idTargetItem: string
) => {
  return compose(
    minNumber,
    getAllStartPositionItems,
    getArrayFieldById("dependencies", idTargetItem)
  )(data);
};

export const getMaxPositionAdjacentElements = (
  data: GanttChartDataType,
  idDependencies: string[],
  draggObject: any
) => {
  const confrontObject = getAllObjectInDataById(data, idDependencies).filter(
    (item) => item.start === draggObject.start + draggObject.duration
  );

  const parentItems = getArrayFieldById(
    "parentTasks",
    confrontObject[0].id,
    data
    //@ts-ignore
  ).filter((item) => item.id !== draggObject.id);

  const maxPosition = maxNumber(
    //@ts-ignore
    parentItems.map((item) => item.start + item.duration)
  );
  return maxPosition;
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
  const [dragMode, setDragMode] = useState<pullEvent | null>(null);
  const [minStartPosition, setStartPosition] = useState(0);
  const [maxEndPosition, setMaxPosition] = useState(0);

  const pullEvent = {
    allRightTaskPullRight: (id: string[], data: GanttChartDataType) => {
      id.map((itemId) => {
        const obj = data.find((item) => item.id == itemId);
        leftPullEvent(itemId, obj!.start + 1);
      });
      setDragObject({
        ...dragObject,
        posX: +dragObject.posX + config.dayStep,
        duration: +dragObject.duration + 1,
      });
      setStartPosition(minPositionByDependenciesItems(data, dragObject.id) + 1);
    },

    allRightTaskPullLeft: (id: string[], data: GanttChartDataType) => {
      id.map((itemId) => {
        const obj = data.find((item) => item.id == itemId);
        leftPullEvent(itemId, obj!.start - 1);
      });
      setDragObject({
        ...dragObject,
        posX: +dragObject.posX + config.dayStep,
        duration: +dragObject.duration - 1,
      });
      setStartPosition(minPositionByDependenciesItems(data, dragObject.id) - 1);
    },

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

  const mouseDownTouchStartEventHandler = (e: mixTouchEvent) => {
    const target = e.target as HTMLElement;
    const type = (e.target as HTMLElement).dataset.type;
    if (type === "rightPull" || type === "leftPull") {
      setDragObject(createDraggableObject(e));
      setDragMode(type);
      getStatusDragMode(true);
      setStartPosition(
        minPositionByDependenciesItems(allTask, target!.dataset!.id!) ||
          config.maxDay
      );
      setMaxPosition(
        maxPositionByParentItems(allTask, target!.dataset!.id!) || 0
      );
    }
  };

  const mouseUpTouchEndEventHandler = () => {
    setDragObject(null);
    setDragMode(null);
    getStatusDragMode(false);
  };

  const isPullRight = (e: mixTouchEvent) =>
    neededUpdatePosition(
      getPositionEvent(e, "clientX") - dragObject.posX,
      config.dayStep
    );
  const isPullLeft = (e: mixTouchEvent) =>
    neededUpdatePosition(
      dragObject.posX - getPositionEvent(e, "clientX"),
      config.dayStep
    );

  const mouseMoveTouchMove = (e: mixTouchEvent) => {
    if (!dragObject || !dragMode) return;
    switch (dragMode) {
      case "rightPull": {
        if (isPullLeft(e)) {
          if (dragObject.duration === 1) return;

          if (dragObject.isDoc) {
            if (
              isConfront(
                minStartPosition,
                dragObject.duration + dragObject.start
              )
            ) {

              const id = getAllDependenciesItemsById(
                allTask,
                dragObject.id,
                "dependencies"
              );

              const maxPositionAdjacent = getMaxPositionAdjacentElements(
                allTask,
                id,
                dragObject
              );

              if (dragObject.start + dragObject.duration === maxPositionAdjacent){
                pullEvent.rightHandlePullLeft();
                return;
              }
              pullEvent.allRightTaskPullLeft(id, allTask);
            }
          }
          pullEvent.rightHandlePullLeft();
        }
        if (isPullRight(e)) {
          if (
            isConfront(minStartPosition, dragObject.duration + dragObject.start)
          ) {
            if (dragObject.isDoc) {
              const id = getAllDependenciesItemsById(
                allTask,
                dragObject.id,
                "dependencies"
              );
              pullEvent.allRightTaskPullRight(id, allTask);
            } else {
              return;
            }
          }
          pullEvent.rightHandlePullRight();
        }
        break;
      }

      case "leftPull": {
        if (isPullLeft(e)) {
          if (dragObject.start - maxEndPosition == 0) {
            return;
          }
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
      style={{ cursor: dragMode ? "ew-resize" : "auto",position:'relative' }}
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
