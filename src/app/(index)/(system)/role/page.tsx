"use client";
import SearchBar from "@/components/SearchBar";
import { Space, Table, TableProps } from "antd";
import { EditOutlined } from "@ant-design/icons";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import RoleApis from "@/api/roleapis";
const listSearchItems = [
  {
    name: "name",
    placeholder: "Name",
    type: "input",
  },
  {
    name: "kind",
    placeholder: "Kind",
    type: "select",
    options: [
      {
        value: 1,
        label: "Admin",
      },
      {
        value: 2,
        label: "Manager",
      },
      {
        value: 3,
        label: "Company",
      },
    ],
    value: "1",
    defaultValue: "1",
  },
];
interface RoleDataType {
  id: number;
  key: number;
  name: string;
  description: string;
  kind: number;
}
const { getListRoleApi } = RoleApis();
export default function RolePage({
  searchParams,
}: {
  searchParams: { name: string; kind: number };
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const { data: listRole, isLoading } = useQuery({
    queryKey: ["listRole", searchParams],
    queryFn: () =>
      getListRoleApi(searchParams).then((res) => {
        if (res.data.totalElements === 0) {
          return [];
        } else {
          const data = res.data.content.map((item: any) => {
            return {
              id: item.id,
              key: item.id,
              name: item.name,
              description: item.description,
              kind: item.kind,
            };
          }) as Array<RoleDataType>;
          return data;
        }
      }),
  });
  const columns: TableProps<RoleDataType>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Description",
      key: "description",
      dataIndex: "description",

      render: (_, { description }) => {
        return <p>{description}</p>;
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
        </Space>
      ),
    },
  ];
  return (
    <div className=" flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <div className=" flex flex-row">
          <SearchBar
            listSearchItems={listSearchItems}
            initialValues={{ kind: 1 }}
          />
        </div>
      </div>
      <div className="">
        <Table
          columns={columns}
          dataSource={listRole}
          loading={isLoading}
          pagination={{}}
          scroll={{ y: 250 }}
        />
      </div>
    </div>
  );
}
