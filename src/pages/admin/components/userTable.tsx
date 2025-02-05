import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/auth";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import "../../../styles/UserTable.css"; // External CSS file
import UserFormModal from "./userFormModal";

interface User {
  _id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  role: string;
  manager_email?: string;
}

const UserTable = () => {
  const { token } = useAuth();
  const [data, setData] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [rerender, setRerender] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_EXPRESS_API_BASE_URI}/api/users`,
        {
          method: "GET",
          headers: { "x-access-token": token },
        }
      );
      if (response.ok) {
        setData(await response.json());
      }
    };
    fetchUserData();
  }, [rerender]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="user-table-container">
      <div className="header">
        <h2>User Management</h2>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedUser(null);
            setIsModalOpen(true);
          }}
          className="add-user-button"
        >
          Add User
        </Button>
      </div>

      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Role</th>
              <th>Manager Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.age}</td>
                <td>{user.role}</td>
                <td>{user.manager_email || "NA"}</td>
                <td>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Modal */}
      <UserFormModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSuccess={() => setRerender((prev) => prev + 1)}
      />
    </div>
  );
};

export default UserTable;
