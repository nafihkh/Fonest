import PurchaseHistory from "../customer/PurchaseHistory"
import MobileOrders from "../mobile/MobileOrdersPage"
import useIsMobile from "../../hooks/useIsMobile";

export default function PurchaseEntry() {
  const isMobile = useIsMobile(1024);

  return isMobile ? <MobileOrders /> : <PurchaseHistory />;
}