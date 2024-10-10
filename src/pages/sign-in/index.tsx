
import { Form, Input, Button, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { auth } from "@service"; 
import { SignIn } from "@types"; 
import erp from "../../assets/images/erp.jpg";
import { useState } from "react";


const Index = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues: SignIn = {
    phone_number: '',
    password: ''
  };

  const handleSubmit = async (values:SignIn) => {
    console.log(values);
    
    setLoading(true);
    try {
     
      const res:any = await auth.sign_in(values);
      const access_token:string = res.data?.data?.tokens?.access_token; 

      if (access_token) {
        localStorage.setItem("access_token", access_token);
        navigate("./admin-layout");
      } else {
        notification.error({ message: "Authentication failed", description: "Access token not found" });
      }
    } catch (error) {
      notification.error({ message: "Error", description: "Failed to sign in. Please check your credentials." });
      console.error("error:", error);
    } finally {
      setLoading(false);
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
                <Button
                  style={{ backgroundColor: "#ffa107", fontSize: "16px", padding: "25px" }}
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                >
                  Sign In
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
