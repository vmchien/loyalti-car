import { getSystemInfo } from "zmp-sdk";
import {
  AnimationRoutes,
  App,
  Route,
  SnackbarProvider,
  ZMPRouter,
} from "zmp-ui";
import { AppProps } from "zmp-ui/app";

import HomePage from "@/pages/index";
import Register from "@/pages/register";
import CreateOrder from "@/pages/create-order";
import ChangePassword from "@/pages/change-password";

const Layout = () => {
  return (
    <App theme={getSystemInfo().zaloTheme as AppProps["theme"]}>
      <ZMPRouter>
          <AnimationRoutes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-order" element={<CreateOrder />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </AnimationRoutes>
      </ZMPRouter>
    </App>
  );
};
export default Layout;
