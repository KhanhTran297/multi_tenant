"use client";
import BreadCrumbView from "@/components/BreadCrumbView";
import { theme } from "antd";
import { Content } from "antd/es/layout/layout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("tokenMeta") === null) {
      router.push("/");
    }
  }, []);
  return (
    // <div>
    //   {/* <Breadcrumb items={breadItem}/> */}
    //   <BreadCrumbView />
    //   {children}
    // </div>
    <div className=" max-h-full h-full overflow-y-scroll scroll-smooth ">
      <Content
        style={{
          margin: "0px 16px 24px 16px",
          padding: 24,
          minHeight: 500,
          maxHeight: "max-content",
          height: "auto",
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          // overflowY: "scroll",
        }}
      >
        {children}
      </Content>
    </div>
  );
}
