import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
} from "react-router-dom";
import Start from "./start.jsx";
import Map from "./map.jsx";
import Clean from "./clean.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Content />,
    children: [
      {
        path: "",
        element: <Start />,
      },
      {
        path: "/map",
        element: <Map />,
      },
      {
        path: "/clean",
        element: <Clean />,
      },
    ]
  },
]);

function Content() {
  return (
    <div>
      <Link to="/"><h1 className="text-sm font-black italic text-emerald-200">Project Title</h1></Link>
      <Outlet />
    </div>
  );
}

export default function Main() {
  return (
    <div className="m-3">
      <RouterProvider router={router} />
    </div>
  );
}
