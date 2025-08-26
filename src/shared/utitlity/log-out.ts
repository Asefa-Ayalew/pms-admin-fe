import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { getSession, signOut } from "next-auth/react";

interface CustomSession {
  accessToken?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const handleLogout = async (): Promise<boolean> => {
  try {
    const session = (await getSession()) as CustomSession | null;
    if (session?.accessToken) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_API}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      await signOut({ callbackUrl: "/auth/signin" });
      localStorage.clear();
      sessionStorage.clear();

      notifications.show({
        title: "Logout successful",
        message: "You have been logged out",
        color: "green",
      });

      return true;
    }

    modals.closeAll();
    return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    modals.closeAll();

    notifications.show({
      title: "Logout failed",
      message: `Please try again later. ${error?.message || error}`,
      color: "red",
    });

    return false;
  }
};

export default handleLogout;
