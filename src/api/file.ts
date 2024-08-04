import useCallApi from "@/hooks/useCallApi";

function UploadApi() {
  const { UsePostFile } = useCallApi();
  const uploadFileApi = (data: object) => {
    const url = "/v1/file/upload/s3";
    return UsePostFile<any>({ url, requiredToken: true, data });
  };
  return {
    uploadFileApi,
  };
}
export default UploadApi;
