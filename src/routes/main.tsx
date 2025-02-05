import { Suspense, useState, useEffect } from "react";
import { Outlet, Navigate, useRoutes } from "react-router-dom";
import { Box, LinearProgress } from "@mui/material";

import AdminLayout from "../layouts/admin";
import { useAuth } from "../contexts/auth";
import LoginPage from "../pages/login";
import AdminPage from "../pages/admin/admin";
import ManagerPage from "../pages/manager/manager";
import EmployeePage from "../pages/employee/employee";

// ----------------------------------------------------------------------

export default function Router() {
  const {
    isAuthenticated,
    setIsAuthenticated,
    token,
    setToken,
    role,
    setRole,
    userEmail,
    setUserEmail,
    roleArray,
    setRoleArray,
  } = useAuth();
  const [loading, setLoading] = useState(true);
  const localToken = localStorage.getItem("AuthToken");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (localToken) {
          const response = await fetch("/api/verify-token", {
            method: "GET",
            headers: {
              "x-access-token": localToken,
            },
          });
          if (response.ok) {
            const responseData = await response.json();
            setToken(localToken);
            setIsAuthenticated(true);
            setRole(responseData.role);
            setUserEmail(responseData.email);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const routes = useRoutes([
    {
      element: (
        <AdminLayout>
          <Suspense fallback={<div>Loading Content...</div>}>
            <Outlet />
          </Suspense>
        </AdminLayout>
      ),
      children: [
        {
          path: "/admin",
          element:
            isAuthenticated && role === "Admin" ? (
              <AdminPage />
            ) : (
              <Navigate to="/" replace />
            ),
        },
        {
          path: "/manager",
          element:
            isAuthenticated && role === "Manager" ? (
              <ManagerPage />
            ) : (
              <Navigate to="/" replace />
            ),
        },
        {
          path: "/employee",
          element:
            isAuthenticated && role === "Employee" ? (
              <EmployeePage />
            ) : (
              <Navigate to="/" replace />
            ),
        },
      ],
    },
    {
      path: "/",
      element: <LoginPage />,
    },
  ]);

  if (loading) {
    return <LoadingScreen />;
  }

  return routes;
}

function LoadingScreen() {
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    </>
  );
}
