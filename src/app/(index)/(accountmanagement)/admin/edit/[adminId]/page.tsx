"use client";
import AccountApi from "@/api/accountapis";
import AutoCompleteApi from "@/api/autocomplete";
import SubmitButton from "@/components/SubmitButton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, message, Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import React from "react";
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
type GroupType = {
  id: Number;
  name: string;
  kind: Number;
};
const { getDetailAdminApi, updateAdminApi } = AccountApi();
const { GetAutoCompleteApi } = AutoCompleteApi();
const EditAccountPage = ({ params }: { params: { adminId: string } }) => {
  const { data: GroupItems } = useQuery({
    queryKey: ["auto-complete-group"],
    queryFn: async () => {
      const res = await GetAutoCompleteApi({ kind: 1, page: 0, size: 20 });
      return res.data.content.map((item: GroupType) => ({
        value: item.id,
        label: item.name,
      })) as { value: Number; label: string }[];
    },
  });
  const { data: detailAdmin } = useQuery({
    queryKey: ["get-detail-admin", params.adminId],
    queryFn: () =>
      getDetailAdminApi(params.adminId).then((res) => {
        form.setFieldsValue({
          username: res.data.username,
          fullname: res.data.fullName,
          email: res.data.email,
          groupId: res.data.group.id,
          phone: res.data.phone,
          status: res.data.status,
        });
        return res.data;
      }),
  });
  const { mutateAsync: updateAdmin, isPending } = useMutation({
    mutationKey: ["update-admin"],
    mutationFn: updateAdminApi,
  });
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    const data = {
      email: values.email,
      fullName: values.fullname,
      groupId: values.groupId,
      phone: values.phone,
      id: params.adminId,
      status: values.status,
      avatarPath: "",
    };
    updateAdmin(data).then((res) => {
      message.success("Edit admin successfully!");
      form.resetFields();
    });
  };
  const onClear = () => {
    form.resetFields();
  };
  return (
    <div className=" flex justify-center items-center content-center">
      <Form
        form={form}
        name="createnewadmin"
        onFinish={onFinish}
        layout="horizontal"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "50%",
        }}
      >
        <div className="flex flex-row justify-between gap-3">
          <Form.Item
            label="Username"
            name="username"
            layout="vertical"
            style={{ width: "50%" }}
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" disabled></Input>
          </Form.Item>
          <Form.Item
            label="Fullname"
            name="fullname"
            layout="vertical"
            style={{ width: "50%" }}
            rules={[{ required: true, message: "Please input your fullname!" }]}
          >
            <Input placeholder="Fullname"></Input>
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
            label="Group"
            name="groupId"
            layout="vertical"
            style={{ width: "50%" }}
            rules={[{ required: true, message: "Please choose your group!" }]}
          >
            <Select placeholder="Group" options={GroupItems}></Select>
          </Form.Item>
        </div>
        <div className="flex flex-row justify-between gap-3">
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
            rules={[{ required: true, message: "Please input your password!" }]}
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
          <SubmitButton form={form} isLoading={isPending}>
            Edit
          </SubmitButton>
        </div>
      </Form>
    </div>
  );
};

export default EditAccountPage;
