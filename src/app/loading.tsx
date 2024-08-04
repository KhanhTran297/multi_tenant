"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Loading = () => {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("tokenMeta") !== null) {
      console.log("tokenMeta", localStorage.getItem("tokenMeta"));
      router.push("/admin");
    }
  }, []);
  return <div>....loading</div>;
};

export default Loading;
