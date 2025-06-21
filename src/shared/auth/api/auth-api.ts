import { notifications } from "@mantine/notifications";
import axios from "axios";
import Cookies from "js-cookie";
import { getSession } from "next-auth/react";

export const loading = false;

export async function switchRole(roleId: string) {
  const session = await getSession();
  return axios
    .get(`${process.env.NEXT_PUBLIC_APP_API}/auth/switch-role/${roleId}`, {
      headers: {
        Authorization: `Bearer ${
          session?.accessToken ? session?.accessToken : ""
        }`,
      },
    })
    .then((response) => {
      Cookies.set("accessToken", response.data?.accessToken);
      Cookies.set(
        "currentRole",
        JSON.stringify(
          response?.data?.profile?.userRoles?.map((role: any) => role.role?.key)
        )
      );
      localStorage.setItem("accessToken", response.data?.accessToken);
      localStorage.setItem("refreshToken", response.data?.refreshToken);
      localStorage.setItem(
        "currentRole",
        JSON.stringify(
          response?.data?.profile?.userRoles?.map((role: any) => role.role?.key)
        )
      );
      localStorage.setItem(
        "userRolePermissions",
        JSON.stringify(response?.data?.permissions)
      );
      return response.data;
    })
    .catch(function (error) {
      if (error.response) {
        notifications.show({
          title: "Error",
          color: "red",
          message: "Some thing happened wrong" + error,
        });
      } else if (error.request) {
        notifications.show({
          title: "Error",
          color: "red",
          message: "Check your internet connection",
        });
      } else {
        console.log("Error", error.message);
      }
    });
}
