"use client";
import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Layout,
  Menu,
  MenuProps,
  Space,
  theme,
} from "antd";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import AccountApi from "@/api/accountapis";

type GroupType = {
  id: Number;
  name: string;
  kind: Number;
};

type ProfileType = {
  id: Number;
  kind: Number;
  username: string;
  phone: string;
  email: string;
  fullName: string;
  group: GroupType;
  isSuperAdmin: boolean;
};
const { Header } = Layout;
export default function MainLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const { getProfileApi } = AccountApi();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { data: accountProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      getProfileApi().then((res) => {
        return res.data as ProfileType;
      }),
  });
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className="flex flex-row gap-3">
          <LogoutOutlined />
          <p
            onClick={() => {
              localStorage.removeItem("tokenMeta");
              localStorage.removeItem("user_id");
              router.push("/");
            }}
          >
            Logout
          </p>
        </div>
      ),
    },
  ];
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const currentPath = segments[1];
  return (
    <Layout style={{ height: "100vh" }}>
      <Layout.Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ width: "max-content", flex: "0 0 max-content" }}
        width={300}
        className="Hello"
      >
        {" "}
        <div className="demo-logo-vertical h-[150px] flex justify-center items-center p-5 ">
          <div className=" bg-white p-5 rounded-lg">
            <Image
              src="/vercel.svg"
              alt="logo"
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={(e) => router.push(`/${e.key}`)}
          defaultSelectedKeys={[currentPath]}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: "Account Management",
              children: [
                {
                  key: "admin",
                  label: "Admin",
                },
                {
                  key: "career",
                  label: "Career",
                },
              ],
            },
            {
              key: "2",
              icon: <VideoCameraOutlined />,
              label: "System",
              children: [
                {
                  key: "role",
                  label: "Role",
                },
                {
                  key: "serverprovider",
                  label: "Server Provider",
                },
              ],
            },
          ]}
        />
      </Layout.Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            paddingRight: "30px",
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <Avatar
                  size="small"
                  src="https://i.pinimg.com/236x/7d/7e/b6/7d7eb65a1e0f84780188d62c7b7eef0d.jpg"
                />
                <p>{accountProfile?.username}</p>
              </Space>
            </a>
          </Dropdown>
        </Header>
        {children}
      </Layout>
    </Layout>
  );
}
