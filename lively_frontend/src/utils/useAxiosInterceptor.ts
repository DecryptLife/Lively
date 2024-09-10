// import axios from "axios";
// import { useEffect } from "react";
// import { Navigate } from "react-router-dom";

// const useAxiosInterceptors = () => {
//   //   const navigate = useNavigate();

//   useEffect(() => {
//     console.log("Setting up Axios Interceptor");

//     // Set up Axios response interceptor
//     const interceptor = axios.interceptors.request.use(
//       (response) => {
//         console.log("response received");
//         return response;
//       },
//       (error) => {
//         console.log("In error interceptor");
//         if (error.response && error.response.status === 401) {
//           console.log("Token expired");
//           // Navigate to login or handle token refresh
//           //   navigate("/login"); // Redirect to login page
//         }
//         return Promise.reject(error);
//       }
//     );

//     // Cleanup function to eject the interceptor when the component unmounts
//     return () => {
//       axios.interceptors.response.eject(interceptor);
//     };
//   }, []); // Ensure navigate is passed as a dependency
// };
// export default useAxiosInterceptors;
