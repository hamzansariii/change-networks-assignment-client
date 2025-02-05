import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
} from "@mui/material";
import { useAuth } from "../../../contexts/auth";
import "../../../styles/OrdersTab.css"; // Import external CSS

interface ProductDetails {
  id: number;
  name: string;
  description: string;
  price: number;
  image_src: string;
}

interface CustomerDetails {
  _id: string;
  name: string;
  age: number;
  email: string;
  role: string;
  manager_email: string;
}

interface Order {
  _id: string;
  customer_id: string;
  customer_name: string;
  product_details: ProductDetails;
  order_status: string;
  customer_details: CustomerDetails;
}

export default function OrdersTab() {
  const { token, userEmail } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const ordersPerPage = 6;

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_EXPRESS_API_BASE_URI}/api/orders/${userEmail}`,
        {
          headers: { "x-access-token": token },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    };
    fetchOrders();
  }, [userEmail, token]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, order_status: newStatus } : order
      )
    );
    await fetch("/api/orders/status", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-access-token": token },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    });
  };

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.order_status === statusFilter);

  const startIndex = (page - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ordersPerPage
  );

  return (
    <div className="orders-container">
      <h1 className="title">All Orders</h1>
      <FormControl
        variant="outlined"
        size="small"
        className="filter-dropdown"
        style={{ margin: "10px" }}
      >
        <InputLabel>Filter by Status</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          label="Filter by Status"
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Delivered">Delivered</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>

      <Grid container spacing={3} className="orders-grid">
        {paginatedOrders.map((order) => (
          <Grid item key={order._id} xs={12} sm={6} md={4}>
            <Card className="order-card">
              <CardMedia
                component="img"
                className="order-image"
                image={`${import.meta.env.VITE_EXPRESS_API_BASE_URI}${
                  order.product_details.image_src
                }`}
                alt={order.product_details.name}
              />
              <CardContent className="card-content">
                <Typography variant="subtitle1" className="product-name">
                  {order.product_details.name}
                </Typography>
                <Typography variant="body2" className="product-description">
                  {order.product_details.description}
                </Typography>
                <Typography variant="h6" className="product-price">
                  ₹{order.product_details.price.toFixed(2)}
                </Typography>

                {/* Customer Details */}
                <div className="customer-details">
                  <Typography
                    variant="subtitle2"
                    style={{ textAlign: "center" }}
                  >
                    Customer Details:
                  </Typography>
                  <Typography variant="body2">
                    <strong>Name:</strong> {order.customer_details.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Customer Email:</strong>{" "}
                    {order.customer_details.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Customer Age:</strong> {order.customer_details.age}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Manager Email:</strong>{" "}
                    {order.customer_details.manager_email}
                  </Typography>
                </div>

                <FormControl
                  variant="outlined"
                  size="small"
                  className="status-dropdown"
                >
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={order.order_status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    label="Status"
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <div className="pagination-container">
        <Pagination
          count={Math.ceil(filteredOrders.length / ordersPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </div>
    </div>
  );
}
