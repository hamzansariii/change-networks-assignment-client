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
import ProductFormModal from "./ProductFormModal";
import "../../../styles/AdminProducts.css"; // External CSS

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_src: string;
}

export default function AdminProductsContainer() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState<string>("default");
  const [page, setPage] = useState<number>(1);
  const [rerender, setRerender] = useState(0);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  }, [rerender]);

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  const handleNewProduct = () => {
    setEditProduct(null);
    setIsModalOpen(true);
  };

  return (
    <div className="admin-products-container">
      <h1 className="title">Products</h1>
      <div className="controls">
        <Typography variant="h5" fontWeight="bold">
          Total Products: {products.length}
        </Typography>
        <div className="control-actions">
          <Button
            variant="contained"
            color="success"
            onClick={handleNewProduct}
          >
            Add New Product
          </Button>
          <FormControl variant="outlined" size="small" className="sort-select">
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
      </div>
      <Grid container spacing={3} className="products-grid">
        {paginatedProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card className="product-card">
              <CardMedia
                component="img"
                className="product-image"
                image={"http://localhost:3500" + product.image_src}
                alt={product.name}
              />

              <CardContent className="card-content">
                <Typography variant="subtitle1" className="product-name">
                  {product.name}
                </Typography>
                <Typography variant="body2" className="product-description">
                  {product.description}
                </Typography>
                <Typography variant="h6" className="product-price">
                  ₹{product.price.toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEdit(product)}
                  className="edit-button"
                >
                  Edit
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div className="pagination-container">
        <Pagination
          count={Math.ceil(products.length / productsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
      <ProductFormModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        product={editProduct}
        onProductUpdated={() => setRerender((prev) => prev + 1)}
      />
    </div>
  );
}
