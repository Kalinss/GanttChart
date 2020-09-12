import React, { useReducer } from "react";
import { GanttChart } from "./components/organisms/GanttChart";
import { inputMock } from "./data/inputMock";
import { reducer } from "./reducers/reducer";
import action from './reducers/constants'
function App() {
  const [state, dispatch] = useReducer(reducer, inputMock);

  return (
    <main className="wrapper">
      <GanttChart
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
