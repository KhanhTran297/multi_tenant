"use client";
import { Button, Card, Form, Input, message, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import SubmitButton from "@/components/SubmitButton";
import SeverProviderApis from "@/api/serverproviderapis";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
const { createServerProviderApi } = SeverProviderApis();
export default function NewServerProviderPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { mutateAsync: createServerProvider, isPending } = useMutation({
    mutationKey: ["create-server-provider"],
    mutationFn: createServerProviderApi,
  });
  const handleJoinJdbcUrl = (host: string, port: string, driver: string) => {
    const shortternDriver = driver.split(".");
    return `jdbc:${shortternDriver[1]}://${host}:${port}/`;
  };
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
    };

    createServerProvider(data)
      .then((res) => {
        message.success("Create new server provider successfully!");
        router.push("/serverprovider");
      })
      .catch((err) => {
        message.error(err.response.data.message);
      });
  };
  const onClear = () => {
    router.push("/serverprovider");
  };
  return (
    <div className=" flex justify-center items-center content-center ">
      <Form
        form={form}
        name="createnewserverprovider"
        onFinish={onFinish}
        layout="horizontal"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "50%",
        }}
        initialValues={{
          driverClassName: "org.postgresql.Driver",
        }}
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
          <Space direction="vertical" size={26} style={{ width: "100%" }}>
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
                rules={[{ required: true, message: "Please input root user!" }]}
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
                rules={[{ required: true, message: "Please input root user!" }]}
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
            onClick={onClear}
            icon={<DeleteOutlined style={{ color: "red" }} />}
          >
            Cancel
          </Button>

          <SubmitButton form={form} isLoading={isPending}>
            Create
          </SubmitButton>
        </div>
      </Form>
    </div>
  );
}
