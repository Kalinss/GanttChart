import React from "react";
import { GanttChart } from "./components/organisms/GanttChart";
import { inputMock } from "./data/inputMock";

function App() {
  return (
    <main className="wrapper">
      <GanttChart
        height={650}
        data={inputMock}
        config={{ dayStep: 30, itemHeight: 20, lineHeight: 35,debugSvgLayerMode:true }}
      />
    </main>
  );
}

export default App;
