"use client";

import { Button, Container, Group, Text, Title } from "@mantine/core";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container>
      <div className="h-screen flex flex-col items-center justify-center text-center">
        <Title order={1} className="mb-4">
          Something went wrong!
        </Title>
        <Text size="lg" className="mb-4">
          We apologize for the inconvenience. Please try again later.
        </Text>
        <Group>
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="light" onClick={() => (window.location.href = "/")}>
            Return home
          </Button>
        </Group>
      </div>
    </Container>
  );
}
