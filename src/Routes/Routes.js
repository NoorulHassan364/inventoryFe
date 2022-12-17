import React from "react";
import { Routes, Route } from "react-router-dom";
import CoilStock from "../pages/coilStock/coilStock";
import DispatchAndSales from "../pages/Dispatch&Sales/Dispatch&Sales";
import ExtraReports from "../pages/extraReports/extraReports";
import MaterialInward from "../pages/materialInward/materialInward";
import Packaging from "../pages/Packaging/Packaging";
import ProductionPhase from "../pages/productionPhase/productionPhase";
import Products from "../pages/Products/Products";
import PurchaseOrders from "../pages/purchaseOrders/purchaseOrders";
import RawMaterial from "../pages/rawMaterial/rawMaterial";
import ScrapManagement from "../pages/scrapManagement/scrapManagement";
import UserMgmt from "../pages/userMgmt/userMgmt";
import Signin from "../pages/Signin/Signin";
import CreateClient from "../pages/createUser/CreateUser";
import Logout from "../pages/logout/Logout";
import { ProtectedRoute, ProtectedAuthRoute } from "./protectedRoutes";
import Vendor from "../pages/vendors/vendor";
const AppRoutes = () => {
  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          <ProtectedAuthRoute>
            <Products />
          </ProtectedAuthRoute>
        }
      />
      <Route exact path="/coilstock" element={<CoilStock />} />
      <Route exact path="/dispatch&sales" element={<DispatchAndSales />} />
      <Route exact path="/extrareports" element={<ExtraReports />} />
      <Route exact path="/materialinward" element={<MaterialInward />} />
      <Route exact path="/packaging" element={<Packaging />} />
      <Route exact path="/productionphase" element={<ProductionPhase />} />
      <Route
        exact
        path="/purchaseorders"
        element={
          <ProtectedAuthRoute>
            <PurchaseOrders />
          </ProtectedAuthRoute>
        }
      />
      <Route exact path="/vendors" element={<Vendor />} />
      <Route exact path="/rawmaterial" element={<RawMaterial />} />
      <Route exact path="/scrapmanagement" element={<ScrapManagement />} />
      <Route exact path="/usermgmt" element={<UserMgmt />} />
      <Route
        exact
        path="/createuser"
        element={
          <ProtectedAuthRoute>
            <CreateClient />
          </ProtectedAuthRoute>
        }
      />
      <Route exact path="/signout" element={<Logout />} />

      <Route
        exact
        path="/signin"
        element={
          <ProtectedRoute>
            <Signin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
