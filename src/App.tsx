import React, { useReducer } from "react";
import { GanttChart } from "./components/organisms/GanttChart";
import { inputMock } from "./data/inputMock";
import { reducer } from "./reducers/reducer";
import action from "./reducers/constants";
import { GanttChartTaskInfoBox } from "./components/molecules/GanttChartTaskInfoBox";

function App() {
  const [state, dispatch] = useReducer(reducer, inputMock);

  return (
    <main className="wrapper">
      <GanttChart
        rightPullEvent={(id, value) => {
          dispatch({
            type: action.changeDuration,
            id: id,
            durationValue: value,
          });
        }}
        leftPullEvent={(id, value) => {
          dispatch({
            type: action.changeStartDay,
            id: id,
            startValue: value,
          });
        }}
        createDocument={(id) => {
          dispatch({
            type: action.createDocumentation,
            id: id,
          });
        }}
        height={650}
        data={state}
        config={{
          maxDay: 55,
          dayStep: 30,
          itemHeight: 20,
          lineHeight: 35,
          debugSvgLayerMode: true,
        }}
      />
    </main>
  );
}

export default App;
