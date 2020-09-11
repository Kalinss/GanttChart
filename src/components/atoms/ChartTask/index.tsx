import React from "react";
import style from "./style.module.scss";
import classNames from "classnames";

export type ChartTaskData = {
  name: string;
  start: number;
  height: number;
  width: number;
};

export const ChartTask: React.FC<ChartTaskData> = ({
  name,
  start,
  height,
  width,
}) => {
  return (
    <div
      style={{ transform: `translateX(${start}px)` }}
      className={style.chartTask}
    >
      <div style={{ height: height, width: width-4 }} className={style.container}>
        <div className={classNames(style.pull, style.pullLeft)} />
        <p className={style.name}>{name}</p>
        <div className={classNames(style.pull, style.pullRight)} />
      </div>
    </div>
  );
};
