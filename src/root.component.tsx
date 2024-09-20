import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DataVisualizer from "./data-visualizer/data-visualizer.component";

const Root: React.FC = () => {
  return (
    <BrowserRouter basename={window.getOpenmrsSpaBase()}>
      <Routes>
        <Route path="home/data-visualizer" element={<DataVisualizer />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Root;
