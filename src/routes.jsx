import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { SignIn, SignUp } from "@/pages/auth";
import Event from "./pages/dashboard/event";
import CreateEvent from "./pages/dashboard/createEvent";
import CreateCampaigns from "./pages/dashboard/campaign";
import Home from "./pages/dashboard/home";
import { Profile } from "./pages/dashboard";
import ProtectRoute from "./layouts/privateRoute";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Home",
        path: "/",
        element: <ProtectRoute><Home /></ProtectRoute>, // ✅ Protected
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Events",
        path: "/events",
        element: <ProtectRoute><Event /></ProtectRoute>, // ✅ Protected
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Create Event",
        path: "/create/event",
        element: <ProtectRoute><CreateEvent /></ProtectRoute>, // ✅ Protected
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />, // ❌ No need for protection
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />, // ❌ No need for protection
      },
    ],
  },
  {
    title: "user",
    layout: "dashboard",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Account",
        path: "/profile",
        element: <ProtectRoute><Profile /></ProtectRoute>, // ✅ Protected
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Logout",
        path: "/sign-up",
        element: <SignUp />, // ❌ Should be Logout instead of SignUp?
      },
    ],
  },
];

export default routes;
