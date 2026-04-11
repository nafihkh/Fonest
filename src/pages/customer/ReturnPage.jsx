import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import useIsMobile from "../../hooks/useIsMobile";
import MobileLayout from "../../components/layout/MobileLayout";
import MobileReturnForm from "../../components/customer/Mobile/ReturnForm";
import DesktopReturnForm from "../../components/customer/Desktop/ReturnForm";
import {
  submitReturn,
  clearSubmitState,
  selectSubmitting,
  selectSubmitError,
  selectSubmitSuccess,
  selectLastSubmittedTicket,
} from "../../store/slices/returnSlice";
import {
  fetchOrderById,
  selectSelectedOrder,
  selectSelectedOrderLoading,
  selectSelectedOrderError,
} from "../../store/slices/orderSlice";

export default function ReturnPage() {
  const dispatch = useDispatch();
  const isMobile = useIsMobile(768);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  // Order state
  const order   = useSelector(selectSelectedOrder);
  const loading  = useSelector(selectSelectedOrderLoading);
  const error    = useSelector(selectSelectedOrderError);

  // Return submit state
  const submitting          = useSelector(selectSubmitting);
  const submitError         = useSelector(selectSubmitError);
  const submitSuccess       = useSelector(selectSubmitSuccess);
  const lastSubmittedTicket = useSelector(selectLastSubmittedTicket);

  useEffect(() => {
    dispatch(clearSubmitState());
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  const handleSubmit = (payload) => {
    dispatch(submitReturn(payload));
  };

  const sharedProps = {
    order,
    loading,
    error: orderId ? error : "No order ID provided in URL",
    submitting,
    submitError,
    submitSuccess,
    lastSubmittedTicket,
    onSubmit: handleSubmit,
  };

  if (isMobile) {
    return (
      <MobileLayout headerProps={{ showDelivery: false }}>
        <MobileReturnForm {...sharedProps} />
      </MobileLayout>
    );
  }

  return <DesktopReturnForm {...sharedProps} />;
}
