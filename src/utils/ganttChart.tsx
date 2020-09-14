import {
  GanttChartConfigType,
  GanttChartDataType,
  GanttChartItemPositionMapType,
  GanttChartPositionItemType,
} from "../types";
import { bottomToLeftPattern } from "./ganttChartArrowPatterns";

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
  return bottomToLeftPattern(from, to);
};

export const createPathMap = (
  data: GanttChartDataType,
  positions: GanttChartItemPositionMapType
): string[][] => {
  const paths: string[][] = [];
  data.map((from) => {
    from.dependencies!.map((to) => {
      const fromPosition = positions.get(from.id);
      const toPosition = positions.get(to);
      paths.push([from.id, createPath(fromPosition!, toPosition!).join(" ")]);
    });
  });
  return paths;
};

export const getAllTaskWithItemInDependencies =(data: GanttChartDataType,id:string)=>{
  return data.filter((item)=>item.dependencies.includes(id));
};

export const getArrayFieldById = (
    data: GanttChartDataType,
    field:"dependencies"|"parentTasks",
    id: string
): GanttChartDataType | [] => {
  const object = data.find((item) => item.id === id);
  const list = object![field];
  if (!list!.length) return [];
  return list.map((item) => {
    return data.find((obj) => obj.id === item)!;
  });
};

export const getALLEndPositionItem = (data:GanttChartDataType)=>data.map((item)=>item.start+item.duration);
export const getAllStartFields = (data:GanttChartDataType)=>data.map((item)=>item.start);