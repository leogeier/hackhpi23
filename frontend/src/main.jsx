import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Start from "./start.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Start />,
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
