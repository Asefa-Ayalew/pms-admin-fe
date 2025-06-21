import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
type Props = {
  title: string;
  desc: string;
  confirmLabel: string;
  route?: string;
  navigate?: AppRouterInstance;
};

export default function DeleteModal({
  title,
  desc,
  confirmLabel,
  route,
  navigate,
}: Props) {
  return modals.openConfirmModal({
    title: title,
    centered: true,
    children: <Text size="sm">{desc}</Text>,
    labels: { confirm: confirmLabel, cancel: "Cancel" },
    confirmProps: { color: "red" },
    onCancel: () => console.log("Cancel"),
    onConfirm: async () => {
      await confirm();
      route && navigate && navigate.replace(route);
    },
  });
}
