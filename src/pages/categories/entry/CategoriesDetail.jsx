import React, { useEffect, useState } from 'react'
import { API_BASE_URL, ENDPOINT, IMAGE_BASE_URL } from '../../../endpoints/endpoints'
import { useNavigate, useParams } from 'react-router'
import { Box } from '@mui/system';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const CategoriesDetail = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    // mui snack
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: 'info' });

    const showMessage = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity })
    }

    const hadleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false })
    }

    useEffect(() => {

        // token check
        const token = localStorage.getItem('access_token');

        if (!token) {
            // messageApi.warning("Please Login");
            showMessage("Please Login", "warning")
            setTimeout(() => {
                navigate('/login')
            }, 1500);
            return;
        }
        fetchCategoriesDetail(token);
    }, [id])

    const fetchCategoriesDetail = async (token) => {
        // api fetch
        try {
            setLoading(true);
            const url = ENDPOINT.CATEGORIES.DETAIL(id);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            // token exp
            if (response.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                showMessage("Session Exp, Please Login Try Again !");
                navigate('/login')
                return

            }
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const data = await response.json();
            setCategory(data)

        } catch (error) {
            console.error("Error Fetch Categories", error);
            showMessage("Categories not fetch")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <Typography>Loading categories detail</Typography>
            // desgin ထည့်လို့ရတယ်
        )
    }

    const imageUrl = category?.logo && category.logo.startsWith('http')
        ? category.logo
        : `${IMAGE_BASE_URL}${category?.logo}`;


    return (
        <Box>
            {/* message */}

            <Snackbar>
                <Alert onClose={hadleCloseSnackbar} severity={snackbar.severity} variant='filled' sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* mui detail card */}

            <Card sx={{ maxWidth: 700, boxShadow: ' 0 4px 20px black', borderRadius: '12px' }}>
                {/* back */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Categories Details</Typography>
                    <Button
                        variant='contained'
                        startIcon={<EditIcon />}
                        sx={{ textTransform: 'none', borderRadius: '6px' }}
                    >
                        Edit
                    </Button>
                </Box>

                {/* Image Avater */}
                <CardContent>
                    <Box>
                        <Avatar
                        src={imageUrl}
                        alt='Category Logo'
                        />
                    </Box>
                </CardContent>

                {/* table info */}
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Category ID</TableCell>
                                <TableCell>{category?.id}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Category Name</TableCell>
                                <TableCell>{category?.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Category Logo</TableCell>
                                <TableCell>
                                    <Typography
                                        component="a"
                                        href={imageUrl}
                                        target='_blank'
                                    >{category?.logo}</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    )
}

export default CategoriesDetail