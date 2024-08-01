"use client";
import {
  Button,
  Image,
  message,
  Popconfirm,
  Space,
  Table,
  TableProps,
  Tag,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { PopconfirmProps } from "antd";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AccountApi from "@/api/accountapis";
type GroupType = {
  id: Number;
  name: string;
  kind: Number;
};

interface DataType {
  id: number;
  kind: number;
  username: string;
  phone: string;
  email: string;
  fullName: string;
  group: GroupType;
  isSuperAdmin: boolean;
  created_date?: string;
  status?: number;
  key?: number;
}
const listSearchItems = [
  {
    name: "username",
    placeholder: "Username",
    type: "input",
  },
  {
    name: "fullName",
    placeholder: "Fullname",
    type: "input",
  },
  {
    name: "status",
    placeholder: "Status",
    type: "select",
    options: [
      {
        value: 0,
        label: "Inactive",
      },
      {
        value: 1,
        label: "Active",
      },
    ],
  },
];

export default function AdminPage({
  searchParams,
}: {
  searchParams: {
    username: string | undefined;
    fullName: string | undefined;
    status: string | undefined;
  };
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const { listAccountApi, deleteAdminApi } = AccountApi();

  const { data: listAccount, isLoading } = useQuery({
    queryKey: ["listAccount", searchParams],
    queryFn: () =>
      listAccountApi(searchParams).then((res) => {
        if (res.data.totalElements === 0) {
          return [];
        } else {
          const data = res.data.content.map((item: DataType) => ({
            ...item,
            key: item.id,
          })) as Array<DataType>;
          return data;
        }
      }),
  });
  const { mutateAsync: deleteAdmin } = useMutation({
    mutationKey: ["delete-admin"],
    mutationFn: deleteAdminApi,
  });
  const confirm = (id: number) => {
    deleteAdmin(id).then(() => {
      message.success("Delete admin successfully!");

      queryClient.setQueryData(
        ["listAccount", searchParams],
        (oldData: Array<DataType> | undefined) =>
          oldData ? oldData.filter((item) => item.id !== id) : oldData
      );
    });
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    message.error("Click on No");
  };
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      align: "center",
      render(value, record, index) {
        return (
          <Space size="middle">
            <Image
              src="https://i.pinimg.com/236x/88/d0/c6/88d0c6df5a9ce8a683a397cce2e5ab94.jpg"
              width={50}
              alt="avatar"
              style={{ borderRadius: "50%" }}
            />
          </Space>
        );
      },
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Fullname",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      align: "center",
      render: (_, { phone }) => {
        return <p>{phone}</p>;
      },
    },
    {
      title: "Status",
      key: "stauts",
      dataIndex: "status",
      align: "center",
      render: (_, { status }) => {
        let color = status === 0 ? "gray" : "green";
        let text = status === 0 ? "Inactive" : "Active";
        return <Tag color={color}>{text}</Tag>;
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
          dataSource={listAccount}
          loading={isLoading}
          pagination={{}}
          scroll={{ y: 250 }}
        />
      </div>
    </div>
  );
}
