import React, { useState, useEffect } from 'react';
import { Button, Modal, Form as AntdForm, Input, Select, message } from 'antd';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const brandCategoryValidationSchema = Yup.object().shape({
  name: Yup.string().required("Brand Category Name is required"),
  brand_id: Yup.number().required("Brand ID is required").typeError("Brand ID must be a number"),
});

interface Brand {
  id: number;
  name: string;
}

interface BrandCategory {
  id?: number;
  name?: string;
  brand_id?: number;
}

interface BrandCategoryModalProps {
  open: boolean;
  handleClose: () => void;
  editingBrandCategory?: BrandCategory;
  brands: Brand[];
  handleSubmit: (values: BrandCategory) => Promise<void>;
}

const BrandCategoryModal: React.FC<BrandCategoryModalProps> = ({ open, handleClose, editingBrandCategory, brands, handleSubmit }) => {
  const [initialValues, setInitialValues] = useState<BrandCategory>({
    name: "",
    brand_id: undefined,
  });

  useEffect(() => {
    if (open && editingBrandCategory) {
      setInitialValues({
        name: editingBrandCategory.name || "",
        brand_id: editingBrandCategory.id, 
      });
    } else {
      setInitialValues({ name: "", brand_id: undefined });
    }
  }, [open, editingBrandCategory]);

  const onSubmit = async (values: BrandCategory) => {
    try {
      await handleSubmit(values);
      message.success("Brand Category saved successfully!");
      handleClose();
    } catch (error) {
      console.error("Error submitting Brand Category:", error);
      message.error("Error submitting Brand Category");
    }
  };

  return (
    <Modal
      title={editingBrandCategory?.id ? "Edit Brand Category" : "Add Brand Category"}
      open={open}
      onCancel={handleClose}
      footer={null}
    >
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={brandCategoryValidationSchema}
        onSubmit={onSubmit}
      >
        {({ values, isSubmitting, setFieldValue, handleChange, handleSubmit }) => (
          <AntdForm layout="vertical" onFinish={handleSubmit}>
            <AntdForm.Item label="Brand Category Name">
              <Input
                name="name"
                value={values.name}
                onChange={handleChange}
              />
              <div style={{ color: 'red' }}>
                <ErrorMessage name="name" component="span" />
              </div>
            </AntdForm.Item>

            <AntdForm.Item label="Brand">
              <Select
                value={values.brand_id} 
                onChange={(value) => setFieldValue("brand_id", value)} 
                placeholder="Select Brand"
              >
                {brands.map((brand) => (
                  <Option key={brand.id} value={brand.id}>
                    {brand.name}
                  </Option>
                ))}
              </Select>
              <div style={{ color: 'red' }}>
                <ErrorMessage name="brand_id" component="span" />
              </div>
            </AntdForm.Item>

            <AntdForm.Item>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                {editingBrandCategory?.id ? "Update" : "Create"}
              </Button>
            </AntdForm.Item>
          </AntdForm>
        )}
      </Formik>
    </Modal>
  );
};

export default BrandCategoryModal;
