import React from "react";
import style from "./style.module.scss";

export type GanttChartHeaderType = {
  type: "zeroDay" | "week" | "mount";
  step: number;
  zeroDayConfig?: {
    maxDay: number;
  };
};

const createArrayFrom0To = (max: number) => {
  return Array<number>(max + 1)
    .fill(0)
    .map((item, i) => i);
};

export const GanttChartHeader: React.FC<GanttChartHeaderType> = ({
  step,
  type,
  zeroDayConfig,
}) => {
  return (
    <header
      className={style.header}
    >
      {type === "zeroDay" && (
        <div>
          <div className={style.top}>
            <h2>Количество требуемых дней</h2>
          </div>
          <ul className={style.bottom}>
            {createArrayFrom0To(zeroDayConfig!.maxDay).map((item) => (
              <li className={style.itemBottom} style={{ width: step }}>
                {<span>{item}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};
