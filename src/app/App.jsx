import { Outlet } from "react-router-dom";
import AuthBootstrap from "./AuthBootstrap";

export default function App() {
    return (
    <AuthBootstrap>
      <Outlet />
    </AuthBootstrap>
  );
}