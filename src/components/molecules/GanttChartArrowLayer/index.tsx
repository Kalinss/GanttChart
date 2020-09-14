import React from "react";
import style from "./style.module.scss";
import {
  GanttChartArrowsPathType,
} from "../../../types";
import classNames from "classnames";

export type GanttChartArrowLayerType = {
  paths: GanttChartArrowsPathType;
  activeId?: string;
};

const Line: React.FC<{ path: string; active: boolean }> = ({
  path,
  active,
}) => {
  return (
    <polyline
      className={classNames(style.arrow, active && style.active)}
      points={path}
    />
  );
};
export const GanttChartArrowLayer: React.FC<GanttChartArrowLayerType> = ({
  paths,
  activeId = "",
}) => {
  return (
    <div className={style.layer}>
      <svg xmlns="http://www.w3.org/2000/svg">
        {paths!.map((path) => (
          <Line path={path[path.length - 1]} active={false} />
        ))}
        {paths!
          .filter((path) => path[0] === activeId)
          .map((path) => (
            <Line path={path[path.length - 1]} active={true} />
          ))}
      </svg>
    </div>
  );
};
