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
}

interface Order {
  _id: string;
  customer_id: string;
  customer_name: string;
  product_details: ProductDetails;
  order_status: string;
  customer_details: CustomerDetails;
}

export default function YourOrdersContainer() {
  const { token, userEmail } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState<number>(1);
  const ordersPerPage = 6;

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(`/api/my-orders/${userEmail}`, {
        headers: { "x-access-token": token },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    };
    fetchOrders();
  }, [userEmail, token]);

  const handlePageChange = (event: any, value: number) => setPage(value);

  const startIndex = (page - 1) * ordersPerPage;
  const paginatedOrders = orders.slice(startIndex, startIndex + ordersPerPage);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <h1>My Orders</h1>
      <Grid container spacing={3}>
        {paginatedOrders.map((order) => (
          <Grid item key={order._id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                maxWidth: 300,
                boxShadow: 3,
                borderRadius: 2,
                textAlign: "center",
                padding: 2,
              }}
            >
              <CardMedia
                component="img"
                height="160"
                image={
                  "http://localhost:3500" + order.product_details.image_src
                }
                alt={order.product_details.name}
              />
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {order.product_details.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.product_details.description}
                </Typography>
                <Typography variant="h6" color="primary" mt={1}>
                  ${order.product_details.price.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {order.order_status}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Pagination
          count={Math.ceil(orders.length / ordersPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
}
