"use client";
import DbConfigApis from "@/api/dbcongif";
import SeverProviderApis from "@/api/serverproviderapis";
import SubmitButton from "@/components/SubmitButton";
import { CheckOutlined, CloseOutlined, FormOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button, Form, Input, message, Select, Spin, Switch } from "antd";

const { getDetailDbConfigApi, updateDbConfigApi } = DbConfigApis();
const { getListServerProviderApi } = SeverProviderApis();
export default function EditDbconfigPage({
  params,
}: {
  params: { dbconfigid: string };
}) {
  const [form] = Form.useForm();
  const handleJoinJdbcUrl = (host: string, port: string, driver: string) => {
    const shortternDriver = driver.split(".");
    return `jdbc:${shortternDriver[1]}://${host}:${port}/`;
  };
  const handleExtractJdbcUrl = async (jdbcUrl: string) => {
    const host = jdbcUrl.split("//")[1].split(":")[0];
    const port = jdbcUrl.split(":")[3].split("/")[0];
    return { host, port };
  };
  const { data: listServerProvider, isLoading: LoadingServerOption } = useQuery(
    {
      queryKey: ["listSeverProvider", params.dbconfigid],
      queryFn: () =>
        getListServerProviderApi({ page: 0, size: 20 }).then((res) => {
          return res.data.content.map((item: any) => ({
            value: item.id,
            label: item.name,
          })) as { value: Number; label: string }[];
        }),
    }
  );
  const { data: detailDbconfig, isLoading } = useQuery({
    queryKey: ["get-dbconfig", params.dbconfigid],
    queryFn: () =>
      getDetailDbConfigApi(params.dbconfigid).then(async (res) => {
        const { host, port } = await handleExtractJdbcUrl(
          res.data.serverProvider.jdbcUrl
        );
        // form.setFieldsValue({
        //     serverProviderId: res.data.serverProviderId,
        //     host: host,
        //     port: port,
        //     databasename: res.data.name,
        //     maxConnection: res.data.maxConnection,
        //     rootUsername: res.data.serverProvider.rootUser,
        //     rootPassword: res.data.serverProvider.rootPassword,
        //     driverClassName: res.data.serverProvider.driverClassName,
        //     initialize: res.data.initialize
        // })
        return {
          id: res.data.id,
          serverProviderId: res.data.serverProvider.id,
          host: host,
          port: port,
          databasename: res.data.name,
          maxConnection: res.data.maxConnection,
          rootUsername: res.data.serverProvider.rootUser,
          rootPassword: res.data.serverProvider.rootPassword,
          driverClassName: res.data.serverProvider.driverClassName,
          initialize: res.data.initialize,
        };
      }),
  });
  const { mutateAsync: updateDbConfig, isPending } = useMutation({
    mutationKey: ["update-dbconfig", params.dbconfigid],
    mutationFn: updateDbConfigApi,
  });
  const onFinish = (values: any) => {
    const data = {
      id: detailDbconfig?.id,
      initialize: values.initialize,
      maxConnection: values.maxConnection,
    };
    console.log("values", data);
    // updateDbConfig(data).then((res) => {
    //   message.success("Create new admin successfully!");
    //   form.resetFields();
    // });
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
          name="createnewadmin"
          onFinish={onFinish}
          layout="horizontal"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            width: "50%",
          }}
          initialValues={detailDbconfig}
        >
          <div className="flex flex-row justify-between gap-3 ">
            <Form.Item
              name="serverProviderId"
              label="Server Provider"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[
                { required: true, message: "Please choose serverprovider!" },
              ]}
            >
              <Select
                placeholder="sever provider"
                options={listServerProvider}
                allowClear
                disabled
                // defaultValue={detailDbconfig?.severProviderId}
              ></Select>
            </Form.Item>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <Form.Item
              label="Host"
              name="host"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[
                {
                  required: true,
                  message: "Please input host!",
                },
              ]}
            >
              <Input placeholder="host" disabled />
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
              <Input placeholder="port" disabled />
            </Form.Item>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <Form.Item
              label="Database"
              name="databasename"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[{ required: true, message: "Please input database!" }]}
            >
              <Input placeholder="database" disabled />
            </Form.Item>
            <Form.Item
              label="Max Connection"
              name="maxConnection"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[
                { required: true, message: "Please input connection!" },
                {
                  pattern: /^[0-9]*$/,
                  message: "The amount of connection must be numeric!",
                },
              ]}
            >
              <Input placeholder="Max connection" />
            </Form.Item>
          </div>
          <div className="flex flex-row justify-between gap-3 mb-10">
            <Form.Item
              label="Username"
              name="rootUsername"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[
                { required: true, message: "Please input root username!" },
              ]}
            >
              <Input placeholder="root username" disabled />
            </Form.Item>
            <Form.Item
              label="Password"
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
              <Input placeholder="root password" disabled />
            </Form.Item>
          </div>
          <div className="flex flex-row justify-between gap-3 mb-10">
            <Form.Item
              label="Driver ClassName"
              name="driverClassName"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[
                { required: true, message: "Please input driver classname!" },
              ]}
            >
              <Input placeholder="driver classname" disabled />
            </Form.Item>
            <Form.Item
              label="Initialize"
              name="initialize"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[
                {
                  required: true,
                  message: "Please input root password!",
                },
              ]}
            >
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked
              />
            </Form.Item>
          </div>
          <div className="flex flex-row justify-end gap-4  ">
            <Button
              type="default"
              danger
              onClick={onClear}
              icon={<DeleteOutlined style={{ color: "red" }} />}
            >
              Cancel
            </Button>

            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              icon={<FormOutlined />}
            >
              Update
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}
