import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Input, Select, Upload, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { UploadOutlined } from "@ant-design/icons";
import { category, brand, brandCategory, product } from "@service";

const { Option } = Select;
interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  updateData?: ProductData; 
  getData: () => void;
}

interface ProductData {
  id?: number;
  name?: string;
  price?: string;
  category_id?: number;
  brand_id?: number;
  brand_category_id?: number;
}

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface BrandCategory {
  id: number;
  name: string;
}



const ProductModal: React.FC<ProductModalProps> = ({
  open,
  onClose,
  updateData = {},
  getData,
}) => {
  const [form] = useForm();
  const [file, setFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsCategory, setBrandsCategory] = useState<BrandCategory[]>([]);
  const isEdit = !!updateData?.id;

  const handleClose = () => {
    onClose();
    form.resetFields();
    setFile(null);
  };

  const addOrUpdateProduct = async (values: {
    name: string;
    price: string;
    category_id: string;
    brand_id: string;
    brand_category_id: string;
  }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("category_id", values.category_id);
    formData.append("brand_id", values.brand_id);
    formData.append("brand_category_id", values.brand_category_id);
    
    if (file) {
      formData.append("files", file);
    }
  
    try {
      const resp = isEdit
        ? await product.update(updateData.id!, formData) 
        : await product.create(formData);
  
      if (resp.status === 200 || resp.status === 201) {
        getData();
        handleClose();
        message.success(
          isEdit ? "Product updated successfully" : "Product created successfully"
        );
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong!");
    }
  };
  

  const getCategories = async () => {
    const resp = await category.get(params);
    setCategories(resp.data?.data?.categories);
  };
  

  const getBrands = async (id: number) => {
    const resp = await brand.getBrandId(id);
    setBrands(resp.data?.data?.brands);
  };

  const getBrandsCategories = async (id: number) => {
    const resp = await brandCategory.brandCategoryId(id);
    setBrandsCategory(resp.data?.data?.brandCategories);
  };

  const handleUpload = (info: { fileList: any }) => {
    const fileList = info.fileList;
    if (fileList.length > 0) {
      setFile(fileList[0].originFileObj);
    } else {
      setFile(null);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (isEdit) {
      form.setFieldsValue({
        name: updateData.name,
        price: updateData.price,
        category_id: updateData.category_id,
        brand_id: updateData.brand_id,
        brand_category_id: updateData.brand_category_id,
      });
    }
  }, [updateData, isEdit, form]);

  return (
    <Modal
      title={isEdit ? "Edit Product" : "Create Product"}
      open={open}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {isEdit ? "Update" : "Save"}
        </Button>,
      ]}
    >
      <Form form={form} onFinish={addOrUpdateProduct}>
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="category_id"
          label="Category"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select Category" onChange={(id) => getBrands(id)}>
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="brand_id" label="Brand" rules={[{ required: true }]}>
          <Select placeholder="Select Brand" onChange={(id) => getBrandsCategories(id)}>
            {brands.map((brand) => (
              <Option key={brand.id} value={brand.id}>
                {brand.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="brand_category_id"
          label="Brand Category"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select Brand Category">
            {brandsCategory.map((brandCategory) => (
              <Option key={brandCategory.id} value={brandCategory.id}>
                {brandCategory.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Upload Product Image">
          <Upload
            beforeUpload={() => false}
            onChange={handleUpload}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductModal;
