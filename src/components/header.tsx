import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { useAuth } from "../contexts/auth";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

export default function Header() {
  const navigate = useNavigate();
  const { setIsAuthenticated, setToken, setUserEmail, setRole, role } =
    useAuth();

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setUserEmail(null);
    setRole(null);

    // Remove token from localStorage
    localStorage.removeItem("AuthToken");

    // Navigate to login or home page
    navigate("/");
  };
  return (
    <Box sx={{ flexGrow: 1, height: "40px" }}>
      <AppBar position="fixed" style={{ background: "gray" }}>
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <img src={logo} alt="Company Logo" height={50} />
            <Typography color="inherit" variant="h6">
              {role === "Admin"
                ? "Admin Panel"
                : role === "Manager"
                ? "Manager Panel"
                : role === "Employee"
                ? "Employee Panel"
                : "Panel"}
            </Typography>
          </div>
          <Button color="inherit" onClick={() => handleLogout()}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
