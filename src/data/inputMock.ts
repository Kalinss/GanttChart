
export type data = {
  id: string;
  name: string;
  start: number; // 'YYYY-MM-DD'
  duration: number; // 'YYYY-MM-DD'
  dependencies: string[]; // ['id','id',...]
};
export const inputMock = [
  {
    id: "task1",
    name: "Задание 5.7 для 5.1",
    start: 3,
    duration: 6,
    dependencies: ["doc1"],
  },
  {
    id: "doc1",
    name: "Документация 5.1",
    start: 20,
    duration: 14,
    dependencies: ['doc4'],
  },
  {
    id: "task2",
    name: "Задание 5.7 для 5.2",
    start: 3,
    duration: 6,
    dependencies: ["task4", "task5"],
  },
  {
    id: "task4",
    name: "Задание 5.2 для 5.1",
    start: 12,
    duration: 8,
    dependencies: ["doc1",'doc2'],
  },
  {
    id: "doc2",
    name: "Документация 5.2",
    start: 20,
    duration: 10,
    dependencies: ['doc4'],
  },
  {
    id: "task5",
    name: "Задание 5.2 для 5.3",
    start: 12,
    duration: 8,
    dependencies: ['doc3'],
  },
  {
    id: "task3",
    name: "Задание 5.7 для 5.3",
    start: 3,
    duration: 6,
    dependencies: ['doc3'],
  },
  {
    id: "doc3",
    name: "Документация 5.3",
    start: 20,
    duration: 10,
    dependencies: ['doc4'],
  },
  {
    id: "doc4",
    name: "Документация 5.7",
    start: 34,
    duration: 10,
    dependencies: ['doc5'],
  },
  {
    id: "doc5",
    name: "Документация 1",
    start: 46,
    duration: 4,
    dependencies: [],
  },
];
