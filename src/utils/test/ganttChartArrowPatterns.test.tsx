import { bottomToLeftPattern, } from "../ganttChartArrowPatterns";

describe("bottomToLeftPattern, функция", () => {
  const input = {
    a: {
      top: 77.5,
      left: 90,
      middleHeight: 87.5,
      middleWidth: 180,
      width: 180,
      height: 20,
    },
    b: {
      top: 7.5,
      left: 600,
      middleHeight: 17.5,
      middleWidth: 810,
      width: 420,
      height: 20,
    },
  };
  it("должна вернуть правильный svg путь", () => {
    expect(bottomToLeftPattern(input.a, input.b).join(" ")).toStrictEqual(
      "180,97.5 180,17.5 600, 17.5 594,13.5,598,17.5,594,21.5,598,17.5"
    );
  });
});
