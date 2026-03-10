import { useDispatch, useSelector } from "react-redux";
import NotificationToast from "./NotificationToast";
import { hideToast, clearToast } from "../../store/slices/toastSlice";

export default function ToastProvider() {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.toast);

  const handleClose = () => {
    dispatch(hideToast());

    setTimeout(() => {
      dispatch(clearToast());
    }, 200);
  };

  return (
    <NotificationToast
      open={toast.open}
      type={toast.type}
      title={toast.title}
      message={toast.message}
      autoCloseMs={toast.autoCloseMs}
      onClose={handleClose}
    />
  );
}