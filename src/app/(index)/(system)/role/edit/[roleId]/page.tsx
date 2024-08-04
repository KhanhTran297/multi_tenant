"use client";
import RoleApis from "@/api/roleapis";
import SubmitButton from "@/components/SubmitButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Row,
  Space,
  Spin,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import PermissionsApis from "@/api/permissions";
import { useRouter } from "next/navigation";
type PermissionDataType = {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  status: number;
  id: number;
  name: string;
  action: string;
  showMenu: boolean;
  description: string;
  nameGroup: string;
  permissionCode: string;
  kind: number;
};
interface RoleDataType {
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  status: number;
  id: number;
  name: string;
  description: string;
  kind: number;
  isSystemRole: boolean;
  permissions: PermissionDataType[];
}
const { getDetailRoleApi, editRoleApis } = RoleApis();
const { getListpermissionsApi } = PermissionsApis();
export default function EditRolePage({
  params,
}: {
  params: { roleId: string };
}) {
  const [form] = Form.useForm();
  const router = useRouter();
  const [groupPermission, setGroupPermission] = useState<{
    groupPermissions: Array<number>;
  }>({ groupPermissions: [] });
  const queryClient = useQueryClient();
  const { data: listAllPermissions } = useQuery({
    queryKey: ["getListPermissions"],
    queryFn: () =>
      getListpermissionsApi({}).then((res) => {
        if (res.data.totalElements === 0) {
          return [];
        } else {
          const groupAllPermissions = res.data.content.reduce(
            (acc: any, permission: PermissionDataType) => {
              if (!acc[permission.nameGroup]) {
                acc[permission.nameGroup] = [];
              }
              acc[permission.nameGroup].push(permission);
              return acc;
            },
            {}
          );

          return groupAllPermissions;
        }
      }),
  });
  const { data: DetailRole, isLoading } = useQuery({
    queryKey: ["getDetailRole", params.roleId],
    queryFn: () =>
      getDetailRoleApi(parseInt(params.roleId)).then(async (res) => {
        const listPermission = await res.data.permissions.map(
          (item: PermissionDataType) => {
            return item.id;
          }
        );
        const data = {
          name: res.data.name,
          description: res.data.description,
          groupPermissions: listPermission,
        };
        return data;
      }),
  });
  const { mutateAsync: editRole, isPending } = useMutation({
    mutationKey: ["edit-role", params.roleId],
    mutationFn: editRoleApis,
  });

  const onFinish = (values: any) => {
    const data = {
      id: parseInt(params.roleId),
      name: values.name, // Optional
      description: values.description, // Optional
      permissions: values.groupPermissions,
    };

    editRole(data)
      .then((res) => {
        queryClient.setQueryData(
          ["getDetailRole", params.roleId],
          (oldData: any) => {
            return {
              ...oldData,
              name: data.name,
              description: data.description,
              groupPermissions: [...data.permissions],
            };
          }
        );
        message.success("edit permission successfully!");
        // form.resetFields();
        router.push("/role");
      })
      .catch((err) => {
        message.error(err.response.data.message);
      });
  };
  const onClear = () => {
    form.resetFields();
  };

  return (
    <div className=" flex justify-center items-center content-center h-full ">
      {isLoading ? (
        <Spin />
      ) : (
        <Form
          form={form}
          name="editrole"
          onFinish={onFinish}
          layout="horizontal"
          style={{
            display: "grid",
            gridTemplateColumns: "40% 60%",
            height: "100%",
            width: "100%",
          }}
          initialValues={DetailRole}
        >
          <div className="flex flex-col gap-3">
            <Form.Item
              label="Name"
              name="name"
              layout="vertical"
              style={{ width: "80%" }}
              rules={[{ required: true, message: "Please input server name!" }]}
            >
              <Input placeholder="Name"></Input>
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              layout="vertical"
              style={{ width: "80%", flex: 1 }}
              rules={[{ required: true, message: "Please input server name!" }]}
            >
              <Input.TextArea
                placeholder="decription"
                rows={4}
              ></Input.TextArea>
            </Form.Item>
          </div>

          <div className="flex flex-col gap-3">
            <Form.Item name="groupPermissions" className="Hello">
              <Checkbox.Group
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                {listAllPermissions &&
                  Object.keys(listAllPermissions).map((group: any, index) => {
                    return (
                      <Card key={index} title={group} style={{ width: "100%" }}>
                        <Space direction="vertical" style={{ width: "100%" }}>
                          {listAllPermissions[group].map(
                            (permission: PermissionDataType) => {
                              return (
                                <Checkbox
                                  key={permission.permissionCode}
                                  value={permission.id}
                                >
                                  {permission.name}
                                </Checkbox>
                              );
                            }
                          )}
                        </Space>
                      </Card>
                    );
                  })}
              </Checkbox.Group>
            </Form.Item>

            <div className="flex flex-row justify-end gap-4  ">
              <Button
                type="default"
                danger
                onClick={() => router.push("/role")}
                icon={<DeleteOutlined style={{ color: "red" }} />}
              >
                Cancel
              </Button>

              <SubmitButton form={form} isLoading={isPending}>
                Edit
              </SubmitButton>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
}
