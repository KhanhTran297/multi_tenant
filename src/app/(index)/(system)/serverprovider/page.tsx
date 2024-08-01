"use client";
import SearchBar from "@/components/SearchBar";
import {
  Button,
  message,
  Popconfirm,
  PopconfirmProps,
  Space,
  Table,
  TableProps,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SeverProviderApis from "@/api/serverproviderapis";
const listSearchItems = [
  {
    name: "name",
    placeholder: "Name",
    type: "input",
  },
  {
    name: "driverClassname",
    placeholder: "Driver Classname",
    type: "input",
  },
];
interface SeverProviderDataType {
  id: number;
  name: string;
  url: string;
  maxTenant: number;
  jdbcUrl: string;
  rootUser: string;
  rootPassword: string;
  driverClassName: string;
}
const { getListServerProviderApi, deleteServerProviderApi } =
  SeverProviderApis();
export default function SeverProviderPage({
  searchParams,
}: {
  searchParams: { name: string; driverClassname: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: listServerProvider, isLoading } = useQuery({
    queryKey: ["listServerProvider", searchParams],
    queryFn: () =>
      getListServerProviderApi(searchParams).then((res) => {
        if (res.data.totalElements === 0) {
          return [];
        } else {
          return res.data.content as Array<SeverProviderDataType>;
        }
      }),
  });
  const { mutateAsync: deleteServerProvider } = useMutation({
    mutationKey: ["deleteServerProvider"],
    mutationFn: deleteServerProviderApi,
  });
  const confirm = (id: number) => {
    deleteServerProvider(id).then(() => {
      message.success("Delete server successfully!");
      queryClient.setQueryData(
        ["listServerProvider", searchParams],
        (oldData: Array<SeverProviderDataType> | undefined) =>
          oldData ? oldData.filter((item) => item.id !== id) : oldData
      );
    });
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    message.error("Click on No");
  };
  const columns: TableProps<SeverProviderDataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Api Url",
      key: "url",
      dataIndex: "url",

      render: (_, { url }) => {
        return <p>{url}</p>;
      },
    },
    {
      title: "Max",
      key: "maxTenant",
      dataIndex: "maxTenant",
      align: "center",
      render: (_, { maxTenant }) => {
        return <p>{maxTenant}</p>;
      },
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined
            style={{ color: "blue" }}
            className=" hover:cursor-pointer"
            onClick={() => router.push(`${pathname}/edit/${record.id}`)}
          />
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => confirm(record.id)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined
              style={{ color: "red" }}
              className="hover:cursor-pointer"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  return (
    <div className=" flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <div className=" flex flex-row">
          <SearchBar listSearchItems={listSearchItems} />
        </div>
        <div className=" flex flex-row justify-end">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push(`${pathname}/create`)}
          >
            Add new
          </Button>
        </div>
      </div>
      <div className="">
        <Table
          columns={columns}
          dataSource={listServerProvider}
          loading={isLoading}
          pagination={{}}
          scroll={{ y: 250 }}
        />
      </div>
    </div>
  );
}
