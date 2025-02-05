import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/auth";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import "../../../styles/MembersTable.css"; // External CSS for styling

interface Member {
  name: string;
  email: string;
  order_count: number;
}

const MembersTable = () => {
  const { token, userEmail } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const response = await fetch(`/api/my-team/${userEmail}`, {
        method: "GET",
        headers: { "x-access-token": token },
      });
      if (response.ok) {
        setMembers(await response.json());
      }
    };
    fetchMembers();
  }, [userEmail, token]);

  return (
    <div className="members-container">
      <Typography variant="h5" className="table-title">
        My Team Members
      </Typography>
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Number of Orders</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member, index) => (
              <TableRow key={index} className="table-row">
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.order_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MembersTable;
