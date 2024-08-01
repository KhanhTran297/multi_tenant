import useCallApi from "@/hooks/useCallApi";

export default function DbConfigApis() {
  const { UseGet, UseEdit } = useCallApi();
  const getDetailDbConfigApi = (id: string) => {
    const url = `/v1/db-config/get/${id}`;
    return UseGet<any>({ url, requiredToken: true });
  };
  const updateDbConfigApi = (data: object) => {
    const url = `/v1/db-config/update`;
    return UseEdit({ url, requiredToken: true, data });
  };
  return { getDetailDbConfigApi, updateDbConfigApi };
}
