import {
  GanttChartConfigType,
  GanttChartDataType,
  GanttChartItemPositionMapType,
  GanttChartPositionItemType,
} from "../types";
import {zigZagPattern,gPattern} from "./ganttChartArrowPatterns";

export const createPositionMap = (
  data: GanttChartDataType,
  config: GanttChartConfigType
) => {
  const map = new Map();
  data.map((item, i) => {
    const top =
      i * config.lineHeight + (config.lineHeight - config.itemHeight) / 2;
    const left = config.dayStep * item.start;
    const width = item.duration * config.dayStep;
    const height = config.itemHeight;

    map.set(item.id, {
      top: top,
      left: left,
      middleHeight: top + height / 2,
      middleWidth: left + width / 2,
      width: width,
      height: height,
    });
  });
  return map;
};

export const createPath = (
  from: GanttChartPositionItemType,
  to: GanttChartPositionItemType
) => {
  if(from.left + from.width >= to.left ){
    return zigZagPattern(from,to);
  }else{
    return gPattern(from,to);
  }
  // return gPattern(from,to);

};

export const createPathMap = (
  data: GanttChartDataType,
  positions: GanttChartItemPositionMapType
) => {
  const paths: string[] = [];
  data.map((from) => {
    from.dependencies!.map((to) => {
      console.log(to);
      const fromPosition = positions.get(from.id);
      const toPosition = positions.get(to);
      paths.push(
        createPath(fromPosition!,toPosition!).join(" ")
      );
    });
  });
  return paths;
};
