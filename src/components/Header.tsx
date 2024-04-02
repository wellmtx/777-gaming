import { DateRange } from "react-day-picker";
import { DatePicker } from "./DatePicker";

interface HeaderProps {
  searchDate: DateRange | undefined;
  setSearchDate: (date: DateRange | undefined) => void;
}

export function Header({ searchDate, setSearchDate }: HeaderProps) {
  return (
    <header className="flex justify-between items-center w-full">
      <h1 className="text-3xl font-semibold">Dashboard</h1>

      <div className="rounded-md">
        <DatePicker searchDate={searchDate} setSearchDate={setSearchDate} />
      </div>
    </header>
  );
}
