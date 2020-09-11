import React from "react";
import style from "./style.module.scss";
import {
  GanttChartArrowsPathType,
  GanttChartPositionItemType,
} from "../../../types";

export type GanttChartArrowLayerType = {
  paths: GanttChartArrowsPathType;
  debugMode: boolean;
  positionItems: Map<string, GanttChartPositionItemType>;
};

export const GanttChartArrowLayer: React.FC<GanttChartArrowLayerType> = ({
  paths,
  positionItems,
  debugMode,
}) => {
  const positions = Array.from(positionItems.values());
  // const paths = createPathMap()
  return (
    <div className={style.layer}>
      <svg>
        {paths.map((path) => (
          <polyline
            className={style.arrow}
            points={path}
            stroke={"red"}
          />
        ))}
        {/*{debugMode && (*/}
        {/*  <g>*/}
        {/*    {positions.map((item) => (*/}
        {/*      <circle cx={item.left} cy={item.middleHeight} r={4} />*/}
        {/*    ))}*/}
        {/*    {positions.map((item) => (*/}
        {/*      <circle cx={item.middleWidth} cy={item.top} r={4} />*/}
        {/*    ))}*/}
        {/*  </g>*/}
        {/*)}*/}
      </svg>
    </div>
  );
};
