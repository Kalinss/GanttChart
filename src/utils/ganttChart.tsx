import {
  GanttChartConfigType,
  GanttChartDataType,
  GanttChartItemPositionMapType,
  GanttChartPositionItemType,
} from "../types";
import { bottomToLeftPattern } from "./ganttChartArrowPatterns";
import { curry } from "lodash";

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

export const getAllTaskWithItemInDependencies = curry(
  (id: string, data: GanttChartDataType) => {
    return data.filter((item) => item.dependencies.includes(id));
  }
);

export const getArrayFieldById = curry(
  (
    field: "dependencies" | "parentTasks",
    id: string,
    data: GanttChartDataType
  ): GanttChartDataType | [] => {
    const object = data.find((item) => item.id === id);
    const list = object![field];
    if (!list!.length) return [];
    return list.map((item) => {
      return data.find((obj) => obj.id === item)!;
    });
  }
);

export const getALLEndPositionItem = (data: GanttChartDataType) =>
  data.map((item) => item.start + item.duration);
export const getAllStartPositionItems = (data: GanttChartDataType) =>
  data.map((item) => item.start);

export const getAllDependenciesItemsById = (
  data: GanttChartDataType,
  itemId: string,
  type: "dependencies" | "parentTasks"
) => {
  const result: string[] = [];
  const f = (data: GanttChartDataType, startId: string) => {
    const obj = data.find((item) => item.id === startId);
    const dep = obj![type];
    result.push(...dep);
    if (dep.length === 0) return;
    dep.map((item) => f(data, item));
  };
  f(data, itemId);
  // @ts-ignore
  return [...new Set<string[]>(result)];
};

export const getAllObjectInDataById = (data:GanttChartDataType,id:string[])=>{
  return id.map((id)=>data.filter((item)=>item.id === id)).flat(Infinity);
};


