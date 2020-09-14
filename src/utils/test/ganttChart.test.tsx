import { createPositionMap, createPathMap,getArrayFieldById } from "../ganttChart";

const data = [
  {
    id: "doc55",
    name: "Тест док1",
    start: 20,
    duration: 14,
    dependencies: [],
    parentTasks: [],
    isReady: false,
    isTask: false,
  },
  {
    id: "doc55555",
    name: "Тест док1",
    start: 10,
    duration: 2,
    dependencies: [],
    parentTasks: [],
    isReady: false,
    isTask: false,
  },
  {
    id: "task55",
    name: "Тест1",
    start: 3,
    duration: 6,
    dependencies: ["doc55", "doc55555"],
    parentTasks: [],
    isReady: false,
    isTask: true,
  },
];
const dataConfig = {
  maxDay: 55,
  dayStep: 30,
  itemHeight: 20,
  lineHeight: 35,
  debugSvgLayerMode: true,
};
const mapPositionData = [
  [
    "doc55",
    {
      top: 7.5,
      left: 600,
      middleHeight: 17.5,
      middleWidth: 810,
      width: 420,
      height: 20,
    },
  ],
  [
    "doc55555",
    {
      top: 42.5,
      left: 300,
      middleHeight: 52.5,
      middleWidth: 330,
      width: 60,
      height: 20,
    },
  ],
  [
    "task55",
    {
      top: 77.5,
      left: 90,
      middleHeight: 87.5,
      middleWidth: 180,
      width: 180,
      height: 20,
    },
  ],
]
const dataPaths = [
  [
    'task55',
    '180,97.5 180,17.5 600, 17.5 594,13.5,598,17.5,594,21.5,598,17.5'
  ],
  [
    'task55',
    '180,97.5 180,52.5 300, 52.5 294,48.5,298,52.5,294,56.5,298,52.5'
  ]
]

describe("createPositionMap, функция", () => {
  it("должна вернуть валидные данные", () => {
    expect(Array.from(createPositionMap(data, dataConfig))).toStrictEqual(mapPositionData);
  });
});
describe("createPathMap, функция", () => {
  it("должна вернуть валидные данные", () => {
    //@ts-ignore
    expect(createPathMap(data, new Map(mapPositionData))).toStrictEqual(dataPaths)
  });
});
describe('getArrayFieldById, функция',()=>{
  it("должна вернуть валидные данные",()=>{
    expect(getArrayFieldById(data, 'dependencies', 'task55')).toStrictEqual([
        data[0],data[1]])
  })
  it('должна вернуть пустой массив',()=>{
    expect(getArrayFieldById(data,'dependencies','doc55')).toStrictEqual([]);
  })
})