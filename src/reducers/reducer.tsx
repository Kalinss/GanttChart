import { GanttChartDataType, GanttChartObjectType } from "../types";
import C from "./constants";

type actionType = {
  type: string;
  id: string;
  durationValue?: number;
};
type updateObjectInCollection = (
  obj: GanttChartObjectType
) => GanttChartObjectType;

type updateCollectionByIdType = (
  collection: GanttChartDataType,
  id: string,
  fn: updateObjectInCollection
) => GanttChartDataType;


const updateCollectionById: updateCollectionByIdType = (collection, id, fn) => {
  return collection.reduce((acc, item) => {
    if (item.id === id) {
      return [...acc, fn(item)];
    }
    return [...acc, { ...item }];
  }, [] as GanttChartDataType);
};

const changeDuration = (value: number) => (obj: GanttChartObjectType) => ({
  ...obj,
  duration: value,
});


export const reducer = (state: GanttChartDataType, action: actionType) => {
  switch (action.type) {
    case C.changeDuration:
      return updateCollectionById(
        state,
        action.id,
        changeDuration(action.durationValue!)
      );
    default:
      return state;
  }
};