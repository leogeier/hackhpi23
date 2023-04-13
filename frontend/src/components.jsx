export function PageTitle(props) {
  return (<h1 className="text-4xl font-black my-3">{props.children}</h1>);
}

export function Paragraph(props) {
  return (<p className="my-3">{props.children}</p>);
}
