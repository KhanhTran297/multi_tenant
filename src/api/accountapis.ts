import useCallApi from "@/hooks/useCallApi";

function AccountApi() {
  const { UseGet, UsePost, UseDelete, UseEdit } = useCallApi();
  const getProfileApi = () => {
    const url = "/v1/account/profile";
    return UseGet<any>({ url, requiredToken: true });
  };
  const listAccountApi = (params: object) => {
    const url = "/v1/account/list";
    return UseGet<any>({ url, requiredToken: true, params });
  };
  const createNewAdminApi = (data: object) => {
    const url = "/v1/account/create-admin";
    return UsePost<any>({ url, requiredToken: true, data });
  };
  const deleteAdminApi = (id: any) => {
    const url = `/v1/account/delete/${id}`;
    return UseDelete<any>({ url, requiredToken: true });
  };
  const getDetailAdminApi = (id: any) => {
    const url = `/v1/account/get/${id}`;
    return UseGet<any>({ url, requiredToken: true });
  };
  const updateAdminApi = (data: object) => {
    const url = "/v1/account/update_admin";
    return UseEdit<any>({ url, requiredToken: true, data });
  };
  return {
    getProfileApi,
    listAccountApi,
    createNewAdminApi,
    deleteAdminApi,
    getDetailAdminApi,
    updateAdminApi,
  };
}
export default AccountApi;
