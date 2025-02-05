import { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
} from "@mui/material";
import { useAuth } from "../../../contexts/auth";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_src: string;
}

const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Apple Watch",
    description: "Smartwatch with fitness tracking",
    price: 299.99,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 2,
    name: "Sony Headphones",
    description: "Noise-cancelling over-ear",
    price: 149.99,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 3,
    name: "MacBook Pro",
    description: "Powerful laptop for professionals",
    price: 1999.99,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 4,
    name: "Samsung Galaxy S23",
    description: "Flagship Android smartphone",
    price: 899.99,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 5,
    name: "Nike Air Max",
    description: "Comfortable and stylish sneakers",
    price: 129.99,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 6,
    name: "Canon EOS Camera",
    description: "DSLR camera for photography enthusiasts",
    price: 799.99,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 7,
    name: "Fitbit Tracker",
    description: "Fitness tracker for monitoring activity",
    price: 99.99,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 8,
    name: "Bose Speaker",
    description: "Portable Bluetooth speaker with great sound",
    price: 249.99,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 9,
    name: "Kindle Paperwhite",
    description: "E-reader for book lovers",
    price: 139.99,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 10,
    name: "Nintendo Switch",
    description: "Hybrid gaming console",
    price: 299.99,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 11,
    name: "Dell XPS 15",
    description: "High-performance laptop for creators",
    price: 1799.99,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 12,
    name: "LG OLED TV",
    description: "High-definition television with stunning picture",
    price: 1499.99,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 13,
    name: "KitchenAid Mixer",
    description: "Stand mixer for baking enthusiasts",
    price: 399.99,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 14,
    name: "Instant Pot",
    description: "Multi-functional pressure cooker",
    price: 99.99,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 15,
    name: "Roomba Vacuum",
    description: "Robot vacuum cleaner for easy cleaning",
    price: 349.99,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 16,
    name: "GoPro Hero 11",
    description: "Action camera for capturing adventures",
    price: 499.99,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 17,
    name: "DJI Drone",
    description: "Drone for aerial photography and videography",
    price: 799.99,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 18,
    name: "Fender Guitar",
    description: "Electric guitar for musicians",
    price: 699.99,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 19,
    name: "Herman Miller Chair",
    description: "Ergonomic office chair for comfort",
    price: 999.99,
    image: "https://via.placeholder.com/200",
  },
  {
    id: 20,
    name: "Yeti Cooler",
    description: "Durable cooler for outdoor activities",
    price: 299.99,
    image: "https://via.placeholder.com/200",
  },
];

export default function ProductsContainer() {
  const { token, userEmail } = useAuth();
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [sortOption, setSortOption] = useState<string>("default");
  const [page, setPage] = useState<number>(1);
  const productsPerPage = 6;

  const handleSortChange = (event: any) => {
    const value = event.target.value;
    setSortOption(value);
    let sortedProducts = [...products];
    if (value === "priceAsc") sortedProducts.sort((a, b) => a.price - b.price);
    else if (value === "priceDesc")
      sortedProducts.sort((a, b) => b.price - a.price);
    else if (value === "nameAsc")
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    else if (value === "nameDesc")
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    setProducts(sortedProducts);
  };

  const handlePageChange = (event: any, value: number) => setPage(value);

  const startIndex = (page - 1) * productsPerPage;
  const paginatedProducts = products.slice(
    startIndex,
    startIndex + productsPerPage
  );

  useEffect(() => {
    const fetchProductsData = async () => {
      const response = await fetch(`/api/products`, {
        method: "GET",
        headers: { "x-access-token": token },
      });
      if (response.ok) {
        setProducts(await response.json());
      }
    };
    fetchProductsData();
  }, []);

  const handleOrder = async (product: Product) => {
    const response = await fetch("/api/orders/place-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify({ email: userEmail, productDetails: product }),
    });
    if (response.ok) {
      alert(`Order placed for ${product.name} at $${product.price}`);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      <h1>Products</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Total Products: {products.length}
        </Typography>
        <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOption}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="priceAsc">Price: Low to High</MenuItem>
            <MenuItem value="priceDesc">Price: High to Low</MenuItem>
            <MenuItem value="nameAsc">Name: A to Z</MenuItem>
            <MenuItem value="nameDesc">Name: Z to A</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Grid container spacing={3}>
        {paginatedProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
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
                image={"http://localhost:3500" + product.image_src}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" mt={1}>
                  ${product.price.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2, borderRadius: 1 }}
                  onClick={() => handleOrder(product)}
                >
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Pagination
          count={Math.ceil(products.length / productsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
}
