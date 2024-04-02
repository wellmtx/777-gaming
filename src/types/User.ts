export interface User {
  id: number;
  name: string;
  newUser: boolean;
  blocked: boolean;
  kyc: "approved" | "pending";
  createdAt: Date;
}
