import { CircularProgress } from "@mui/material";

export default function LoaderData({ label }: { label?: string | null }) {
  return (
    <div className="flex justify-center items-center flex-col p-12 gap-3">
      <CircularProgress className="" />
      <p>{label}</p>
    </div>
  );
}
