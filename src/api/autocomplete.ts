import useCallApi from "@/hooks/useCallApi";

function AutoCompleteApi() {
  const { UseGet } = useCallApi();
  const GetAutoCompleteApi = (params: object) => {
    const url = "/v1/group/auto-complete";
    return UseGet<any>({
      url,
      requiredToken: true,
      params,
    });
  };
  return { GetAutoCompleteApi };
}
export default AutoCompleteApi;
