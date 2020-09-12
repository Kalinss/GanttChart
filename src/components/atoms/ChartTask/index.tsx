import React from "react";
import style from "./style.module.scss";
import classNames from "classnames";

export type ChartTaskData = {
  name: string;
  startPosition: number;
  height: number;
  width: number;
  duration: number;
  id: string;
  startDay: number;
};

export type pullEventType = (id: string, xPos: number) => void;

export const ChartTask: React.FC<ChartTaskData> = ({
  name,
  startPosition,
  height,
  width,
  duration,
  startDay,
  id,
}) => {
  return (
    <div
      style={{ transform: `translateX(${startPosition}px)` }}
      className={style.chartTask}
    >
      <div
        style={{ height: height, width: width - 4 }}
        className={style.container}
      >
        <div
          className={classNames(style.pull, style.pullLeft)}
          data-id={id}
          data-type="leftPull"
          data-start={startDay}
          data-duration={duration}
        />
        <p className={style.name}>{name}</p>
        <div
          className={classNames(style.pull, style.pullRight)}
          data-id={id}
          data-type="rightPull"
          data-start={startDay}
          data-duration={duration}
        />
      </div>
    </div>
  );
};
