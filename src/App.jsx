import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import useUserStore from "./store/store";

function App() {
  const store = useUserStore();
  const {user,isAuthenticated} = useUserStore();
  console.log(store);
  console.log(user);
  console.log(isAuthenticated);
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}

export default App;
