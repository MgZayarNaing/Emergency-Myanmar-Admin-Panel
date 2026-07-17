import React, { useEffect, useState } from "react";
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
import { message } from "antd";

const Create = () => {
    const [form,setForm] = useState({
         name_en: "",
        name_mm: "",
        logo:''
    })

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
      });

      const [preview,setPreview] = useState();
      const [messageApi, contextHolder] = message.useMessage();
      const [loading, setLoading] = useState(true);

      const handleImage = (e) => {
        const file = e.target.files[0];

        if(file){
            setPreview(URL.createObjectURL(file))
            setForm({...form,'logo':file})
        }
      }

      const handleChange = (e) => {
        const {name,value} = e.target
        setForm({...form,[name]:value})
      }

       useEffect(() => {
      
              // token check
              const token = localStorage.getItem('access_token');
      
              if (!token) {
                  messageApi.warning("Please Login");
                  setTimeout(() => {
                      navigate('/login')
                  }, 1500);
                  return;
              }
          }, [])

      const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name_en',form.name_en);
        data.append('name_mm',form.name_mm);
        data.append('logo',form.logo)

        try{
            const token = localStorage.getItem('access_token');
            const response = await fetch(ENDPOINT.CATEGORIES.CREATE,{
                method:'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body:data
            });

             if (response.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                messageApi.error("Session Exp, Please Login Try Again !");
                navigate('/login')
                return
            }

            if (response.status == 201) {
                messageApi.success("Category create successful")
                navigate('/categories/list/')
            }else{
                throw new Error('Network response was not ok')
            }

        }
        catch(err){
           message.error("Categories not fetch")
        }
      }
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
  )
}

export default Create
