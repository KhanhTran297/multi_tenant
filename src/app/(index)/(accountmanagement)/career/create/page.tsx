"use client";
import CareerApis from "@/api/careerapis";
import UploadApi from "@/api/file";
import SubmitButton from "@/components/SubmitButton";
import {
  DeleteOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  Form,
  GetProp,
  Input,
  message,
  Select,
  Upload,
  UploadProps,
} from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
const StatusItems = [
  {
    value: 0,
    label: "Inactive",
  },
  {
    value: 1,
    label: "Active",
  },
];
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};
const { createCareerApi } = CareerApis();
const { uploadFileApi } = UploadApi();
export default function NewCareerPage() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const { mutateAsync: uploadFile } = useMutation({
    mutationKey: ["upload-image"],
    mutationFn: uploadFileApi,
  });
  const handleChange: UploadProps["onChange"] = (info) => {
    // if (info.file.status === "uploading") {
    //   setLoading(true);
    //   return;
    // }
    console.log("info", info);
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  const [form] = Form.useForm();
  const router = useRouter();
  const { mutateAsync: createCareer, isPending } = useMutation({
    mutationKey: ["create-career"],
    mutationFn: createCareerApi,
  });
  const onFinish = (values: any) => {
    const fomData = { file: values.avatar.file.originFileObj, type: "avatar" };

    uploadFile(fomData).then((res: any) => {
      const data = {
        avatarPath: "",
        bannerPath: "",
        careerName: values.careerName,
        email: values.email,
        fullName: values.fullName,
        hotline: values.hotline,
        lang: "en",
        logoPath: res.data.filePath,
        password: values.password,
        phone: values.phone,
        settings: "{}",
        status: values.status,
        tenantId: values.tenantId,
        username: values.username,
      };
      createCareer(data).then((res) => {
        message.success("Create new career successfully!");
        form.resetFields();
      });
    });
    // const data = {
    //   avatarPath: "",
    //   bannerPath: "",
    //   careerName: values.careerName,
    //   email: values.email,
    //   fullName: values.fullName,
    //   hotline: values.hotline,
    //   lang: "en",
    //   logoPath: "logoPath",
    //   password: values.password,
    //   phone: values.phone,
    //   settings: "{}",
    //   status: values.status,
    //   tenantId: values.tenantId,
    //   username: values.username,
    // };
  };
  const onClear = () => {
    form.resetFields();
  };
  return (
    <div className=" flex ">
      <Form
        form={form}
        name="createnewadmin"
        onFinish={onFinish}
        layout="horizontal"
        style={{
          display: "grid",
          gridTemplateColumns: "50% 50%",
          width: "100%",
        }}
      >
        <div className=" h-full flex-col flex justify-center  items-center">
          <Form.Item
            name="avatar"
            rules={[{ required: true, message: "Please input logoPath!" }]}
          >
            <Upload
              name="logoPath"
              listType="picture-card"
              className="avatar-uploader saosao"
              showUploadList={false}
              // action={(file) => {
              //   console.log(file);
              //   return file;

              //   // upLoadImage({ file: value, type: "avatar" });
              // }}
              // customRequest={}

              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="avatar"
                  style={{ width: "100%", height: "100%" }}
                  layout="fill"
                  className=" object-cover rounded-md"
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
        </div>
        <div className="flex flex-col gap-[30px]">
          <div className="flex flex-row justify-between gap-3">
            <Form.Item
              label="Career Name"
              name="careerName"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[{ required: true, message: "Please input careername!" }]}
            >
              <Input placeholder="career name"></Input>
            </Form.Item>
            <Form.Item
              label="Tenant ID"
              name="tenantId"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[
                { required: true, message: "Please input your fullname!" },
              ]}
            >
              <Input placeholder="Fullname"></Input>
            </Form.Item>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <Form.Item
              label="Leader"
              name="fullName"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[
                {
                  required: true,
                  message: "Please input fullname!",
                },
              ]}
            >
              <Input placeholder="fullname" />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[
                { required: true, message: "Please input your phone!" },
                {
                  pattern: /^[0-9]*$/,
                  message: "The phone number must be numeric!",
                },
                {
                  min: 10, // Adjust the minimum length as needed
                  message: "The phone number must be at least 10 digits long!",
                },
              ]}
            >
              <Input placeholder="Phone" />
            </Form.Item>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <Form.Item
              label="Email"
              name="email"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              label="Hotline"
              name="hotline"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[
                { required: true, message: "Please input hotline!" },
                {
                  pattern: /^[0-9]*$/,
                  message: "The phone number must be numeric!",
                },
                {
                  min: 10, // Adjust the minimum length as needed
                  message:
                    "The hotline number must be at least 10 digits long!",
                },
              ]}
            >
              <Input placeholder="hotline" />
            </Form.Item>
          </div>
          <div className="flex flex-row justify-between gap-3">
            <Form.Item
              label="Username"
              name="username"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[{ required: true, message: "Please input username!" }]}
            >
              <Input placeholder="username"></Input>
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[{ required: true, message: "Please choose status!" }]}
            >
              <Select
                placeholder="status"
                allowClear
                options={StatusItems}
              ></Select>
            </Form.Item>
          </div>
          <div className="flex flex-row justify-between gap-3 mb-10">
            <Form.Item
              label="Password"
              name="password"
              layout="vertical"
              style={{ width: "50%" }}
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmpassword"
              layout="vertical"
              style={{ width: "50%" }}
              dependencies={["password"]} // Dependencies to track fields to trigger validation
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="ConfirmPassword" />
            </Form.Item>
          </div>

          <div className="flex flex-row justify-end gap-4  ">
            <Button
              type="default"
              danger
              onClick={() => router.push("/career")}
              icon={<DeleteOutlined style={{ color: "red" }} />}
            >
              Cancel
            </Button>

            <SubmitButton form={form} isLoading={isPending}>
              Create
            </SubmitButton>
          </div>
        </div>
      </Form>
    </div>
  );
}
