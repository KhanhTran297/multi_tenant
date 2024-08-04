"use client";

import SeverProviderApis from "@/api/serverproviderapis";
import SubmitButton from "@/components/SubmitButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Form, Input, message, Space, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
const { editServerProviderApi, getDetailServerProviderApi } =
  SeverProviderApis();
type SeverProviderType = {
  id: number;
  name: string;
  url: string;
  maxTenant: number;
  rootUser: string;
  rootPassword: string;
  jdbcurl: string;
  driverClassName: string;
};
export default function EditServerProviderPage({
  params,
}: {
  params: { serverId: string };
}) {
  const [form] = Form.useForm();
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleJoinJdbcUrl = (host: string, port: string, driver: string) => {
    const shortternDriver = driver.split(".");
    return `jdbc:${shortternDriver[1]}://${host}:${port}/`;
  };
  const handleExtractJdbcUrl = async (jdbcUrl: string) => {
    const host = jdbcUrl.split("//")[1].split(":")[0];
    const port = jdbcUrl.split(":")[3].split("/")[0];
    return { host, port };
  };
  const { data: detailSeverProvider, isLoading } = useQuery({
    queryKey: ["getDetailServerProvider", params.serverId],
    queryFn: () =>
      getDetailServerProviderApi(parseInt(params.serverId)).then(
        async (res) => {
          const { host, port } = await handleExtractJdbcUrl(res.data.jdbcUrl);
          // form.setFieldsValue({
          //   ...res.data,
          //   host,
          //   port,
          // });
          const initialData = {
            ...res.data,
            host,
            port,
            driverClassName: "org.postgresql.Driver",
          };

          return initialData;
        }
      ),
  });
  const { mutateAsync: editServerProvider, isPending } = useMutation({
    mutationKey: ["edit-server-provider", params.serverId],
    mutationFn: editServerProviderApi,
  });
  const onFinish = (values: any) => {
    const data = {
      name: values.name,
      url: values.url,
      maxTenant: values.maxTenant,
      rootPassword: values.rootPassword,
      rootUser: values.rootUser,
      jdbcUrl: handleJoinJdbcUrl(
        values.host,
        values.port.toString(),
        values.driverClassName
      ),
      driverClassName: values.driverClassName,
      id: parseInt(params.serverId),
    };
    editServerProvider(data)
      .then((res) => {
        queryClient.setQueryData(
          ["getDetailServerProvider", params.serverId],
          (oldData: any) => {
            return {
              ...oldData,
              name: data.name,
              url: data.url,
              maxTenant: data.maxTenant,
              rootPassword: data.rootPassword,
              rootUser: data.rootUser,
              jdbcUrl: data.jdbcUrl,
              driverClassName: data.driverClassName,
            };
          }
        );
        message.success("Edit server provider successfully!");
        router.push("/serverprovider");
        // form.resetFields();
      })
      .catch((err) => {
        message.error(err.response.data.message);
      });
  };
  const onClear = () => {
    form.resetFields();
  };
  return (
    <div className=" flex justify-center items-center content-center ">
      {isLoading ? (
        <Spin />
      ) : (
        <Form
          form={form}
          name="editserverprovider"
          onFinish={onFinish}
          layout="horizontal"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            width: "50%",
          }}
          initialValues={detailSeverProvider}
        >
          <div className="flex flex-row justify-between gap-3">
            <Form.Item
              label="Name"
              name="name"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[{ required: true, message: "Please input server name!" }]}
            >
              <Input placeholder="Name"></Input>
            </Form.Item>
          </div>
          <Card title="Server Information" style={{ width: "100%" }}>
            <div className="flex flex-row justify-between gap-3">
              <Form.Item
                label="Api Url"
                name="url"
                layout="vertical"
                style={{ width: "50%" }}
                rules={[
                  {
                    required: true,
                    message: "Please input server api url!",
                  },
                ]}
              >
                <Input placeholder="Api Url" />
              </Form.Item>
              <Form.Item
                label="Max Tenant"
                name="maxTenant"
                layout="vertical"
                style={{ width: "50%" }}
                rules={[
                  { required: true, message: "Please input max tenant!" },
                  {
                    pattern: /^[0-9]*$/,
                    message: "The number of tenant must be numeric!",
                  },
                ]}
              >
                <Input placeholder="Max Tenant"></Input>
              </Form.Item>
            </div>
          </Card>
          <Card title="Mysql Information" style={{ width: "100%" }}>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <div className="flex flex-row justify-between gap-3 ">
                <Form.Item
                  label="Mysql Host"
                  name="host"
                  layout="vertical"
                  style={{ width: "50%" }}
                  rules={[
                    { required: true, message: "Please input Mysql host!" },
                  ]}
                >
                  <Input placeholder="host" />
                </Form.Item>
                <Form.Item
                  label="Port"
                  name="port"
                  layout="vertical"
                  style={{ width: "50%" }}
                  rules={[
                    { required: true, message: "Please input port!" },
                    {
                      pattern: /^[0-9]*$/,
                      message: "The port must be numeric!",
                    },
                  ]}
                >
                  <Input placeholder="port" />
                </Form.Item>
              </div>
              <div className="flex flex-row justify-between gap-3 ">
                <Form.Item
                  label="MySql Root User"
                  name="rootUser"
                  layout="vertical"
                  style={{ width: "50%" }}
                  rules={[
                    { required: true, message: "Please input root user!" },
                  ]}
                >
                  <Input placeholder="root user" />
                </Form.Item>
                <Form.Item
                  label="Root Password"
                  name="rootPassword"
                  layout="vertical"
                  style={{ width: "50%" }}
                  rules={[
                    {
                      required: true,
                      message: "Please input root password!",
                    },
                  ]}
                >
                  <Input.Password placeholder="root password" />
                </Form.Item>
              </div>
              <div className="flex flex-row justify-between gap-3 ">
                <Form.Item
                  label="Driver Classname"
                  name="driverClassName"
                  layout="vertical"
                  style={{ width: "50%" }}
                  rules={[
                    { required: true, message: "Please input root user!" },
                  ]}
                >
                  <Input placeholder="driverClassName" disabled />
                </Form.Item>
              </div>
            </Space>
          </Card>

          <div className="flex flex-row justify-end gap-4  ">
            <Button
              type="default"
              danger
              onClick={() => {
                router.push("/serverprovider");
              }}
              icon={<DeleteOutlined style={{ color: "red" }} />}
            >
              Cancel
            </Button>

            <SubmitButton form={form} isLoading={isPending}>
              Edit
            </SubmitButton>
          </div>
        </Form>
      )}
    </div>
  );
}
