import React from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage, ProjectPage } from "@/pages";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/project/:id" element={<ProjectPage />} />
    </Routes>
  );
};

export default AppRouter;
