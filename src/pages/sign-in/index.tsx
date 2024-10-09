import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { auth } from "@service";
import { ToastContainer } from "react-toastify";
import { SignIn } from "@types";
import erp from "../../assets/images/erp.jpg"

const Index = () => {
  const [form] = Form.useForm<SignIn>(); 
  const navigate = useNavigate();

  const initialValues: SignIn = {
    phone_number: '',
    password: ''
  };

  const handleSubmit = async (values: SignIn) => { 
    console.log(values, 'values')
    try {
      const resp = await auth.sign_in(values);
      const access_token = resp?.data?.data?.tokens.access_token;
      localStorage.setItem("access_token", access_token);
      navigate("./admin-layout");
    } catch (error) {
      console.error("error:", error);
    }
  };

  return (
    <>
      <div className="w-full h-[100vh] flex justify-center items-center">
        <div className="w-[50%] h-[100%] hidden md:block">
          <img src={erp} alt="erp" className="h-[100%] object-cover" />
        </div>
        <div className="w-[70%] flex flex-col justify-center items-center md:w-[50%]">
          <div className="w-full md:w-[60%]">
            <ToastContainer />
            <h1 style={{ textAlign: "center", fontSize: "30px", fontWeight: "bold", padding: "10px 10px" }}>Sign-In</h1>
            <Form
              form={form}
              initialValues={initialValues}
              onFinish={handleSubmit}
              layout="vertical"
            >
              <Form.Item
                name="phone_number"
                label={<span style={{ fontSize: "14px" }}>Phone Number</span>}
                rules={[{ required: true, message: "Please input your phone number!" }]}
              >
                <Input placeholder="Enter your phone number" style={{ padding: "7px 15px", fontSize: "16px" }} />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span style={{ fontSize: "14px" }}>Password</span>}
                rules={[{ required: true, message: "Please input your password!" }]}
              >
                <Input.Password placeholder="Enter your password" style={{ padding: "7px 15px", fontSize: "16px" }} />
              </Form.Item>

              <Form.Item>
                <Button style={{ backgroundColor: "#ffa107", fontSize: "16px", padding: "25px" }} type="primary" htmlType="submit" block>
                  Save
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
