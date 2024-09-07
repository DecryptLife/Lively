import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAxiosInterceptors = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Setting up Axios Interceptor");

    // Set up Axios response interceptor
    const interceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          console.log("Token expired");
          // Navigate to login or handle token refresh
          //   navigate("/login"); // Redirect to login page
        }
        return Promise.reject(error);
      }
    );

    // Cleanup function to eject the interceptor when the component unmounts
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]); // Ensure navigate is passed as a dependency
};
export default useAxiosInterceptors;
