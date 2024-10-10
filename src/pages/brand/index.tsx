/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Button, Popconfirm, Space, Tooltip, Input, TablePaginationConfig } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { brand, category } from '@service';
import { BrandModal, GlobalTable } from '../../components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Brand, Params, Category } from '../../types'; 

const Index = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Brand[]>([]);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [params, setParams] = useState<Params>({
    search: '',
    page: 1,
    limit: 3,
  });

  const navigate = useNavigate();
  const { search } = useLocation();

  const handleClose = () => {
    setOpen(false);
    setEditingBrand(null);
  };

  const getData = async () => {
    try {
        const paramsObj = {
            params: {
                search: params.search,
                page: params.page,
                limit: params.limit,
            },
        };
        const res = await brand.get('', paramsObj); 
        setData(res?.data?.data?.brands || []); 
        setTotal(res?.data?.data?.count || 0); 
    } catch (error) {
        console.log("Error fetching brands:", error);
    }
};

  
  
  

const fetchCategories = async () => {
  try {
      const paramsObj = {
          params: {
              search: '', 
              page: 1,
              limit: 10,
          },
      };
      const res = await category.get('', paramsObj); 
      setCategories(res?.data?.data?.categories || []); 
  } catch (error) {
      console.error('Error fetching categories:', error);
  }
};



  useEffect(() => {
    getData();
    fetchCategories();
  }, [params]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    const { current = 1, pageSize = 3 } = pagination; 
    setParams((prev) => ({
      ...prev,
      page: current,
      limit: pageSize,
    }));

    const searchParams = new URLSearchParams(search);
    searchParams.set('page', `${current}`);
    searchParams.set('limit', `${pageSize}`);
    navigate(`?${searchParams.toString()}`);
  };

  const handleCreate = () => {
    setEditingBrand(null);
    setOpen(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search_value = event.target.value;
    setParams((prev) => ({
      ...prev,
      search: search_value,
      page: 1,
    }));

    const searchParams = new URLSearchParams(search);
    searchParams.set('search', search_value);
    navigate(`?${searchParams.toString()}`);
    getData(); 
  };

  const handleDelete = async (id: number) => {
    try {
      await brand.delete(id); 
      getData(); 
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const columns = [
    {
      title: 'T/R',
      render: (_: any, __: any, index: number) => (params.page - 1) * params.limit + index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Category ID',
      dataIndex: 'category_id',
    },
    {
      title: 'File',
      dataIndex: 'file',
    },
    {
      title: 'Action',
      render: (_: any, record: Brand) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              onClick={() => {
                setEditingBrand(record);
                setOpen(true);
              }}
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Popconfirm
            title="Delete"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.id)} // handleDelete ni chaqirish
          >
            <Tooltip title="Delete">
              <Button icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <BrandModal
        open={open}
        handleClose={handleClose}
        getData={getData}
        categories={categories} 
        editingBrand={editingBrand} 
      />
      <div>
        <Input
          placeholder="Search..."
          onChange={handleChange}
          style={{ width: 300, marginBottom: 10 }}
        />
        <Button type="primary" onClick={handleCreate}>
          Create Brand
        </Button>
      </div>
      <GlobalTable
        columns={columns}
        data={data} 
        pagination={{
          current: params.page,
          pageSize: params.limit,
          total,
          showSizeChanger: true,
          pageSizeOptions: ['2', '5', '7', '10', '12'],
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default Index;
