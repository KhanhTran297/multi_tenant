import useCallApi from "@/hooks/useCallApi";

export default function RoleApis() {
  const { UseDelete, UseEdit, UseGet, UsePost } = useCallApi();
  const getListRoleApi = (params: object) => {
    const url = "/v1/group/list";
    return UseGet<any>({ url, requiredToken: true, params });
  };
  const getDetailRoleApi = (id: number) => {
    const url = `/v1/group/get/${id}`;
    return UseGet<any>({ url, requiredToken: true });
  };
  const editRoleApis = (data: object) => {
    const url = "/v1/group/update";
    return UseEdit<any>({ url, requiredToken: true, data });
  };
  return { getListRoleApi, getDetailRoleApi, editRoleApis };
}
