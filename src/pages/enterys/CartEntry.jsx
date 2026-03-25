import Cart from "../customer/Cart"
import MobileCartPage from "../mobile/MobileCartPage";
import useIsMobile from "../../hooks/useIsMobile";

export default function CartEntry() {
  const isMobile = useIsMobile(1024);

  return isMobile ? <MobileCartPage /> : <Cart />;
}