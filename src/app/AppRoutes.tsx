import React from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage, ProjectsPage } from "@/pages";

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/project/:id" element={<ProjectsPage />} />
    </Routes>
  );
};

export default AppRouter;
