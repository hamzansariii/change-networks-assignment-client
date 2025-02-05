import * as React from "react";
import { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useAuth } from "../../../contexts/auth";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface User {
  _id?: string; // Make _id optional
  name: string;
  age: number;
  email: string;
  password: string;
  role: string;
  manager_email?: string;
}

interface Props {
  open: boolean;
  handleClose: () => void;
  user: User | null;
  onSuccess: () => void;
}

const UserFormModal: React.FC<Props> = ({
  open,
  handleClose,
  user,
  onSuccess,
}) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState<User>({
    _id: "",
    name: "",
    age: 0,
    email: "",
    password: "",
    role: "",
    manager_email: "",
  });
  const [managerEmailList, setManagerEmailList] = useState<string[]>([]);

  useEffect(() => {
    console.log("USER = ", user);
    if (user) setFormData(user); // Pre-fill fields if editing
  }, [user]);

  const handleModalClose = () => {
    setFormData({
      _id: "",
      name: "",
      age: 0,
      email: "",
      password: "",
      role: "",
      manager_email: "",
    });
    handleClose();
  };

  useEffect(() => {
    const fetchManagerEmails = async () => {
      const response = await fetch(
        `${
          import.meta.env.VITE_EXPRESS_API_BASE_URI
        }/api/users/managers/emails`,
        {
          method: "GET",
          headers: { "x-access-token": token },
        }
      );
      if (response.ok) {
        setManagerEmailList(await response.json());
      }
    };
    fetchManagerEmails();
  }, []);

  // For handling changes for both TextField and Select components
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as string]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = user ? "PUT" : "POST"; // PUT for edit, POST for new user
    const url = user
      ? `${import.meta.env.VITE_EXPRESS_API_BASE_URI}/api/users/update/${
          user._id
        }`
      : `${import.meta.env.VITE_EXPRESS_API_BASE_URI}/api/users/add`;

    if (!user) {
      delete formData._id;
    }

    console.log("Submit = ", formData);
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      console.log(user ? "Updated Successfully" : "Added Successfully");
      onSuccess();
      handleModalClose();
    }
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
      <Box sx={style}>
        <Typography variant="h6">
          {user ? "Edit User" : "Add New User"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={!!user}
          />
          <TextField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!!user}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={!!user}
              required
            >
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
            </Select>
          </FormControl>
          {formData.role === "Employee" && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Manager Email</InputLabel>
              <Select
                name="manager_email"
                value={formData.manager_email}
                onChange={handleChange}
                disabled={!!user}
                required
              >
                {managerEmailList.map((email) => (
                  <MenuItem value={email} key={email}>
                    {email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Button type="submit" variant="contained" color="primary">
            {user ? "Update" : "Submit"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default UserFormModal;
