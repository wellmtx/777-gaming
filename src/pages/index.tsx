import {
  IconArrowDown,
  IconArrowUp,
  IconUserDollar,
  IconUsers,
  IconWallet,
} from "@tabler/icons-react";
import axios from "axios";
import { Inter } from "next/font/google";

import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { Graphic } from "../components/Graphic";
import { User } from "../types/User";
import { Deposit } from "../types/Deposit";
import { formatToCurrency } from "../utils/formatToCurrency";
import { Withdrawal } from "../types/Withdrawal";
import { Wallet } from "../types/Wallet";
import { AreaChart, BarChart } from "@tremor/react";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { filterByDate } from "@/utils/filterByDate";

interface HomeProps {
  users: User[];
  deposits: Deposit[];
  withdrawals: Withdrawal[];
  wallets: Wallet[];
}

const inter = Inter({ subsets: ["latin"] });

export default function Home({
  deposits,
  users,
  wallets,
  withdrawals,
}: HomeProps) {
  const [searchDate, setSearchDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });

  const depositsTotal = deposits
    .filter((item) => filterByDate(item, searchDate))
    .reduce((acc, deposit) => acc + deposit.amount, 0);

  const withdrawalsTotal = withdrawals
    .filter((item) => filterByDate(item, searchDate))
    .reduce((acc, withdrawal) => acc + withdrawal.amount, 0);

  const netDeposit = depositsTotal - withdrawalsTotal;

  const ftds = users
    .filter((item) => filterByDate(item, searchDate))
    .filter((user) => !!user.newUser);
  const ftdsVolume = ftds.reduce((acc, user) => {
    const deposit = deposits
      .filter((item) => filterByDate(item, searchDate))
      .find((deposit) => deposit.userId === Number(user.id));
    if (!deposit) return acc;

    return acc + deposit.amount;
  }, 0);

  const walletsRealTotal = wallets
    .filter((item) => filterByDate(item, searchDate))
    .reduce((acc, wallet) => acc + wallet.balance, 0);

  const walletsBonusTotal = wallets
    .filter((item) => filterByDate(item, searchDate))
    .reduce((acc, wallet) => acc + wallet.bonusBalance, 0);

  const walletsDemoTotal = wallets
    .filter((item) => filterByDate(item, searchDate))
    .reduce((acc, wallet) => acc + wallet.demoBalance, 0);

  const depositsAndWithdrawalsByDate: {
    date: string;
    Depósitos: number;
    Saques: number;
  }[] = [];

  withdrawals
    .filter((item) => filterByDate(item, searchDate))
    .forEach((withdrawal) => {
      const date = new Date(withdrawal.createdAt).toISOString().split("T")[0];
      const day = date.split("-")[2];
      const month = date.split("-")[1];
      const dataDate = `${day}/${month}`;

      const alreadyExistInstance = depositsAndWithdrawalsByDate.find(
        (item) => item.date === dataDate
      );

      if (alreadyExistInstance) {
        alreadyExistInstance.Saques += withdrawal.amount;
      } else {
        depositsAndWithdrawalsByDate.push({
          date: dataDate,
          Depósitos: 0,
          Saques: withdrawal.amount,
        });
      }
    });

  deposits
    .filter((item) => filterByDate(item, searchDate))
    .forEach((deposit) => {
      const date = new Date(deposit.createdAt).toISOString().split("T")[0];
      const day = date.split("-")[2];
      const month = date.split("-")[1];
      const dataDate = `${day}/${month}`;

      const alreadyExistInstance = depositsAndWithdrawalsByDate.find(
        (item) => item.date === dataDate
      );

      if (alreadyExistInstance) {
        alreadyExistInstance.Depósitos += deposit.amount;
      } else {
        depositsAndWithdrawalsByDate.push({
          date: dataDate,
          Depósitos: deposit.amount,
          Saques: 0,
        });
      }
    });

  const diaryFtds: {
    date: string;
    FTDs: number;
  }[] = [];

  ftds.forEach((ftd) => {
    const date = new Date(ftd.createdAt).toISOString().split("T")[0];
    const day = date.split("-")[2];
    const month = date.split("-")[1];
    const dataDate = `${day}/${month}`;

    const alreadyExistInstance = diaryFtds.find(
      (item) => item.date === dataDate
    );

    if (alreadyExistInstance) {
      alreadyExistInstance.FTDs += 1;
    } else {
      diaryFtds.push({
        date: dataDate,
        FTDs: 1,
      });
    }
  });

  const netDepositDiary: {
    date: string;
    Depósitos: number;
  }[] = [];

  deposits
    .filter((item) => filterByDate(item, searchDate))
    .forEach((deposit) => {
      const date = new Date(deposit.createdAt).toISOString().split("T")[0];
      const day = date.split("-")[2];
      const month = date.split("-")[1];
      const dataDate = `${day}/${month}`;

      const alreadyExistInstance = netDepositDiary.find(
        (item) => item.date === dataDate
      );

      if (alreadyExistInstance) {
        alreadyExistInstance.Depósitos += deposit.amount;
      } else {
        netDepositDiary.push({
          date: dataDate,
          Depósitos: deposit.amount,
        });
      }
    });

  withdrawals
    .filter((item) => filterByDate(item, searchDate))
    .forEach((withdrawal) => {
      const date = new Date(withdrawal.createdAt).toISOString().split("T")[0];
      const day = date.split("-")[2];
      const month = date.split("-")[1];
      const dataDate = `${day}/${month}`;

      const alreadyExistInstance = netDepositDiary.find(
        (item) => item.date === dataDate
      );

      if (alreadyExistInstance) {
        alreadyExistInstance.Depósitos -= withdrawal.amount;
      } else {
        netDepositDiary.push({
          date: dataDate,
          Depósitos: -withdrawal.amount,
        });
      }
    });

  return (
    <main
      className={`${inter.className} flex bg-[#181818] text-white min-h-screen flex-col items-center gap-10 p-12`}
    >
      <Header searchDate={searchDate} setSearchDate={setSearchDate} />

      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 grid-flow-row gap-6 w-full">
        <Card
          title="Depósitos"
          fields={{
            VOLUME: formatToCurrency(depositsTotal),
            QUANTIDADE: deposits.length.toString(),
            "TICKET MÉDIO": formatToCurrency(depositsTotal / deposits.length),
          }}
          icon={<IconArrowUp color="#FD6F10" />}
        />

        <Card
          fields={{
            VOLUME: formatToCurrency(withdrawalsTotal),
            QUANTIDADE: withdrawals.length.toString(),
            "TICKET MÉDIO": formatToCurrency(
              withdrawalsTotal / withdrawals.length
            ),
          }}
          title="Saques"
          icon={<IconArrowDown color="#FD6F10" />}
        />

        <Card
          fields={{
            VOLUME: formatToCurrency(netDeposit),
            QUANTIDADE: (deposits.length - withdrawals.length).toString(),
            "TICKET MÉDIO": formatToCurrency(
              netDeposit / (deposits.length - withdrawals.length)
            ),
          }}
          title="NET Deposit"
          icon={<IconArrowDown color="#FD6F10" />}
        />

        <Card
          fields={{
            VOLUME: formatToCurrency(ftdsVolume),
            QUANTIDADE: ftds.length.toString(),
            "TICKET MÉDIO": formatToCurrency(ftdsVolume / ftds.length),
          }}
          title="FTDs"
          icon={<IconUserDollar color="#FD6F10" />}
        />

        <Card
          fields={{
            REGISTROS: users.length.toString(),
            KYC: users
              .filter((user) => user.kyc === "pending")
              .length.toString(),
            BLOQUEADOS: users.filter((user) => user.blocked).length.toString(),
          }}
          title="Usuários"
          icon={<IconUsers color="#FD6F10" />}
        />

        <Card
          fields={{
            REAL: formatToCurrency(walletsRealTotal),
            BÔNUS: formatToCurrency(walletsBonusTotal),
            DEMO: formatToCurrency(walletsDemoTotal),
          }}
          title="Carteiras"
          icon={<IconWallet color="#FD6F10" />}
        />

        <Graphic
          title="Transações diárias"
          graphic={
            <AreaChart
              data={depositsAndWithdrawalsByDate}
              index="date"
              valueFormatter={formatToCurrency}
              categories={["Depósitos", "Saques"]}
              colors={["orange-300", "orange"]}
              className="h-80 p-6 w-full"
            />
          }
        />

        <Graphic
          title="FTD Diário"
          graphic={
            <BarChart
              data={diaryFtds}
              index="date"
              categories={["FTDs"]}
              colors={["orange"]}
              className="h-80 p-6 w-full"
            />
          }
        />

        <Graphic
          title="NET Deposit Diário"
          graphic={
            <AreaChart
              data={netDepositDiary}
              index="date"
              valueFormatter={formatToCurrency}
              categories={["Depósitos"]}
              colors={["orange"]}
              className="h-80 p-6 w-full"
            />
          }
        />
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: users } = await axios.get("http://localhost:8000/users", {
    params: {
      _sort: "createdAt",
    },
  });
  const { data: deposits } = await axios.get("http://localhost:8000/deposits", {
    params: {
      _sort: "createdAt",
    },
  });
  const { data: withdrawals } = await axios.get(
    "http://localhost:8000/withdrawals",
    {
      params: {
        _sort: "createdAt",
      },
    }
  );
  const { data: wallets } = await axios.get("http://localhost:8000/wallets", {
    params: {
      _sort: "createdAt",
    },
  });

  return {
    props: {
      users,
      deposits,
      withdrawals,
      wallets,
    },
  };
};
