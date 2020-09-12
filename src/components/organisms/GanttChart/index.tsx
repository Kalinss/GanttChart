import React, { useState } from "react";
import style from "./style.module.scss";
import { ChartTask } from "../../atoms/ChartTask";
import { GanttChartHeader } from "../../molecules/GanttChartHeader";
import { GanttChartArrowLayer } from "../../molecules/GanttChartArrowLayer";
import { GanttChartConfigType, GanttChartDataType } from "../../../types";
import { createPathMap, createPositionMap } from "../../../utils/ganttChart";
import { throttle } from "lodash";

export type GanttChartType = {
  data?: GanttChartDataType;
  config: GanttChartConfigType;
  height: number;
  rightPullEvent: (id: string, value: number) => void;
  leftPullEvent: (id: string, value: number) => void;
};

type mouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;
//todo мемоизировать дочерние компоненты, обязательно
//todo накинуть throttle на вычисление X позиции мыши

const mouseEventHandler = (fn: (e: mouseEvent) => void) => (e: mouseEvent) => {
  e.preventDefault();
  fn(e);
};

const neededUpdatePosition = (position: number, step: number) =>
  position >= step;

const createDraggableObject = (e: mouseEvent) => {
  const target = e.target as HTMLDivElement;
  return {
    id: target.dataset.id,
    posX: e.clientX,
    duration: target.dataset.duration,
    start: target.dataset.start,
  };
};

export const GanttChart: React.FC<GanttChartType> = ({
  data,
  config,
  height,
  rightPullEvent,
  leftPullEvent,
}) => {
  const widthWrapper = (config.maxDay + 1) * config.dayStep;
  const [dragObject, setDragObject] = useState<any>(null);
  const [dragMode, setDragMode] = useState<"leftPull" | "rightPull" | null>(
    null
  );

  const pullEvent = {
    leftHandlePullRight: () => {
      leftPullEvent(dragObject.id, +dragObject.start + 1);
      rightPullEvent(dragObject.id,+dragObject.duration -1);
      setDragObject({
        ...dragObject,
        posX: +dragObject.posX + config.dayStep,
        start: +dragObject.start + 1,
        duration: +dragObject.duration - 1,
      });
    },
    leftHandlePullLeft: () => {
      leftPullEvent(dragObject.id, +dragObject.start - 1);
      rightPullEvent(dragObject.id,+dragObject.duration + 1);
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
      style={{ cursor: dragMode ? "ew-resize" : "auto", height: `${height}px` }}
      className={style.container}
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
      <div style={{ width: widthWrapper }}>
        <GanttChartHeader
          type="zeroDay"
          zeroDayConfig={{ maxDay: 55 }}
          step={config.dayStep}
        />
        <main className={style.content}>
          <GanttChartArrowLayer
            paths={createPathMap(data!, createPositionMap(data!, config))}
            debugMode={true}
            positionItems={createPositionMap(data!, config)}
          />

          <ul className={style.list}>
            {data &&
              data.map((item) => (
                <li
                  style={{ height: config.lineHeight }}
                  className={style.line}
                >
                  <ChartTask
                    id={item.id}
                    width={config.dayStep * item.duration}
                    duration={item.duration}
                    height={config.itemHeight}
                    name={item.name}
                    startPosition={item.start * config.dayStep}
                    startDay={item.start}
                  />
                </li>
              ))}
          </ul>
        </main>
      </div>
    </div>
  );
};
