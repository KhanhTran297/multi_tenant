"use client";

import CareerApis from "@/api/careerapis";
import SubmitButton from "@/components/SubmitButton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, message, Select, Spin } from "antd";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { useState } from "react";

const StatusItems = [
  {
    value: 0,
    label: "Inactive",
  },
  {
    value: 1,
    label: "Active",
  },
];
const { getDetailCareerApi, editCareerApi } = CareerApis();
export default function EditCareerPage({
  params,
}: {
  params: { careerid: string };
}) {
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({});
  const { data: detailCareer, isLoading } = useQuery({
    queryKey: ["getCareerDetail", params.careerid],
    queryFn: () =>
      getDetailCareerApi(Number(params.careerid)).then((res) => {
        console.log(res.data);
        const data = {
          careerName: res.data.careerName,
          fullName: res.data.accountDto.fullName,
          hotline: res.data.hotline,
          id: res.data.accountDto.id,
          lang: res.data.lang,
          logoPath: res.data.logoPath,
          phone: res.data.accountDto.phone,
          settings: res.data.setting,
          status: res.data.status,
          tenantId: res.data.tenantId,
          email: res.data.accountDto.email,
          username: res.data.accountDto.username,
        };
        setInitialValues(data);
        return data;
      }),
  });
  const { mutateAsync: editCareer, isPending } = useMutation({
    mutationKey: ["edit-career", params.careerid],
    mutationFn: editCareerApi,
  });
  const onFinish = (values: any) => {
    console.log("values", values);
    // const data = {
    //   avatarPath: "",
    //   bannerPath: "",
    //   careerName: values.careerName,
    //   email: values.email,
    //   fullName: values.fullName,
    //   hotline: values.hotline,
    //   lang: "en",
    //   logoPath: "logoPath",
    //   password: values.password,
    //   phone: values.phone,
    //   settings: "{}",
    //   status: values.status,
    //   tenantId: values.tenantId,
    //   username: values.username,
    // };
    // editCareer(data).then((res) => {
    //   message.success("Create new career successfully!");
    //   form.resetFields();
    // });
  };
  const onClear = () => {
    form.resetFields();
  };
  return (
    <div className=" flex justify-center items-center content-center">
      {isLoading ? (
        <Spin />
      ) : (
        <Form
          form={form}
          name="createnewadmin"
          onFinish={onFinish}
          layout="horizontal"
          initialValues={detailCareer}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            width: "50%",
          }}
        >
          <div className="flex flex-row justify-between gap-3">
            <Form.Item
              label="Career Name"
              name="careerName"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[{ required: true, message: "Please input careername!" }]}
            >
              <Input placeholder="career name"></Input>
            </Form.Item>
            <Form.Item
              label="Tenant ID"
              name="tenantId"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[
                { required: true, message: "Please input your fullname!" },
              ]}
            >
              <Input placeholder="Fullname"></Input>
            </Form.Item>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <Form.Item
              label="Leader"
              name="fullName"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[
                {
                  required: true,
                  message: "Please input fullname!",
                },
              ]}
            >
              <Input placeholder="fullname" />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[
                { required: true, message: "Please input your phone!" },
                {
                  pattern: /^[0-9]*$/,
                  message: "The phone number must be numeric!",
                },
                {
                  min: 10, // Adjust the minimum length as needed
                  message: "The phone number must be at least 10 digits long!",
                },
              ]}
            >
              <Input placeholder="Phone" />
            </Form.Item>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <Form.Item
              label="Email"
              name="email"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              label="Hotline"
              name="hotline"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[
                { required: true, message: "Please input hotline!" },
                {
                  pattern: /^[0-9]*$/,
                  message: "The phone number must be numeric!",
                },
                {
                  min: 10, // Adjust the minimum length as needed
                  message:
                    "The hotline number must be at least 10 digits long!",
                },
              ]}
            >
              <Input placeholder="hotline" />
            </Form.Item>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <Form.Item
              label="Username"
              name="username"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[{ required: true, message: "Please input username!" }]}
            >
              <Input placeholder="username" disabled></Input>
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[{ required: true, message: "Please choose status!" }]}
            >
              <Select
                placeholder="status"
                allowClear
                options={StatusItems}
              ></Select>
            </Form.Item>
          </div>
          {/* <div className="flex flex-row justify-between gap-3 mb-10">
            <Form.Item
              label="Password"
              name="password"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmpassword"
              layout="vertical"
              style={{ width: "50%" }}
              dependencies={["password"]} // Dependencies to track fields to trigger validation
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="ConfirmPassword" />
            </Form.Item>
          </div> */}

          <div className="flex flex-row justify-end gap-4  ">
            <Button
              type="default"
              danger
              onClick={onClear}
              icon={<DeleteOutlined style={{ color: "red" }} />}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" icon={<FormOutlined />}>
              update
            </Button>
            {/* <SubmitButton form={form} isLoading={isPending}>
              Update
            </SubmitButton> */}
          </div>
        </Form>
      )}
    </div>
  );
}
