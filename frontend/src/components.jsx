export function PageTitle(props) {
  return (<h1 className="text-3xl font-bold my-3">{props.children}</h1>);
}

export function Paragraph(props) {
  return (<p className="my-3">{props.children}</p>);
}
