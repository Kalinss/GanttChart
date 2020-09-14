import { GanttChartPositionItemType } from "../types";

const arrowPattern = (
  from: GanttChartPositionItemType,
  to: GanttChartPositionItemType
) => {
  return [
    `${to!.left - 6},${to!.middleHeight - 4}`,
    `${to!.left - 2},${to!.middleHeight}`,
    `${to!.left - 6},${to!.middleHeight + 4}`,
    `${to!.left - 2},${to!.middleHeight}`,
  ];
};

export const bottomToLeftPattern = (
  from: GanttChartPositionItemType,
  to: GanttChartPositionItemType
) => {
  return [
    `${from!.left + from!.width / 2},${from!.top + from!.height}`, // начинаем снизу с середины
    `${from!.left + from!.width / 2},${to!.middleHeight}`,
    `${to!.left}, ${to!.middleHeight}`,
    arrowPattern(from, to),
  ];
};
