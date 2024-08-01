import useCallApi from "@/hooks/useCallApi";

export default function SeverProviderApis() {
  const { UseGet, UsePost, UseEdit, UseDelete } = useCallApi();
  const getListServerProviderApi = (params: object) => {
    const url = "/v1/server-provider/list";
    return UseGet<any>({ url, requiredToken: true, params });
  };
  const createServerProviderApi = (data: object) => {
    const url = "/v1/server-provider/create";
    return UsePost<any>({ url, requiredToken: true, data });
  };
  const editServerProviderApi = (data: object) => {
    const url = "/v1/server-provider/update";
    return UseEdit<any>({ url, requiredToken: true, data });
  };
  const deleteServerProviderApi = (id: number) => {
    const url = `/v1/server-provider/delete/${id}`;
    return UseDelete<any>({ url, requiredToken: true });
  };
  const getDetailServerProviderApi = (id: number) => {
    const url = `/v1/server-provider/get/${id}`;
    return UseGet<any>({ url, requiredToken: true });
  };
  return {
    getListServerProviderApi,
    createServerProviderApi,
    editServerProviderApi,
    deleteServerProviderApi,
    getDetailServerProviderApi,
  };
}
