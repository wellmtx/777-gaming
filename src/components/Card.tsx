import { ReactNode } from "react";

interface CardProps {
  title: string;
  fields: { [x: string]: string };
  icon: ReactNode;
}

export function Card({ icon, title, fields }: CardProps) {
  return (
    <div className="flex flex-col bg-[#0A0A0A] p-6 gap-2 rounded-md">
      <div className="flex justify-between">
        <h1 className="font-semibold text-xl">{title}</h1>

        {icon}
      </div>

      <div className="flex-col text-[#555555] text-md">
        {Object.entries(fields).map(([key, value]) => (
          <p key={key}>
            {key}: <span className="text-white text-lg">{value}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
