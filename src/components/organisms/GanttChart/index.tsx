import React, { useState } from "react";
import style from "./style.module.scss";
import { ChartTask } from "../../atoms/ChartTask";
import { GanttChartHeader } from "../../molecules/GanttChartHeader";
import { GanttChartArrowLayer } from "../../molecules/GanttChartArrowLayer";
import { GanttChartConfigType, GanttChartDataType } from "../../../types";
import { GanttChartPullItems } from "./GanttChartPullItems";
import { createPathMap, createPositionMap } from "../../../utils/ganttChart";

export type GanttChartType = {
  data?: GanttChartDataType;
  config: GanttChartConfigType;
  height: number;
  rightPullEvent: (id: string, value: number) => void;
  leftPullEvent: (id: string, value: number) => void;
};

//todo мемоизировать дочерние компоненты, обязательно

export const GanttChart: React.FC<GanttChartType> = ({
  data,
  config,
  height,
  rightPullEvent,
  leftPullEvent,
}) => {
  const widthWrapper = (config.maxDay + 1) * config.dayStep;
  return (
    <GanttChartPullItems
      leftPullEvent={leftPullEvent}
      rightPullEvent={rightPullEvent}
      config={config}
    >
      <div style={{ height: `${height}px` }} className={style.container}>
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
    </GanttChartPullItems>
  );
};
