import { PageTitle, Paragraph } from "./components.jsx";

const time_options = [15, 30, 60, 120, 180]; // minutes

function TimeButton(props) {
  let timeNum;
  let timeUnit;
  if (props.minutes < 60) {
    timeNum = props.minutes;
    timeUnit = "minute";
  } else {
    timeNum = Math.round(props.minutes / 60);
    timeUnit = "hour";
  }
  const timeText = `${timeNum.toString()} ${timeUnit}${timeNum === 1 ? "" : "s"}`;
  return (<button className="transition-all rounded bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2 px-4 m-2 hover:scale-110" onClick={() => alert(timeText)}>{timeText}</button>);
}

export default function Clean() {
  return (
    <div>
      <PageTitle>Clean Page</PageTitle>
      <Paragraph>How long do you want your trip to be?</Paragraph>
      <div className="my-5">
        {time_options.map(minutes => <TimeButton key={minutes} minutes={minutes} />)}
      </div>
    </div>
  );
}
