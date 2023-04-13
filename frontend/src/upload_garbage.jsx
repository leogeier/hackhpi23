import { PageTitle, Paragraph } from "./components.jsx";

export default function UploadGarbage() {
  return (
    <div>
      <PageTitle>Upload Garbage</PageTitle>
      <Paragraph>Add a photo</Paragraph>
      <label htmlFor="file-upload-garbage" className="transition-all cursor-pointer rounded py-2 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 inline-flex inline-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path className="stroke-white" strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          <path className="stroke-white" strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
        </svg>
        <span className="text-white font-bold px-3">Take a photo</span>
      </label>
      <input onChange={e => {alert(e.target.files[0].name)}}id="file-upload-garbage" className="opacity-0" type="file" accept="image/*" capture="camera" />
    </div>
  );
}
