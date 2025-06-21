import { LoginSchema } from "@/src/schemas/login-schema";
import { RootState } from "@/src/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import clsx from "clsx";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import z from "zod";
import classes from "./AuthenticationImage.module.css";

type FormSchema = z.infer<typeof LoginSchema>;
export default function Login() {
  const isLoading = useSelector(
    (state: RootState) => state.authReducer.loading
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur",
  });

  function onSubmit(data: FormSchema) {
    signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
  }

  return (
    <Paper radius={0} p={30} className="h-screen" bg={"slate.200"}>
      <Stack align="center" justify="center" gap={20}>
        <Image
          src="/logos/logo.png"
          alt="Yene Properties"
          width={120}
          height={60}
        />
        <Title
          order={2}
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
            error={errors.email ? errors.email?.message : ""}
            classNames={{
              input: "border-2 rounded-md px-2 py-5",
            }}
          />
          <PasswordInput
            placeholder="Password"
            label="Password"
            {...register("password")}
            error={errors?.password ? errors.password?.message : ""}
            classNames={{
              input: "border-2 rounded-md px-2 py-5",
            }}
          />
          <Button
            variant="filled"
            // className="bg-primary-500"
            bg={"primary.4"}
            type="submit"
            loading={isLoading}
            className="w-full h-12"
          >
            Login
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
