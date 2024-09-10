import { Outlet, useNavigate } from "react-router-dom";
import Layout from "./Layout/Layout";

const ProtectedRoutes = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoutes;
