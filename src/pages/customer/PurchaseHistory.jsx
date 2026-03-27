import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useIsMobile from "../../hooks/useIsMobile";
import PurchaseHistoryMobileView from "../../components/customer/Mobile/ProductDetailsMobile";
import PurchaseHistoryDesktopView from "../../components/customer/Desktop/PurchaseHistory";
import MobileLayout from "../../components/layout/MobileLayout";
import {
  fetchProductById,
  selectProductById,
  selectProductsLoadingDetails,
  selectProductsErrorDetails,
} from "../../store/slices/productSlice";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const isMobile = useIsMobile(768);
  const [search, setSearch] = useState("");

  const product = useSelector(selectProductById(id));
  const loading = useSelector(selectProductsLoadingDetails);
  const error = useSelector(selectProductsErrorDetails);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  const sharedProps = {
    product,
    loading,
    error,
  };

  if (isMobile) {
    return (
      <MobileLayout
        headerProps={{
          searchValue: search,
          onSearchChange: setSearch,
          showDelivery: false,
        }}
      >
        <PurchaseHistoryMobileView {...sharedProps} />
      </MobileLayout>
    );
  }

  return <PurchaseHistoryDesktopView {...sharedProps} />;
}