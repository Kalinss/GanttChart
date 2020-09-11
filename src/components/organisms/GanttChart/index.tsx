import React from "react";
import style from "./style.module.scss";
import {ChartTask} from "../../atoms/ChartTask";
import {GanttChartHeader} from "../../molecules/GanttChartHeader";
import {GanttChartArrowLayer} from "../../molecules/GanttChartArrowLayer";
import {GanttChartConfigType, GanttChartDataType} from "../../../types";
import {createPathMap, createPositionMap} from "../../../utils/ganttChart";

export type GanttChartType = {
  data?: GanttChartDataType;
  config: GanttChartConfigType;
  height: number;
}

export const GanttChart: React.FC<GanttChartType> = ({ data, config, height }) => {
    return (
    <div style={{ height: `${height}px` }} className={style.container}>
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
              <li style={{ height: config.lineHeight }} className={style.line}>
                <ChartTask
                  width={config.dayStep * item.duration}
                  height={config.itemHeight}
                  name={item.name}
                  start={item.start * config.dayStep}
                />
              </li>
            ))}
        </ul>
      </main>
    </div>
  );
};
