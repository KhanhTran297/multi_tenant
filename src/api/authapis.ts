import useCallApi from "@/hooks/useCallApi";

function AuthApi() {
  const { UsePost, UseGet } = useCallApi();
  const loginApi = (data: object) => {
    const url = "/api/token";
    return UsePost<any>({
      url,
      requiredToken: false,
      basicAuth: true,
      auth: { username: "abc_client", password: "abc123" },
      data,
    });
  };
  return { loginApi };
}
export default AuthApi;
