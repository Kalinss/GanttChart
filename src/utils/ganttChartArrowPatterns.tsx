import { GanttChartPositionItemType } from "../types";

const startPattern = (from: GanttChartPositionItemType) => {
  return [
    `${from!.left + from!.width + 2},${from!.middleHeight}`, // точка начала
    `${from!.left + from!.width + 10},${from!.middleHeight}`, // отступ вправо
  ];
};

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

export const zigZagPattern = (
  from: GanttChartPositionItemType,
  to: GanttChartPositionItemType
) => {
  return [
    [...startPattern(from)],
    `${from!.left + from!.width + 10}, ${
      to!.middleHeight - from!.middleHeight
    }`, // доходим до середины
    `${to!.left - 10},${to!.middleHeight - from!.middleHeight}`, // c середины в начало ко 2 элементу
    `${to!.left - 10},${to!.middleHeight}`, // спускаемся к 2 элементу
    `${to!.left - 2},${to!.middleHeight}`,
    [...arrowPattern(from, to)],
  ];
};

export const gPattern = (
  from: GanttChartPositionItemType,
  to: GanttChartPositionItemType
) => {
  return [
    [...startPattern(from)],
    `${from!.left + from!.width + 10}, ${to!.middleHeight}`, // доходим до середины
    `${to!.left - 2},${to!.middleHeight}`,
    [...arrowPattern(from, to)],
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
