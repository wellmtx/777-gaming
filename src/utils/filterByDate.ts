import { Deposit } from "@/types/Deposit";
import { User } from "@/types/User";
import { Wallet } from "@/types/Wallet";
import { Withdrawal } from "@/types/Withdrawal";
import { DateRange } from "react-day-picker";

export const filterByDate = (
  item: User | Deposit | Wallet | Withdrawal,
  searchDate: DateRange | undefined
) => {
  if (!searchDate) return true;

  if (!searchDate.from && !searchDate.to) return true;

  if (!!searchDate.to && !searchDate.from) {
    return new Date(item.createdAt) <= searchDate.to;
  }

  if (!searchDate.to && !!searchDate.from) {
    return new Date(item.createdAt) >= searchDate.from;
  }

  if (!!searchDate.to && !!searchDate.from) {
    return (
      new Date(item.createdAt) >= searchDate.from &&
      new Date(item.createdAt) <= searchDate.to
    );
  }
};
