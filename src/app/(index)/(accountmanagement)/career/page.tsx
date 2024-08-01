"use client";
import CareerApis from "@/api/careerapis";
import SearchBar from "@/components/SearchBar";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  message,
  Popconfirm,
  PopconfirmProps,
  Space,
  Table,
  TableProps,
  Tag,
} from "antd";
import Image from "next/image";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
const listSearchItems = [
  {
    name: "careerName",
    placeholder: "career Name",
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
interface CareerDataType {
  accountId: number;
  serverId: number;
  careerName: string;
  logoPath: string;
  bannerPath: string;
  hotline: string;
  email: string;
  fullName: string;
  username: string;
  phone: string;
  careerTenantId: string;
  ternantId: string;
  status?: number;
  key?: number;
}
const { getListCareerApi } = CareerApis();
export default function CareerPage({
  searchParams,
}: {
  searchParams: { careerName: string; status: number };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const confirm = (id: number) => {
    console.log("confirm");
  };
  const cancel: PopconfirmProps["onCancel"] = (e) => {
    message.error("Click on No");
  };
  const checkValidUrlAvatar = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  };
  const columns: TableProps<CareerDataType>["columns"] = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      align: "center",
      render(value, record, index) {
        return (
          <Space size="middle">
            <Image
              src={
                checkValidUrlAvatar(record.logoPath)
                  ? record.logoPath
                  : "https://i.pinimg.com/236x/88/d0/c6/88d0c6df5a9ce8a683a397cce2e5ab94.jpg"
              }
              width={50}
              height={50}
              alt="avatar"
              style={{ borderRadius: "50%" }}
            />
          </Space>
        );
      },
    },
    {
      title: "Career Name",
      dataIndex: "careerName",
      key: "careerName",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Leader",
      dataIndex: "fullName",
      key: "fullName",
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
          <ApartmentOutlined
            style={{ color: "blue" }}
            className=" hover:cursor-pointer"
            onClick={() =>
              router.push(`${pathname}/dbconfig/${record.accountId}`)
            }
          />
          <EditOutlined
            style={{ color: "blue" }}
            className=" hover:cursor-pointer"
            onClick={() => router.push(`${pathname}/edit/${record.accountId}`)}
          />
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => confirm(record.accountId)}
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
  const { data: listCareer, isLoading } = useQuery({
    queryKey: ["listCareer", searchParams],
    queryFn: () =>
      getListCareerApi(searchParams).then((res) => {
        if (res.data.totalElements === 0) {
          return [];
        } else {
          const data = res.data.content.map((item: any) => {
            return {
              accountId: item.accountDto.id,
              serverId: item.serverProviderDto.id,
              careerName: item.careerName,
              logoPath: item.logoPath,
              bannerPath: item.bannerPath,
              hotline: item.hotline,
              email: item.accountDto.email,
              fullName: item.accountDto.fullName,
              username: item.accountDto.username,
              phone: item.accountDto.phone,
              careerTenantId: item.careerTenantId,
              ternantId: item.ternantId,
              status: item.status,
              key: item.accountDto.id,
            };
          });
          return data;
        }
      }),
  });
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
          dataSource={listCareer}
          loading={isLoading}
          pagination={{}}
          scroll={{ y: 250 }}
        />
      </div>
    </div>
  );
}
