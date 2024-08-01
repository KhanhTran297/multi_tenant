"use client";
import React, { useEffect, useState } from "react";
import type { FormInstance } from "antd";
import { Button, Form } from "antd";
import { FormOutlined } from "@ant-design/icons";
interface SubmitButtonProps {
  form: FormInstance;
  children: React.ReactNode;
  isLoading?: boolean;
}
export default function SubmitButton({
  form,
  children,
  isLoading,
}: SubmitButtonProps) {
  const [submittable, setSubmittable] = useState<boolean>(false);
  const values = Form.useWatch([], form);
  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);
  return (
    <Button
      type="primary"
      htmlType="submit"
      disabled={!submittable}
      loading={isLoading}
      icon={<FormOutlined />}
    >
      {children}
    </Button>
  );
}
