"use client";
import { useSwitchRoleMutation } from "@/src/app/(features)/role/_store/role.query";
import { userQuery } from "@/src/app/(features)/user/_store/user.query";
import {
  ActionIcon,
  Button,
  Container,
  Flex,
  Stack,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconSwitchHorizontal, IconX } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SwitchRoleModal({ roleId }: { roleId: string }) {
  const [switchRole, { isLoading: isLoadingSwitchRole }] =
    useSwitchRoleMutation();
  const { update } = useSession();
  const router = useRouter();
  return (
    <Container>
      <Stack gap={"sm"}>
        <Flex mt={"md"}>
          <Text variant="h3" fw={600}>
            Switch Role?
          </Text>
          <ActionIcon
            variant="light"
            color="red"
            size={"sm"}
            onClick={() => modals.closeAll()}
            ml={"auto"}
          >
            {" "}
            <IconX />{" "}
          </ActionIcon>
        </Flex>
        <Flex>
          <Text> Are you sure you want to switch role?</Text>
        </Flex>

        <Flex gap={5} justify="end" align={"end"} mt={30}>
          <Button
            variant="outline"
            color="gray"
            className="mr-2 border border-slate-300"
            onClick={() => modals.closeAll()}
            disabled={isLoadingSwitchRole}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            leftSection={<IconSwitchHorizontal />}
            variant="filled"
            loading={isLoadingSwitchRole}
            onClick={async () => {
              try {
                switchRole(roleId)
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .then((response: any) => {
                    return update({
                      accessToken: response.data.accessToken,
                      refreshToken: response.data.refreshToken,
                    });
                  })
                  .then(() => {
                    userQuery.util.invalidateTags(["UserInfo"]);
                    router.replace("/");
                    modals.closeAll();
                  })
                  .catch((error) => {
                    notifications.show({
                      title: "Switch Role failed",
                      message: "Please try again later" + error,
                      color: "red",
                    });
                  });
              } catch (error) {
                notifications.show({
                  title: "Switch Role failed",
                  message: "Please try again later" + error,
                  color: "red",
                });
              }
            }}
          >
            Switch Role
          </Button>
        </Flex>
      </Stack>
    </Container>
  );
}
