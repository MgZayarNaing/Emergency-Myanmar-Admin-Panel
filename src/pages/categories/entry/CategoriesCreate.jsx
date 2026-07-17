import React, { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import { ENDPOINT } from "../../../endpoints/endpoints";
import { useNavigate } from "react-router";

const CategoriesCreate = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name_en: "",
    name_mm: "",
  });

  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");

    const formData = new FormData();

    formData.append("name_en", form.name_en);
    formData.append("name_mm", form.name_mm);

    if (logo) {
      formData.append("logo", logo);
    }

    try {
      const response = await fetch(ENDPOINT.CATEGORIES.CREATE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Create failed");
      }

      showMessage("Category created successfully.");

      setTimeout(() => {
        navigate("/categories/list/");
      }, 1200);
    } catch (error) {
      console.log(error);
      showMessage("Failed to create category.", "error");
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((prev) => ({ ...prev, open: false }))
        }
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Card sx={{ width: 600 }}>
        <CardHeader title="Create Category" />

        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="English Name"
                name="name_en"
                value={form.name_en}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                label="Myanmar Name"
                name="name_mm"
                value={form.name_mm}
                onChange={handleChange}
                fullWidth
                required
              />

              <Box textAlign="center">
                <Avatar
                  src={preview}
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mb: 2,
                  }}
                />

                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Logo

                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                  />
                </Button>
              </Box>

              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                size="large"
              >
                Create Category
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CategoriesCreate;