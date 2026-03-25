import Profile from "../customer/Profile"
import MobileProfilePage from "../mobile/MobileProfilePage";
import useIsMobile from "../../hooks/useIsMobile";

export default function ProfileEntry() {
  const isMobile = useIsMobile(1024);

  return isMobile ? <MobileProfilePage /> : <Profile />;
}