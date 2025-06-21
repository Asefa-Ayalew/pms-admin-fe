"use client";
import {
  ActionIcon,
  Button,
  Container,
  Flex,
  Stack,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";
import handleLogout from "../../utitlity/log-out";

export default function LogoutModal() {
  const [isSignout, setIsSignout] = useState(false);

  return (
    <Container>
      <Stack gap={"sm"}>
        <Flex mt={"md"}>
          <Text variant="h3" fw={600}>
            Logout?
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
          <Text> Are you sure you want to logout?</Text>
        </Flex>

        <Flex gap={5} justify="end" align={"end"} mt={30}>
          <Button
            variant="outline"
            color="gray"
            className="mr-2 border border-slate-300"
            onClick={() => modals.closeAll()}
          >
            Cancel
          </Button>
          <Button
            color="red"
            variant="filled"
            loading={isSignout}
            onClick={async () => {
              setIsSignout(true);
              await handleLogout();
            }}
          >
            Logout
          </Button>
        </Flex>
      </Stack>
    </Container>
  );
}
