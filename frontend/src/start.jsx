import { Link } from "react-router-dom";

export default function Start() {
  return (
    <div>
      <h1>Start page</h1>
      <ul>
        <li><Link to="map">map</Link></li>
        <li><Link to="clean">clean</Link></li>
        <li><Link to="upload">upload garbage</Link></li>
      </ul>
    </div>
  );
}
