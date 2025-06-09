import axiosInstance from "./axios";

const getAndStoreCsrfToken = async () => {
  const { data } = await axiosInstance.get("/api/csrf-token");
  localStorage.setItem("csrfToken", data.csrfToken);
};

export default getAndStoreCsrfToken;
