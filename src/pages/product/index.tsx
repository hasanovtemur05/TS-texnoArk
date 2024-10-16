/* eslint-disable react-hooks/exhaustive-deps */
import { ProductModal, GlobalTable } from '../../components';
import product from '../../service/product';
import { useEffect, useState } from 'react';
import { Button, Space, Tooltip, Popconfirm, Input } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router-dom';
import { TablePaginationConfig } from 'antd'; 
import { ColumnsType } from 'antd/es/table'; 

type Product = {
  id: number; 
  name: string;
  price: number;
  createdAt: moment.MomentInput;
  brand_id: number;
  images: string[];
};

const Index = () => {
  const [data, setData] = useState<Product[]>([]);
  const [total, setTotal] = useState(0); 
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [params, setParams] = useState({
    search: "",
    page: 1,
    limit: 3,
  });
  const { search } = useLocation();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const resp = await product.get(params);
      if (resp.status === 200) {
        setData(resp.data?.data?.products);
        setTotal(resp.data?.data?.count); 
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItem = async (id: number) => {
    const resp = await product.delete(id);
    if (resp.status === 200) {
      getData();
    }
  };

  useEffect(() => {
    getData();
  }, [params]);

  const handleTableChange = (pagination: TablePaginationConfig) => { 
    const current = pagination.current || 1; 
    const pageSize = pagination.pageSize || 3;

    setParams((prev) => ({
      ...prev,
      page: current,
      limit: pageSize,
    }));

    const current_params = new URLSearchParams(search);
    current_params.set("page", `${current}`);
    current_params.set("limit", `${pageSize}`);
    navigate(`?${current_params}`);
  };

  useEffect(() => {
    const current_params = new URLSearchParams(search);
    const page = Number(current_params.get("page")) || 1;
    const limit = Number(current_params.get("limit")) || 3;
    const searchQuery = current_params.get("search") || "";
    setParams((prev) => ({
      ...prev,
      page: page,
      limit: limit,
      search: searchQuery,
    }));
  }, [search]);

  const editItem = (record: Product) => {
    setSelectedProduct(record);
    setIsModalOpen(true); 
  };

  const handleChange = (event: { target: { value: string; }; }) => {
    const newValue = event.target.value;
    setParams((prev) => ({
      ...prev,
      search: newValue,
    }));
    const search_params = new URLSearchParams(search);
    search_params.set("search", newValue);
    navigate(`?${search_params.toString()}`);
  };
  const columns: ColumnsType<Product> = [
    {
      title: "T/R",
      render: (_: any, __: any, index: number) => (params.page - 1) * params.limit + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (createdAt: moment.MomentInput) => moment(createdAt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Brand ID",
      dataIndex: "brand_id",
    },
    {
      title: "Images",
      dataIndex: "images",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Product) => (
        <Space>
          <Tooltip title="Edit">
            <Button onClick={() => editItem(record)} icon={<EditOutlined />} />
          </Tooltip>
          <Popconfirm
            title="Delete the product"
            description="Are you sure to delete this product?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteItem(record.id)} 
          >
            <Tooltip title="Delete">
              <Button danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
];


  return (
    <>
      <ProductModal
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        updateData={selectedProduct}
        getData={getData}
      />
      <div className="flex justify-between items-center my-3">
        <Input
          placeholder="search..."
          className="w-[300px]"
          onChange={handleChange}
        />
        <Button
          type="primary"
          onClick={() => {
            setSelectedProduct(null); 
            setIsModalOpen(true); 
          }}
        >
          Create Product
        </Button>
      </div>
      <GlobalTable
        data={data}
        columns={columns}
        pagination={{
          current: params.page,
          pageSize: params.limit,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ["2", "5", "7", "10", "12"],
        }}
        onChange={handleTableChange} 
      />
    </>
  );
};

export default Index;
