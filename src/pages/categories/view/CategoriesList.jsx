import React, { useEffect, useState } from 'react'

import { API_BASE_URL, ENDPOINT, IMAGE_BASE_URL } from '../../../endpoints/endpoints'
import { Avatar, Button, message, Popconfirm, Space, Spin, Table } from 'antd'
import { flex, width } from '@mui/system'
import { useNavigate } from 'react-router-dom'

const CategoriesList = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(2)

    // message hook
    const [messageApi, contextHolder] = message.useMessage()

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
        fetchCategories( token,currentPage, pageSize)
    }, [currentPage,pageSize])

    const fetchCategories = async (token, page=1, limit = 10) => {
        try {
            setLoading(true);
            const offset = (page -  1) * limit

            // endpoint
            let url = ENDPOINT.CATEGORIES.LIST.replace('{API_BASE_URL}', API_BASE_URL)

            const pag = url.includes('?') ? '&' : '?';

            url = `${url}${pag}limit=${limit}&offset={offset}&page=${page}`

            // const response = await fetch(url)
            // if (!response.ok) {
            //     throw new Error('Network Error')
            // }

            const response = await fetch(url, {
                method: 'GET',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            // token exp
            if (response.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                messageApi.error("Session Exp, Please Login Try Again !");
                navigate('/login')
                return
            }

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json()

            if ( data && data.results && data.results.data){
                setCategories(data.results.data)
                setTotal(data.count)
            } else {
                setCategories([])
                setTotal(0)
            }
            
        } catch (error) {
            console.error("Error Fetch Categories", error);
            message.error("Categories not fetch")

        } finally {
            setLoading(false);
        }
    };

    // const handleDetail = (record) => {
    //     console.log("Detail Category",record);
    //     // navigate(`/categories/update/${record.id}`)

    // }

    const handleEdit = (record) => {
        console.log("Edit Category", record);
        navigate(`/categories/update/${record.id}`)

    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure ...?")) {
            return;
        }

        const token = localStorage.getItem('access_token');
        if (!token) {
            messageApi.warning("Please Login")
            navigate('/login');
            return;
        }

        try {
            setLoading(true);

            let url = ENDPOINT.CATEGORIES.DELETE(id);
            //url = url.repeat(`${API_BASE_URL}`, API_BASE_URL);

            const response = await fetch(url, {
                method: 'DELETE',
                header: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }


            })

            // token exp
            if (response.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                messageApi.error("Session Exp, Please Login Try Again !");
                navigate('/login')
                return

            }

            if (response.ok) {
                messageApi.success("Category delete successful")

                setCategories(preCategories => preCategories.filter(item => item.id !== id))
            } else {
                throw new Error('Network response was not ok')
            }
        } catch (error) {
            console.error("Error Fetch Categories", error);
            messageApi.error("Failed to delete category")

        } finally {
            setLoading(false);
        }
    }

    // Desgin Table colums
    const colums = [
        {
            title: ' ID', dataIndex: 'id', key: 'id', ellipsis: true, render: (text, record) => (
                <a onClick={() => navigate(`/categories/${record.id}`)} >{text}</a>
            )
        },
        {
            title: 'Logo',
            dataIndex: 'logo',
            key: 'logo',
            render: (text) => {
                const imageurl = text && text.startsWith('http') ? text : `${IMAGE_BASE_URL}${text}`;
                return <Avatar src={imageurl} shape='square' size={40} alt='logo' />
            },
            width: 100,

        },
        {
            title: 'Category Name ( EN )', dataIndex: 'name_en', key: 'name_en', sorter: (a, b) => a.name_en.localeCompare(b.name_en),

        },
        {
            title: 'Category Name ( MM )', dataIndex: 'name_mm', key: 'name_mm', sorter: (a, b) => a.name_mm.localeCompare(b.name_mm),

        },
        {
            title: ' Action',
            key: 'action',
            width: 300,
            render: (_, record) => (
                <Space size="middle">
                    <Button type='link' onClick={() => navigate(`/categories/${record.id}`)}>Detail</Button>

                    <Button type='link' onClick={() => handleEdit(record)}>Edit</Button>
                    {/* <Button type='link' danger onClick={() => handleDelete(record.id)}>Delete</Button> */}

                    <Popconfirm 
                    title="Delete the category"
                    discription="Are your ....?"
                    onConfirm={() => handleDelete(record.id)}
                    >
                        <Button type='link' danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            )
        },

    ]

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Spin size='large' tip="Loading Categories" />
            </div>
        )
    }
    return (
        <div style={{ padding: '24px', background: '#ffff', borderRadius: '8px ' }}>
            {/* message show */}
            {contextHolder}

            <h2>Categories List</h2>
            <Table
                dataSource={categories}
                columns={colums}
                rowKey="id"

                pagination = {{
                    current:currentPage,
                    pageSize : pageSize,
                    total:total,
                    showSizeChanger: false,
                    showTotal: (total) => `Total ${total} categories`,
                    onChange: ( page, size ) => {
                        setCurrentPage(page);
                        setPageSize(size)
                    }
                }}

            />
        </div>
    )
}

export default CategoriesList