import { Modal, Input, Button, message } from "antd"; 
import { Formik, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup"; 


const categoryValidationSchema = Yup.object().shape({
  name: Yup.string().required("Kategoriya nomi kerak"),
  parent_category_id: Yup.string().nullable(), 
});


interface SubCategoryModalProps {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (values: { name: string; parent_category_id?: string }) => Promise<void>;
  editingCategory: { id: number; name: string; parent_category_id?: string } | null;
}

export default function SubCategoryModal({
  open,
  handleClose,
  handleSubmit,
  editingCategory,
}: SubCategoryModalProps) {
  const initialValues = {
    name: editingCategory?.name || "",
    parent_category_id: editingCategory?.parent_category_id || "", 
  };

  const onSubmit = async (
    values: { name: string; parent_category_id?: string }, 
    { setSubmitting }: FormikHelpers<{ name: string; parent_category_id?: string }>
  ) => {
    try {
      await handleSubmit(values); 
      message.success("Kategoriya muvaffaqiyatli saqlandi!");
    } catch (error) {
      console.log("Yuborishda xato:", error);
      message.error("Kategoriya saqlashda xato");
    } finally {
      setSubmitting(false); 
      handleClose(); 
    }
  };

  return (
    <Modal
      title={editingCategory?.id ? "Kategoriya tahrirlash" : "Kategoriya qo'shish"}
      open={open}
      onCancel={handleClose}
      footer={null}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={categoryValidationSchema} 
        onSubmit={onSubmit}
      >
        {({ values, handleChange, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}> 
            <div>
              <label>Kategoriya nomi</label>
              <Input name="name" value={values.name} onChange={handleChange} />
              <ErrorMessage name="name">
                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
              </ErrorMessage>
            </div>
            <div>
              <label>Parent Kategoriya ID (Opsional)</label>
              <Input name="parent_category_id" value={values.parent_category_id} onChange={handleChange} />
              <ErrorMessage name="parent_category_id">
                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
              </ErrorMessage>
            </div>
            <div>
              <Button type="primary" htmlType="submit" loading={isSubmitting} block>
                {editingCategory ? "Yangilash" : "Saqlash"}
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
