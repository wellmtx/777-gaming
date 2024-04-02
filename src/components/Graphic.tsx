import { AreaChart } from "@tremor/react";
import { ReactNode } from "react";

interface GraphicProps {
  title: string;
  graphic: ReactNode;
}

export function Graphic({ title, graphic }: GraphicProps) {
  return (
    <div className="flex flex-col bg-[#0A0A0A] gap-2 rounded-md">
      <div className="flex justify-between border-b-[1px] border-[#222222] p-6">
        <h1 className="font-semibold text-xl">{title}</h1>
      </div>

      {graphic}
    </div>
  );
}
