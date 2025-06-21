"use client";

import { Badge, Box } from "@mantine/core";

import { User } from "@/src/models/user.model";

interface Props {
  editMode: "new" | "detail" | "view";
  userId?: string;
  onClose: () => void;
  onCreating?: (data: boolean) => void;
  data?: User;
}

export default function ViewRoleUsersComponent(props: Props) {
  const { editMode, data } = props;

  return (
    <Box>
      {editMode === "view" && (
        <Box className="w-full">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-t border-b border-dashed">
                <td
                  rowSpan={5}
                  className=" p-2 bg-gray-100 text-gray-900 border-r"
                >
                  Address
                </td>
                <td className="p-2 bg-gray-100 text-gray-900 border-r">
                  Country
                </td>
                <td className="p-2 w-3/4">{data?.address?.country}</td>
              </tr>
              <tr className="border-b border-dashed">
                <td className="p-2 bg-gray-100 text-gray-900 border-r">City</td>
                <td className="p-2 w-3/4">{data?.address?.city}</td>
              </tr>
              <tr className="border-b border-dashed">
                <td className="p-2 bg-gray-100 text-gray-900 border-r">
                  Subcity
                </td>
                <td className="p-2 w-3/4">{data?.address?.subcity}</td>
              </tr>
              <tr className="border-b border-dashed">
                <td className="p-2 bg-gray-100 text-gray-900 border-r">
                  Woreda
                </td>
                <td className="p-2 w-3/4">{data?.address?.woreda}</td>
              </tr>
              <tr className="border-b border-dashed">
                <td className="p-2 bg-gray-100 text-gray-900 border-r">
                  Kebele
                </td>
                <td className="p-2 w-3/4">{data?.address?.kebele}</td>
              </tr>
              <tr className="border-b border-dashed">
                <td
                  colSpan={2}
                  className=" p-2 bg-gray-100 text-gray-900 border-r"
                >
                  Job
                </td>
                <td colSpan={2} className="p-2 w-3/4">
                  {data?.jobTitle}
                </td>
              </tr>
              <tr className="border-b border-dashed">
                <td
                  colSpan={2}
                  className="p-2 bg-gray-100 text-gray-900 border-r"
                >
                  Status
                </td>
                <td colSpan={2} className="p-2 w-3/4">
                  <Badge
                    color={data?.isActive ? "green" : "red"}
                    variant="light"
                  >
                    {data?.isActive ? "Active" : "Inactive"}
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </Box>
      )}
    </Box>
  );
}
