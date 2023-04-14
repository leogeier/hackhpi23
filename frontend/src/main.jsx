import {
  createBrowserRouter,
  RouterProvider,
  useNavigate, 
  Link,
  Outlet,
} from "react-router-dom";
import Map from "./map.jsx";
import Route from "./route.jsx";
import Help from "./help.jsx";

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function uploadReport(e) {
  const photo = e.target.files[0];
  navigator.geolocation.getCurrentPosition(onCoordSuccess, onCoordsError, options);
  
  function onCoordSuccess(pos) {
    let formData = new FormData();
    formData.append("file", photo);
    fetch(`/api/upload/photo?x=${pos.coords.longitude}&y=${pos.coords.latitude}`, {method: "PUT", body: formData})
    .then(function (response){location.reload()}); 
  }

  function onCoordsError(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`)
  }
}

function cleanMarker(e) {
  navigator.geolocation.getCurrentPosition(onCoordSuccess, onCoordsError, options);
  
  function onCoordSuccess(pos) {
    fetch(`/api/cleaned?x=${pos.coords.longitude}&y=${pos.coords.latitude}`, {method: "PUT"})
    .then(function (response){location.reload()}); 
  }

  function onCoordsError(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`)
  }

}

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
        path: "/route",
        element: <Route/>,
      },
      {
        path: "/help",
        element: <Help/>,
      },
    ]
  },
]);

function Content() {
  return (
    <div>
      <div id="navbar" className="grid grid-cols-6">
        <Link to="/" className="col-span-3"><h1 className="transition-all font-bold text-xl italic text-emerald-200 hover:text-emerald-300">No More Dragons</h1></Link> 
        <div>
          <label htmlFor="file-upload-garbage" className="transition-all py-2 px-4 cursor-pointer rounded bg-red-600 hover:bg-red-700 hover:scale-110 active:bg-red-800 inline-flex inline-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-4">
              <path className="stroke-white" strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path className="stroke-white" strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
          </label>
          <input onChange={uploadReport}id="file-upload-garbage" className="opacity-0" type="file" accept="image/*" capture="camera" />
        </div>
        <Link to="/route"><button className="bg-transparent text-xs hover:bg-blue-500 text-blue-700 p-2 font-semibold hover:text-white border border-blue-500 hover:border-transparent rounded">
          Route
        </button></Link>
        <Link to="/"><button className="bg-transparent text-xs hover:bg-green-500 text-green-700 p-2 font-semibold hover:text-white border border-green-500 hover:border-transparent rounded" onClick={cleanMarker}>
          Cleaned
        </button></Link>
      </div>
      <div id="navbar" className="grid grid-cols-10">
      <div className="col-span-9"></div>
        <Link to="/help" ><button className=" bg-blue-500 text-white font-bold rounded px-2 opacity-50">?</button></Link>
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
