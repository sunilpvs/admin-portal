import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MyProSidebarProvider } from "./pages/global/sidebar/sidebarContext";

import Topbar from "./pages/global/Topbar";

import Dashboard from "./pages/dashboard";
import Calendar from "./pages/calendar";

import City from "./pages/city/City";
import State from "./pages/state/State";
import Country from "./pages/country/Country";
import Designation from "./pages/designation/Designation";
import Department from "./pages/department/Department";

import Status from "./pages/status/Status";
import ContactType from "./pages/contacttype/ContactType";
import CostCenterType from "./pages/costcentertype/CostcenterType";

import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import { Toaster } from "react-hot-toast";
import DashboardLayout from "./components/DashboardLayout";
import UserProfile from "./pages/profile/UserProfile";
import ActivityLog from "./pages/activity/ActivityLog";

import Entity from "./pages/entity/Entity";
import CostCenter from "./pages/costcenter/CostCenter";



import AccessRequests from "./pages/accessRequest/AccessRequests";
import AccessUser from "./pages/usersList/UsersList";
import AccessRejected from "./pages/accessRequest/AccessRejected";
import ReqAccess from "./pages/accessRequest/ReqAccess";
import AccessPending from "./pages/accessRequest/AccessPending";
import NotFound404 from "./pages/error/404NotFound";


const App = () => {
  const [theme, colorMode] = useMode();
  const location = useLocation();

  // const isLoginPage = location.pathname === "/login";

  return (
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Toaster position="top-center" reverseOrder={false} />
               <AppRoutes />

        </ThemeProvider>
      </ColorModeContext.Provider>
  );
};
const AppRoutes = () => (
    <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />
         {/* New route for Access Request */}
        <Route path="access-rejected" element={<AccessRejected />} />
        <Route path="request-access" element={<ReqAccess />} />
        <Route path="access-pending" element={<AccessPending />} />


        {/* Protected routes inside DashboardLayout */}
        <Route
            path="/"
            element={
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
            }
        >
            <Route index element={<Dashboard />} />
            <Route path="city" element={<City />} />
            <Route path="state" element={<State />} />
            <Route path="country" element={<Country />} />
            <Route path="department" element={<Department />} />
            <Route path="designation" element={<Designation />} />
            <Route path="status" element={<Status />} />
            <Route path="contacttype" element={<ContactType />} />
            <Route path="costcenter" element={<CostCenter />} />
            <Route path="costcentertype" element={<CostCenterType />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="activity" element={<ActivityLog />} />
            <Route path="entity" element={<Entity />} />
         
            <Route path="access-requests" element={<AccessRequests />} />
            <Route path="users-list" element={<AccessUser />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound404 />} />
    </Routes>
);

export default App;
