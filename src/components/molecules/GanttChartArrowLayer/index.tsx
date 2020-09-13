import React, {useEffect, useState} from "react";
import style from "./style.module.scss";
import {
  GanttChartArrowsPathType,
  GanttChartPositionItemType,
} from "../../../types";
import classNames from "classnames";

export type GanttChartArrowLayerType = {
  paths: GanttChartArrowsPathType;
  activeId?: string;
};

export const GanttChartArrowLayer: React.FC<GanttChartArrowLayerType> = ({
  paths,
  activeId = "",
}) => {
  return (
    <div className={style.layer}>
      <svg xmlns="http://www.w3.org/2000/svg">
        {paths!.map((path) => (
            <polyline
              id={path[0] === activeId ? 'activeLine':'line'}
              className={classNames(style.arrow, path[0] === activeId && style.active)}
              points={path[path.length - 1]!}
            />

        ))}
        <use xlinkHref="#activeLine"/>
      </svg>
    </div>
  );
};
