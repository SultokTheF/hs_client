import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/app/AppRoutes";
import { GlobalAlertProvider } from "@/context/globalAlertContext";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <GlobalAlertProvider>
        <AppRouter />
      </GlobalAlertProvider>
    </BrowserRouter>
  );
};

export default App;
