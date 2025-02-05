import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useAuth } from "../contexts/auth";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import "../styles/LoginPage.css";

interface LoginForm {
  email: string;
  password: string;
}

const routes: Record<string, string> = {
  Admin: "/admin",
  Manager: "/manager",
  Employee: "/employee",
};

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(3, "Password must be at least 3 characters")
    .required("Password is required"),
});

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: yupResolver(schema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes[role as keyof typeof routes] || "/");
    }
  }, [isAuthenticated, role, navigate]);

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_EXPRESS_API_BASE_URI}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const resData = await response.json();
        setIsAuthenticated(true);
        setToken(resData.token);
        setUserEmail(resData.email);
        setRole(resData.role);
        localStorage.setItem("AuthToken", resData.token);
        navigate(routes[resData.role as keyof typeof routes] || "/");
      } else {
        alert("Username or Password Incorrect!");
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <Container maxWidth="xs" className="login-container">
      <Box className="login-box">
        <img src={logo} alt="Company Logo" height={50} />
        <Typography variant="h4" className="login-title">
          Login
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            className="login-button"
            type="submit"
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
