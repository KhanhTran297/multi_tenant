"use client";
import { Breadcrumb } from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";
import { HomeOutlined } from "@ant-design/icons";
import React, { useEffect, useMemo, useState } from "react";
type BreadItem = {
  key: number;
  title: React.ReactNode;
};

const BreadCrumbView = () => {
  const [breadItem, setBreadItem] = useState<Array<BreadItem>>([]);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const pathnames = useMemo(() => {
    if (Object.keys(params).length === 0) {
      return pathname.split("/").filter((item) => item);
    } else {
      return pathname
        .split("/")
        .slice(1)
        .filter((item) => {
          console.log("item", item);
          return item !== params[Object.keys(params)[0]];
        });
    }
  }, [pathname]);
  const handleRouting = (index: number) => {
    let path = "";

    if (index === pathnames.length - 1) {
      return;
    } else {
      for (let i = 0; i <= index; i++) {
        path += `/${pathnames[i]}`;
      }
      router.push(path);
    }
  };
  useEffect(() => {
    const routerPath = pathnames.map((name, index) => {
      return {
        key: index + 1,
        title: (
          <p
            className="text-blue-500 cursor-pointer"
            style={{
              color: `${index === pathnames.length - 1 ? "black" : "blue"}`,
            }}
            onClick={() => {
              handleRouting(index);
            }}
          >
            {capitalizeFirstLetter(name)}
          </p>
        ),
      };
    });
    setBreadItem(routerPath);
  }, [pathname]);
  return (
    <div
      className=""
      style={{
        margin: "24px 20px",
      }}
    >
      <Breadcrumb
        items={[
          {
            key: 0,
            title: <HomeOutlined />,
          },
          ...breadItem,
        ]}
      ></Breadcrumb>
    </div>
  );
};

export default BreadCrumbView;
