export type GanttChartObjectType = {
    id: string;
    name: string;
    start: number; // 'YYYY-MM-DD'
    duration: number; // 'YYYY-MM-DD'
    dependencies?: string[]; // ['id','id',...]
}

export type GanttChartDataType = GanttChartObjectType[];

export type GanttChartConfigType = {
    lineHeight: number; // px
    dayStep: number; // px
    itemHeight: number; // px
    debugSvgLayerMode: boolean;
};
export type GanttChartPositionItemType = {
    top: number;
    left: number;
    middleHeight: number;
    middleWidth: number;
    height: number;
    width: number;
};
export type GanttChartArrowsPathType = string[]
export type GanttChartItemPositionMapType = Map<string,
    GanttChartPositionItemType>;