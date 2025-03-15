import useUserStore from "@/store/store";
import { Navigate } from "react-router";

const ProtectRoute = ({ children }) => {
  const {isAuthenticated} = useUserStore();
  return <> {isAuthenticated ? children : <Navigate to="/auth/sign-in" />} </>;
};

export default ProtectRoute;