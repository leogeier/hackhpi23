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
      <div id="navbar" className="grid grid-cols-4">
        <Link to="/" className="col-span-2"><h1 className="transition-all text-l font-bold italic text-emerald-200 hover:text-emerald-300">No More Dragons</h1></Link>
        <Link to="/upload"><button className="bg-transparent text-sm hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded">
          Report
        </button></Link>
        <Link to="/clean"><button className="bg-transparent text-sm hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded">
          Cleaned
        </button></Link>
      </div>
      <Outlet />
    </div>
  );
}

export default function Main() {
  return (
    <div className="text-lg flex justify-center">
      <div className="w-full max-w-md m-3">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}
