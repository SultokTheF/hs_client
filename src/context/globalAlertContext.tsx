/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

import Alert from "@/shared/ui/Alert";

export type AlertType = "success" | "error" | "info";

interface GlobalAlertContextValue {
  alert: { visible: boolean; type: AlertType; message: string };
  showAlert: (type: AlertType, message: string, duration?: number) => void;
  hideAlert: () => void;
}

const GlobalAlertContext = createContext<GlobalAlertContextValue | undefined>(undefined);

export const useGlobalAlert = () => {
  const context = useContext(GlobalAlertContext);
  if (!context) {
    throw new Error("useGlobalAlert must be used within a GlobalAlertProvider");
  }
  return context;
};

export const GlobalAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<{ visible: boolean; type: AlertType; message: string }>({
    visible: false,
    type: "success",
    message: "",
  });

  const showAlert = (type: AlertType, message: string, duration = 3000) => {
    setAlert({ visible: true, type, message });
    setTimeout(() => {
      hideAlert();
    }, duration);
  };

  const hideAlert = () => {
    setAlert((prev) => ({ ...prev, visible: false }));
  };

  return (
    <GlobalAlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
      <Alert type={alert.type} message={alert.message} visible={alert.visible} />
    </GlobalAlertContext.Provider>
  );
};

export default GlobalAlertContext;
