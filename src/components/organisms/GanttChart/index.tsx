import React, { useState } from "react";
import style from "./style.module.scss";
import { ChartTask } from "../../atoms/ChartTask";
import { GanttChartHeader } from "../../molecules/GanttChartHeader";
import { GanttChartArrowLayer } from "../../molecules/GanttChartArrowLayer";
import {
  GanttChartConfigType,
  GanttChartDataType,
  GanttChartObjectType,
} from "../../../types";
import { GanttChartPullItems } from "./GanttChartPullItems";
import { createPathMap, createPositionMap } from "../../../utils/ganttChart";
import { GanttChartTaskInfoBox } from "../../molecules/GanttChartTaskInfoBox";
import classNames from "classnames";

export type GanttChartType = {
  data?: GanttChartDataType;
  config: GanttChartConfigType;
  height: number;
  rightPullEvent: (id: string, value: number) => void;
  leftPullEvent: (id: string, value: number) => void;
  createDocument: (id: string) => void;
};



export const GanttChart: React.FC<GanttChartType> = ({
  data,
  config,
  height,
  rightPullEvent,
  leftPullEvent,
  createDocument,
}) => {
  const [hoverItem, setHoverItem] = useState("");
  const [activeItem, setActiveItem] = useState<GanttChartObjectType | null>(
    null
  );
  const [dragMode, setDragMode] = useState(false);

  const clickItemHandler = (id: string) =>
    setActiveItem(data!.find((item) => item.id === id) || null);
  const clearActive = () => setActiveItem(null);

  const positionItems = createPositionMap(data!, config);
  const widthWrapper = (config.maxDay + 1) * config.dayStep;
  const activeItemPosition = positionItems.get(
    (activeItem && activeItem!.id) || ""
  );

  return (
    <GanttChartPullItems
      allTask={data!}
      leftPullEvent={leftPullEvent}
      rightPullEvent={rightPullEvent}
      config={config}
      getStatusDragMode={setDragMode}
    >
      <div
        style={{ height: `${height}px`}}
        className={classNames(style.container, dragMode && style.notScroll)}
      >
        <div style={{ width: widthWrapper }}>
          <GanttChartHeader
            type="zeroDay"
            zeroDayConfig={{ maxDay: config.maxDay }}
            step={config.dayStep}
          />
          <main className={style.content}>
            <GanttChartArrowLayer
              activeId={
                dragMode ? "" : hoverItem || (activeItem && activeItem.id) || ""
              }
              paths={createPathMap(data!, positionItems)}
            />

            <ul className={style.list}>
              {data &&
                data.map((item, i) => (
                  <li
                    key={i + item.id}
                    style={{ height: config.lineHeight }}
                    className={style.line}
                    onMouseEnter={() => {
                      setHoverItem(item.id);
                    }}
                    onMouseLeave={() => {
                      setHoverItem("");
                    }}
                  >
                    <ChartTask
                      id={item.id}
                      width={config.dayStep * item.duration}
                      duration={item.duration}
                      height={config.itemHeight}
                      name={item.name}
                      startPosition={item.start * config.dayStep}
                      startDay={item.start}
                      clickHandler={clickItemHandler}
                    />
                  </li>
                ))}
            </ul>

            <GanttChartTaskInfoBox
              left={
                activeItemPosition &&
                activeItemPosition!.left + activeItemPosition!.width + 10
              }
              top={
                activeItemPosition &&
                activeItemPosition!.top + activeItemPosition!.height - 25
              }
              isActive={!!activeItem}
              data={activeItem || data![0]}
              allTask={data!}
              createDocumentationHandler={createDocument}
            />
          </main>
        </div>

        <div
          onClick={clearActive}
          style={{ width: config.dayStep * config.maxDay + 1 }}
          className={classNames(style.hiddenLayer, activeItem && style.active)}
        />
      </div>
    </GanttChartPullItems>
  );
};
