import { PageTitle, Paragraph } from "./components.jsx";

import {
  useNavigate,
} from "react-router-dom";

const length_options = [200, 400, 600, 800, 1000]; // meters

function TimeButton(props) {
  let timeNum;
  let timeUnit;
  const navigate = useNavigate();
  if (props.meters < 1000) {
    timeNum = props.meters;
    timeUnit = "Meter";
  } else {
    timeNum = Math.round(props.meters / 1000);
    timeUnit = "Kilometer";
  }
  const timeText = `${timeNum.toString()} ${timeUnit}${timeNum === 1 ? "" : "s"}`;
  return (
  <button className="transition-all rounded bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2 px-4 m-2 hover:scale-110" 
  onClick={() => navigate(`/?length=${props.meters}`)}>{timeText}</button>);
}

export default function Route() {
  return (
    <div>
      <PageTitle>Clean Page</PageTitle>
      <Paragraph>How long do you want your trip to be?</Paragraph>
      <div className="my-5">
        {length_options.map(meters => <TimeButton key={meters} meters={meters} />)}
      </div>
    </div>
  );
}
