import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import Event from "./pages/dashboard/event";
import CreateEvent from "./pages/dashboard/createEvent";

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
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Campaigns",
        path: "/campaigns",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Events",
        path: "/events",
        element: <Event />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Create Event",
        path: "/create/event",
        element: <CreateEvent />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
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
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
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
        element: <Profile />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Logout",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
