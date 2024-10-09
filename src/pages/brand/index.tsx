import { useEffect, useState } from 'react';
import { Button, Popconfirm, Space, Tooltip, Input, Form } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { brand, category } from '@service';
import { BrandModal, GlobalTable } from '@components';
import { useLocation, useNavigate } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
  description: string;
  category_id: number;
  file?: string;
}

const Index: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Brand[]>([]);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [params, setParams] = useState({
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
      const res = await brand.get(params);
      setData(res?.data?.data?.brands);
      setTotal(res?.data?.data?.count);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await category.get();
      setCategories(res?.data?.data?.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    getData();
    fetchCategories();
  }, [params]);

  const handleTableChange = (pagination: number) => {
    const { current, pageSize: } = pagination;
    setParams((prev) => ({
      ...prev,
      page: current,
      limit: pageSize,
    }));
    const currentParams = new URLSearchParams(search);
    currentParams.set('page', `${current}`);
    currentParams.set('limit', `${pageSize}`);
    navigate(`?${currentParams}`);
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
    }));
    const searchParams = new URLSearchParams(search);
    searchParams.set('search', search_value);
    navigate(`?${searchParams}`);
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
      render: (_: unknown, __: unknown, index: number) => (params.page - 1) * params.limit + index + 1,
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
      render: (_: unknown, record: Brand) => (
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
            onConfirm={() => handleDelete(record.id)}
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
        editingBrand={editingBrand}
        categories={categories}
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
