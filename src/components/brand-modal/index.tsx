
import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { Button, Modal, Form, Input, Select, Upload, message } from 'antd';
import { Formik, Field, ErrorMessage } from 'formik'; 
import * as Yup from 'yup';
import { brand } from '@service';
import { BrandForm, BrandModalProps } from '../../types'; 

const { Option } = Select;

const brandValidationSchema = Yup.object().shape({
  name: Yup.string().required("Brand Name is required"),
  description: Yup.string().required("Description is required"),
  category_id: Yup.number().required("Category ID is required").typeError("Category ID must be a number"),
  file: Yup.mixed(),
});

const BrandModal: React.FC<BrandModalProps> = ({ open, handleClose, editingBrand, categories, getData }) => {
  const [initialValues, setInitialValues] = useState<BrandForm>({
    name: '',
    description: '',
    category_id: 0,
    file: null,
  });

  useEffect(() => {
    if (open && editingBrand) {
      setInitialValues({
        name: editingBrand.name || '',
        description: editingBrand.description || '',
        category_id: editingBrand.category_id || 0,
        file: null,
      });
    } else {
      setInitialValues({ name: '', description: '', category_id: 0, file: null });
    }
  }, [open, editingBrand]);

  const onSubmit = async (values: BrandForm) => {
    console.log('Form values:', values);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('category_id', values.category_id.toString());
      if (values.file) {
        formData.append('file', values.file);
      }
      if (editingBrand?.id) {
        await brand.put(editingBrand.id, formData);
      } else {
        await brand.post(formData);
      }
      handleClose();
      getData();
      message.success('Brand saved successfully!');
    } catch (error) {
      console.error('Error saving brand:', error);
      message.error('Error saving brand.');
    }
  };

  return (
    <Modal
      title={editingBrand ? 'Edit Brand' : 'Create Brand'}
      visible={open}
      onCancel={handleClose}
      footer={null}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={brandValidationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            <Form.Item label="Name" name="name">
              <Field name="name">
                {({ field }) => <Input {...field} />}
              </Field>
              <div style={{ color: 'red' }}>
                <ErrorMessage name="name" component="span" />
              </div>
            </Form.Item>

            <Form.Item label="Description" name="description">
              <Field name="description">
                {({ field }) => <Input.TextArea {...field} />}
              </Field>
              <div style={{ color: 'red' }}>
                <ErrorMessage name="description" component="span" />
              </div>
            </Form.Item>

            <Form.Item label="Category">
              <Field name="category_id">
                {({ field }) => (
                  <Select {...field}>
                    {categories.map((category: { id: Key | null | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                      <Option key={category.id} value={category.id}>
                        {category.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Field>
              <div style={{ color: 'red' }}>
                <ErrorMessage name="category_id" component="span" />
              </div>
            </Form.Item>

            <Form.Item label="Upload File">
              <Upload
                beforeUpload={(file) => {
                  setFieldValue('file', file);
                  return false; 
                }}
                showUploadList={false}
              >
                <Button>Click to Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                {editingBrand ? 'Update' : 'Create'}
              </Button>
              <Button onClick={handleClose} style={{ marginLeft: 8 }}>
                Cancel
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default BrandModal;
