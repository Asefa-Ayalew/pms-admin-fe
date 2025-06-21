import { Badge } from "@mantine/core";
import { ExpenseStatus } from "../enum/app.enum";

const ExpenseStatusBadgeColor: Record<ExpenseStatus, string> = {
  [ExpenseStatus.CREATED]: "bg-gray-500",
  [ExpenseStatus.PAID]: "bg-green-500",
  [ExpenseStatus.VOIDED]: "bg-red-500",
  [ExpenseStatus.SUMMARY_GENERATED]: "bg-indigo-500",
  [ExpenseStatus.CANCELLED]: "bg-red-500",
  [ExpenseStatus.PAYMENT_REQUESTED]: "bg-yellow-500",
};

const ExpenseStatusBadgeText: Record<ExpenseStatus, string> = {
  [ExpenseStatus.CREATED]: "Created",
  [ExpenseStatus.PAID]: "Paid",
  [ExpenseStatus.VOIDED]: "Voided",
  [ExpenseStatus.SUMMARY_GENERATED]: "Summary Generated",
  [ExpenseStatus.CANCELLED]: "Cancelled",
  [ExpenseStatus.PAYMENT_REQUESTED]: "Payment Requested",
};

export const ExpenseStatusBadge = ({ status }: { status: ExpenseStatus }) => {
  return (
    <Badge radius="xl" size="sm" className={ExpenseStatusBadgeColor[status]}>
      {ExpenseStatusBadgeText[status]}
    </Badge>
  );
};
