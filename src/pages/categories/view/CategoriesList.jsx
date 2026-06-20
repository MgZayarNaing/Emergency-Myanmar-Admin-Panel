import React, { useEffect, useState } from 'react'

import { API_BASE_URL, ENDPOINT, IMAGE_BASE_URL } from '../../../endpoints/endpoints'
import { Avatar, message, Spin, Table } from 'antd'
import { flex, width } from '@mui/system'
import { useNavigate } from 'react-router-dom'

const CategoriesList = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

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
        fetchCategories()
    }, [])

    const fetchCategories = async (token) => {
        try {
            setLoading(true);

            // endpoint
            const url = ENDPOINT.CATEGORIES.LIST.replace('{API_BASE_URL}', API_BASE_URL)

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
            setCategories(data)
        } catch (error) {
            console.error("Error Fetch Categories", error);
            message.error("Categories not fetch")

        } finally {
            setLoading(false);
        }
    };

    // Desgin Table colums
    const colums = [
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
        { title: 'Category Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        { title: ' ID', dataIndex: 'id', key: 'id', ellipsis: true, }
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

            />
        </div>
    )
}

export default CategoriesList