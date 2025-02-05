import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/auth";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};
interface ProductFormModalProps {
  open: boolean;
  handleClose: () => void;
  product?: Product;
  onProductUpdated: () => void;
}
interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string | File; // Allow both string (URL) and File
}

export default function ProductFormModal({
  open,
  handleClose,
  product,
  onProductUpdated,
}: ProductFormModalProps) {
  const { token } = useAuth();
  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    image: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        image: "", // Reset image field for new uploads
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0, // Ensure price is a number
        image: "", // Ensure consistency in image handling
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.image && !product) {
      alert("Please upload an image.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", String(formData.price));
    if (formData.image) formDataToSend.append("image", formData.image);

    const endpoint = product
      ? `/api/products/update/${product._id}`
      : "/api/products/add";
    const method = product ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "x-access-token": token,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        alert(
          product
            ? "Product updated successfully!"
            : "Product added successfully!"
        );
        handleClose();
        onProductUpdated(); // Refresh product list
      } else {
        alert("Error submitting the form.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit the form.");
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6">
          {product ? "Edit Product" : "Add New Product"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Product Name"
            fullWidth
            margin="normal"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <TextField
            label="Price"
            fullWidth
            margin="normal"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ margin: "10px 0", width: "100%" }}
          />
          <Box mt={2}>
            <Button variant="contained" color="primary" type="submit">
              {product ? "Update" : "Submit"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
