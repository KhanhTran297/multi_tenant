import useCallApi from "@/hooks/useCallApi";

export default function CareerApis() {
  const { UseGet, UseEdit, UseDelete, UsePost } = useCallApi();
  const getListCareerApi = (params: object) => {
    const url = "/v1/career/list";
    return UseGet<any>({ url, requiredToken: true, params });
  };
  const deleteCareerApi = (id: number) => {
    const url = `/v1/career/delete/${id}`;
    return UseDelete<any>({ url, requiredToken: true });
  };
  const createCareerApi = (data: object) => {
    const url = "/v1/career/create";
    return UsePost<any>({ url, requiredToken: true, data });
  };
  const editCareerApi = (data: object) => {
    const url = "/v1/career/update";
    return UseEdit<any>({ url, requiredToken: true, data });
  };
  const getDetailCareerApi = (id: number) => {
    const url = `/v1/career/get/${id}`;
    return UseGet<any>({ url, requiredToken: true });
  };
  return {
    getListCareerApi,
    deleteCareerApi,
    createCareerApi,
    editCareerApi,
    getDetailCareerApi,
  };
}
