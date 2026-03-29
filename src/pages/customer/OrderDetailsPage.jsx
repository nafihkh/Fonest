import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useIsMobile from "../../hooks/useIsMobile";
import OrderDetailsMobile from "../../components/customer/Mobile/OrderDetails";
import OrderDetailsDesktop from "../../components/customer/Desktop/OrderDetails";
import MobileLayout from "../../components/layout/MobileLayout";
import {
  fetchOrderById,
  selectSelectedOrder,
  selectSelectedOrderLoading,
  selectSelectedOrderError,
} from "../../store/slices/orderSlice";

import {
  fetchHomeProducts,
  selectFeaturedProducts,
  selectLatestProducts,
} from "../../store/slices/productSlice";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const isMobile = useIsMobile(768);

  const order = useSelector(selectSelectedOrder);
  const loading = useSelector(selectSelectedOrderLoading);
  const error = useSelector(selectSelectedOrderError);
  const [search, setSearch] = useState("");

  const featuredProducts = useSelector(selectFeaturedProducts);
  const latestProducts = useSelector(selectLatestProducts);


  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchHomeProducts());
  }, [dispatch]);
  useEffect(() => {
    if (!id) return;

    dispatch(fetchOrderById(id));

    const interval = setInterval(() => {
        dispatch(fetchOrderById(id));
    }, 15000);

    return () => clearInterval(interval);
  }, [dispatch, id]);

  const relatedProducts =
    featuredProducts?.length > 0 ? featuredProducts : latestProducts;

  if (isMobile) {
    return (
        <MobileLayout
        headerProps={{
            searchValue: search,
            onSearchChange: setSearch,
            showDelivery: false,
        }}
        >
        <OrderDetailsMobile
            order={order}
            loading={loading}
            error={error}
            relatedProducts={relatedProducts}
        />
      </MobileLayout>
    );
  }

  return <OrderDetailsDesktop />;
}