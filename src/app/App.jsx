import { Outlet } from "react-router-dom";
import AuthBootstrap from "./AuthBootstrap";
import ThemeBootstrap from "../components/ui/ThemeBootstrap";

export default function App() {
    return (
     
    <AuthBootstrap>
       <ThemeBootstrap />
      <Outlet />
      
    </AuthBootstrap>
  
  );
}