"use client";
import { Button, Form, Input, message } from "antd";
import type { FormProps } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import AuthApi from "@/api/authapis";
import { useRouter } from "next/navigation";
type FieldType = {
  username?: string;
  password?: string;
  grand_type?: string;
};
// type LoginType = {
//   accessToken: string;
//   refreshToken: string;
//   userKind: Number;
//   userId: Number;
// };
export default function Home() {
  const { loginApi } = AuthApi();
  const router = useRouter();
  const { mutateAsync: Login, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginApi,
  });
  const onFinish = (values: any) => {
    const data = {
      username: values.username,
      password: values.password,
      grant_type: "password",
    } as FieldType;
    Login(data)
      .then((res: any) => {
        localStorage.setItem("tokenMeta", res.access_token);
        localStorage.setItem("user_id", res.user_id);
        router.push("/admin");
        message.success("Login Success");
      })
      .catch((err) => {
        if (err.code === "ERR_BAD_REQUEST") {
          message.error("wrong username or password");
        } else {
          message.error("Login Failed");
        }
      });
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="flex justify-center items-center h-full">
      <div className=" w-[400px] h-[350px] flex flex-col items-center gap-10 shadow-2xl justify-center border-[#ccc] border-[1px] rounded-lg">
        <p className=" text-4xl font-medium ">Login</p>

        <Form
          name="normal_login"
          className="login-form"
          style={{
            maxWidth: "300px",
            width: "100%",
          }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item style={{ width: "100%" }}>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ width: "100%" }}
              loading={isPending}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
