import React from "react";
import AppRoutes from "./Routes";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import SidebarMenu from "../components/sidebar/index";

const Index = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/*"
          element={
            <SidebarMenu>
              <AppRoutes />
            </SidebarMenu>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Index;
