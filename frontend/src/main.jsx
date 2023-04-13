import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Start from "./start.jsx";
import Map from "./map.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Start />,
  },
  {
    path: "/map",
    element: <Map />,
  },
]);

export default function Main() {
  return (
    <div className="m-3">
      <h1 className="text-sm font-bold">Project Name</h1>
      <RouterProvider router={router} />
    </div>
  );
}
