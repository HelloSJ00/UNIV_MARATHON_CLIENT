import axios from "axios";
import { useAuthStore } from "@/store/auth";

// 401 인터셉터 추가 (클라이언트 환경에서만)
if (typeof window !== "undefined") {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        const { clearAuth } = useAuthStore.getState();
        clearAuth();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
}

export default axios;
