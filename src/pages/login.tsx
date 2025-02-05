import { useEffect, useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useAuth } from "../contexts/auth";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png"; // Add your image path
import "../styles/LoginPage.css";

const LoginPage = () => {
  const {
    setToken,
    setUserEmail,
    setIsAuthenticated,
    isAuthenticated,
    role,
    setRole,
  } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      switch (role) {
        case "Admin":
          navigate("/admin");
          break;
        case "Manager":
          navigate("/manager");
          break;
        case "Employee":
          navigate("/employee");
          break;
        default:
          break;
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleLogin = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_EXPRESS_API_BASE_URI}/api/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );
    if (response.ok) {
      const resData = await response.json();
      setIsAuthenticated(true);
      setToken(resData.token);
      setUserEmail(resData.email);
      setRole(resData.role);
      localStorage.setItem("AuthToken", resData.token);
      switch (resData.role) {
        case "Admin":
          navigate("/admin");
          break;
        case "Manager":
          navigate("/manager");
          break;
        case "Employee":
          navigate("/employee");
          break;
        default:
          break;
      }
    } else {
      alert("Username or Password Incorrect!");
    }
  };

  return (
    <Container maxWidth="xs" className="login-container">
      <Box className="login-box">
        <img src={logo} alt="Company Logo" height={50} />
        <Typography variant="h4" className="login-title">
          Login
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          className="login-button"
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
