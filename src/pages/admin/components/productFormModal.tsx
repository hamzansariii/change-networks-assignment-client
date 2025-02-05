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
  product?: Product | null;
  onProductUpdated: () => void;
}

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  image_src: string | File;
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
    image_src: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        image_src: "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        image_src: "",
      });
    }
  }, [product]);

  const handleCloseModal = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      image_src: "",
    });
    handleClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Math.max(0, parseFloat(value)) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image_src: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Product name is required.");
      return;
    }
    if (!formData.description.trim()) {
      alert("Description is required.");
      return;
    }
    if (formData.price <= 0) {
      alert("Price must be greater than zero.");
      return;
    }
    if (!formData.image_src && !product) {
      alert("Please upload an image.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", String(formData.price));
    if (formData.image_src)
      formDataToSend.append("image_src", formData.image_src);

    const endpoint = product
      ? `${import.meta.env.VITE_EXPRESS_API_BASE_URI}/api/products/update/${
          product._id
        }`
      : `${import.meta.env.VITE_EXPRESS_API_BASE_URI}/api/products/add`;
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
        handleCloseModal();
        onProductUpdated();
      } else {
        alert("Error submitting the form.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit the form.");
    }
  };

  const handleDelete = async () => {
    if (!product?._id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_EXPRESS_API_BASE_URI}/api/products/delete/${
          product._id
        }`,
        {
          method: "DELETE",
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.ok) {
        alert("Product deleted successfully!");
        handleCloseModal();
        onProductUpdated();
      } else {
        alert("Error deleting the product.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete the product.");
    }
  };

  return (
    <Modal open={open} onClose={handleCloseModal}>
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
            inputProps={{ min: 0 }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ margin: "10px 0", width: "100%" }}
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" type="submit">
              {product ? "Update" : "Submit"}
            </Button>
            {product && (
              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
