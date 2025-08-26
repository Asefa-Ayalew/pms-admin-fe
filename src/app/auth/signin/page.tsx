"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import classes from "./AuthenticationImage.module.css";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import clsx from "clsx";
import { notifications } from "@mantine/notifications";
import { LoginSchema } from "@/src/schemas/login-schema";
import { AppError } from "@/src/models/app-interfaces";
import { AccessibleLoadingOverlay } from "@/src/shared/component/loading-overlay/accessible-loading-overlay";

type FormSchema = z.infer<typeof LoginSchema>;

export default function Login() {
  const { data: session, status } = useSession();
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
  });
  console.log("Error", errorMessage, session);
  const onSubmit = async (data: FormSchema) => {
    try {
      setLoading(true);
      console.log("Submitting login form with data:", data);
      setErrorMessage(""); // Clear previous error message
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      console.log("Sign-in result:", result);
      if (result?.error) {
        setErrorMessage("Invalid email or password");
        notifications.show({
          title: "Error",
          message:
            result.error === "Configuration"
              ? "Check your email or password"
              : "Error, try again",
          color: "red",
        });
      } else {
        setLoading(false);
        router.replace("/");
      }
    } catch (error: unknown) {
      console.error("Error during sign-in:", error);
      notifications.show({
        title: "Error",
        message:
          (error as AppError).error?.data?.message ||
          "An unexpected error occurred. Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [router, status]);

  if (status === "loading") {
    return (
      <AccessibleLoadingOverlay visible={true}>
        <div aria-hidden="true" className="h-screen w-full" />
      </AccessibleLoadingOverlay>
    );
  }
  return (
    <Box className="min-h-screen flex justify-center items-center">
      <Card
        radius="md"
        p={30}
        className="shadow-2xl border border-gray-200 min-w-[400px] w-[500px] bg-slate-200"
      >
        <Stack align="center" justify="center" gap={20}>
          <Image
            src="/logos/logo.png"
            alt="Yene Properties"
            width={120}
            height={60}
          />
          <Title
            order={3}
            className={clsx(classes.title, "text-2xl text-slate-600")}
            ta="center"
          >
            Welcome To Yene Properties
          </Title>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-4">
          <Stack>
            <TextInput
              placeholder="Email"
              label="Email"
              {...register("email")}
              error={errors.email?.message}
              classNames={{ input: "border-2 rounded-md px-2 py-5" }}
            />
            <PasswordInput
              placeholder="Password"
              label="Password"
              {...register("password")}
              error={errors.password?.message}
              classNames={{ input: "border-2 rounded-md px-2 py-5" }}
            />
            <Button
              variant="filled"
              bg="primary.4"
              type="submit"
              loading={isLoading}
              className="w-full h-12"
            >
              Login
            </Button>
          </Stack>
        </form>
      </Card>
    </Box>
  );
}
