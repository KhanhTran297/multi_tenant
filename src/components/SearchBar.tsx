"use client";
import React, { useCallback, useEffect } from "react";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
type SelectType = {
  value: number;
  label: string;
};
type SearchBarType = {
  name: string;
  placeholder: string;
  type: string;
  options?: Array<SelectType>;
  value?: string;
  defaultValue?: string;
};
interface SearchBarProps {
  listSearchItems: Array<SearchBarType>;
  initialValues?: object;
}
const SearchBar = (props: SearchBarProps) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const onFinish = (values: any) => {
    const queryString = createQueryString(values);
    router.push(`${pathname}?${queryString}`);
  };
  const onChange = (value: string) => {};
  const onClear = () => {
    if (props.initialValues) {
      form.resetFields();
      const queryString = createQueryString(props.initialValues);
      router.push(`${pathname}?${queryString}`);
    } else {
      form.resetFields();
      router.push(pathname);
    }
  };
  const onSearch = (value: string) => {
    console.log("search:", value);
  };
  const createQueryString = useCallback(
    (data: any) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.keys(data).forEach((key) => {
        if (data[key] == 0 || data[key]) {
          params.set(key, data[key]);
        } else {
          params.delete(key);
        }
      });

      return params.toString();
    },
    [searchParams]
  );
  useEffect(() => {
    if (props.initialValues) {
      const queryString = createQueryString(props.initialValues);
      router.push(`${pathname}?${queryString}`);
    }
  }, []);
  return (
    <div>
      <Form
        form={form}
        name="horizontal_filter"
        layout="inline"
        onFinish={onFinish}
        initialValues={props.initialValues}
      >
        {props.listSearchItems.map((item, index) => {
          return (
            <Form.Item name={item.name} key={index}>
              {item.type === "input" ? (
                <Input placeholder={item.placeholder}></Input>
              ) : (
                <Select
                  showSearch
                  placeholder={item.placeholder}
                  optionFilterProp="label"
                  onChange={onChange}
                  onSearch={onSearch}
                  style={{ width: 200 }}
                  options={item.options}
                ></Select>
              )}
            </Form.Item>
          );
        })}

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            Search
          </Button>
        </Form.Item>
        <Form.Item>
          <Button
            type="default"
            icon={<ClearOutlined />}
            onClick={() => onClear()}
          >
            Clear
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SearchBar;
