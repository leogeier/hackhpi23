import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
} from "react-router-dom";
import Start from "./start.jsx";
import Map from "./map.jsx";
import Clean from "./clean.jsx";
import UploadGarbage from "./upload_garbage.jsx";

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
      {
        path: "/upload",
        element: <UploadGarbage />,
      },
    ]
  },
]);

function Content() {
  return (
    <div>
      <Link to="/"><h1 className="transition-all text-2xl font-bold italic text-emerald-200 hover:text-emerald-300">Project Title</h1></Link>
      <Outlet />
    </div>
  );
}

export default function Main() {
  return (
    <div className="text-lg flex justify-center">
      <div className="w-full max-w-md m-6">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}
