import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "../store/store";
import ToastProvider from "../components/ui/ToastProvider";

const GOOGLE_CLIENT_ID =
  "826399908958-nn2ifkfg8lkne6c83fhq6c0cdnoth860.apps.googleusercontent.com";

export default function AppProviders({ children }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <ToastProvider />
        {children}
      </Provider>
    </GoogleOAuthProvider>
  );
}
