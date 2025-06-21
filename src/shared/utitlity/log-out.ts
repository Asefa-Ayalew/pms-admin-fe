import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { getSession, signOut } from "next-auth/react";

const handleLogout = async () => {
  try {
    const session = await getSession();
    console.log("🚀 ~ handleLogout ~ session:", session?.accessToken);

    if (session?.accessToken) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_API}/auth/logout`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${session?.accessToken}`,
        },
      });
      await signOut();
      notifications.show({
        title: "Logout successful",
        message: "You have been logged out",
        color: "green",
      });
      return true;
    }
    modals.closeAll();
    return false;
  } catch (error) {
    modals.closeAll();
    notifications.show({
      title: "Logout failed",
      message: "Please try again later" + error,
      color: "red",
    });
    return false;
  }
};

export default handleLogout;
