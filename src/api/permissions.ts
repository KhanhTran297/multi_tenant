import useCallApi from "@/hooks/useCallApi";

export default function PermissionsApis() {
  const { UseGet } = useCallApi();
  const getListpermissionsApi = (params: object) => {
    const url = "/v1/permission/list";
    return UseGet<any>({ url, requiredToken: true, params });
  };
  return { getListpermissionsApi };
}
